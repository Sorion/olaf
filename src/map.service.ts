import Map from 'ol/map';

import { SymbologyService } from './symbology.service';
import { Viewport } from './ol-wrapper/Viewport';
import { OLInteractionHelper } from './ol-wrapper/ol-interaction.helper';
import { InteractionsService } from './interactions/interactions.service';
import { LayersService } from './layers/layers.service';
import { LAYERS } from './layers/layers.const';
import { INTERACTION } from './interactions/interactions.const';
import { FeaturesService } from './features/features.service';
import { ITransaction } from './interactions/ITransaction';
import { MapState } from './states/map.states.enum';
import { InteractorOptions } from './ol-wrapper/Interfaces/interactor-options.interface';
import { StringBusEvent } from './shared/common/string-bus-event';
import { UpdateService } from './update/update.service';
import { MapHelper } from './MapHelper';
import { UpdateData } from './update/update-data.interface';

export class MapService extends StringBusEvent {
  private viewport!: Viewport;
  private interactionsService!: InteractionsService;
  private layersService!: LayersService;
  private featuresService!: FeaturesService;
  private lastPosition!: Position;
  private isFirstPosition = true;
  private isTracking = false;
  private serviceState!: MapState;

  constructor(
    private readonly symbologyService: SymbologyService,
    private readonly updateService: UpdateService,
  ) {
    super();
    this.initServices();
    this.subscribeToService();
    this.initBaseConfiguration();
  }

  public initServices(): boolean {
    this.viewport = new Viewport();
    this.interactionsService = new InteractionsService();
    this.layersService = new LayersService();
    this.featuresService = new FeaturesService(this.symbologyService);
    return true;
  }

  public subscribeToService(): void {
    this.updateService.onCreationDone(data => {
      this.onCreation(data);
    });

    this.updateService.onCreationCanceled(() => {
      this.cancelCreation();
    });

    this.updateService.onDelete((id: number) => {
      this.onDelete(id);
    });

    this.updateService.onRequestUpdate(data => {
      this.requestUpdate(data);
    });

    this.updateService.onShowFeature((data: any) => {
      this.showFeature(data);
    });

    this.updateService.onHideFeature((data: any) => {
      this.hideFeature(data);
    });

    // ADSB
    this.updateService.onCreateADSB((data: any) => {
      this.createFeatureADSB(data);
    });
    this.updateService.onUpdateADSB((data: any) => {
      this.updateFeatureADSB(data);
    });
    this.updateService.onDeleteADSB((data: string) => {
      this.removeFeatureADSB(data);
    });
  }

  public initBaseConfiguration(): void {
    this.serviceState = MapState.Default;
    const self = this.featuresService.InitSelfMarker();
    this.interactionsService.onNewFeature((transaction: ITransaction) => {
      this.onNewFeature(transaction);
    });

    this.layersService.setServices(this.symbologyService, this.updateService);
    this.layersService.createDefaultRasterLayer();
    this.layersService.addVectorLayer(LAYERS.SELF_LAYER, true, true, [self]);
    this.layersService.addVectorLayer(LAYERS.INTERACTION_LAYER, true, true);
  }

  public onInteractorFinish(callback: any): object {
    return this.subscribe(INTERACTION.INTERACTION_FINISHED, callback);
  }

  public createMap(target: string, extendControl: boolean = false): Map {
    const baseMap = this.layersService.getBaseMap();
    const map = this.viewport.createMap(target, baseMap.getLayers());

    if (extendControl) {
      this.viewport.addExtendedDefaultControlToMap();
    }

    this.interactionsService.onNewInteractor((data: any) => {
      map.addInteraction(data.interactor);
    });

    const line = OLInteractionHelper.getLineInteraction();
    const lineOptions: InteractorOptions = {
      interactor: line,
      autoDisable: false,
      styleID: INTERACTION.DEFAULT_LINE,
      validateBeforeSave: true,
    };
    const measure = OLInteractionHelper.getMeasureInteraction(this.symbologyService, this.viewport.getMap(), false);
    const measureOption: InteractorOptions = {
      autoDisable: false,
      interactor: measure,
      styleID: INTERACTION.DEFAULT_MEASURE,
      validateBeforeSave: false,
    };
    this.interactionsService.registerNewInteractor('line', lineOptions);
    this.interactionsService.registerNewInteractor('measure', measureOption);

    return map;
  }

  /**
   * Set the mini map target to the value passed in parameter then return it
   * @param target The id of the element where the map will be displayed
   * @return Map
   */
  public createMiniMap(target: string): Map {
    const baseMap = this.layersService.getBaseMap();
    const map = this.viewport.CreateMiniMap(target, baseMap.getLayers());
    return map;
  }

  public destroyMap(): void {
    this.viewport.destroyMap();
  }

  public updatePosition(position: Position): void {
    this.lastPosition = position;
    let heading = 0;
    if (!this.isTracking) {
      heading = position.coords.heading as number;
      const mapAngleDeg = MapHelper.convertRadToDegree(this.viewport.getRotation());
      heading += mapAngleDeg;
    }
    if (this.isFirstPosition) {
      this.viewport.centerOn(position, 15);
      this.isFirstPosition = false;
    }
    if (this.isTracking) {
      let mapHeading = position.coords.heading;
      mapHeading = MapHelper.minimizeRotationDegree(mapHeading as number);
      this.viewport.centerOn(position, 15, mapHeading);
    }
    this.featuresService.updateSelfMarker(position, heading);
  }

  public onNewFeature(transaction: ITransaction): void {
    this.interactionsService.stopCurrentInteraction();
    this.publish(INTERACTION.INTERACTION_FINISHED, false);
    if (transaction.validateBeforeSave && this.serviceState === MapState.Interactor) {
      const feature = transaction.feature;
      this.featuresService.setFeatureStyle(feature, transaction.id);
      this.updateService.requestCreation(feature);
    } else {
      this.saveFeature(transaction);
    }
  }

  public saveFeature(transaction: ITransaction): boolean {
    const feature = transaction.feature;
    this.featuresService.setFeatureStyle(feature, transaction.id);
    this.layersService.addFeaturesToLayer(LAYERS.INTERACTION_LAYER, [feature]);
    this.serviceState = MapState.Default;
    this.publish(INTERACTION.INTERACTION_FINISHED, false);
    return true;
  }

  public saveFeatureWithMission(data: UpdateData): void {
    this.featuresService.saveFeature(data);
    this.serviceState = MapState.Default;
    this.publish(INTERACTION.INTERACTION_FINISHED, false);
  }

  public activateInteractor(value: string): boolean {
    if (this.serviceState === MapState.Interactor) {
      return false;
    }
    this.serviceState = MapState.Interactor;
    this.interactionsService.enableInteraction(value);
    return true;
  }

  public cancelInteraction(): void {
    if (this.serviceState === MapState.Default) {
      return;
    }
    this.interactionsService.stopCurrentInteraction();
    this.serviceState = MapState.Default;
  }

  public setTracking(): void {
    this.isTracking = !this.isTracking;
    if (!this.isTracking) {
      this.viewport.centerOn(this.lastPosition, 15);
    }
  }

  // Section UpdateService
  public onCreation(data: UpdateData): void {
    this.saveFeatureWithMission(data);
  }

  public cancelCreation(): void {
    this.serviceState = MapState.Default;
  }

  public onDelete(id: number): void {
    const feature = this.featuresService.deleteFeature(id);
    this.layersService.removeFeature(feature);
  }

  public requestUpdate(mission: any): void {
    const feature = this.featuresService.getOrCreateFeature(mission);
    const options: any = {
      feature,
      mission,
    };
    this.updateService.update(options);
  }

  // Show Hide Binding
  showFeature(mission: any): void {
    const feature = this.featuresService.getOrCreateFeature(mission);
    this.layersService.showFeature(feature);
    this.updateService.showDone(true);
  }

  hideFeature(mission: any): void {
    const feature = this.featuresService.getFeature(mission.id);

    if (!feature) {
      return;
    }

    this.layersService.removeFeature(feature);
    this.updateService.showDone(false);
  }

  // ADSB FEATURE
  createFeatureADSB(adsb: any): void {
    const feature = this.featuresService.createFeatureFromADSB(adsb);
    this.layersService.showFeature(feature);
  }

  updateFeatureADSB(adsb: any): void {
    this.featuresService.updateFeatureFromADSB(adsb);
  }

  removeFeatureADSB(id: string): void {
    const feature = this.featuresService.removeFeaturefromADSB(id);
    this.layersService.removeFeature(feature);
  }
}
