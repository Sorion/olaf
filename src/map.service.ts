import Map from 'ol/map';

import { SymbologyService } from './symbology/symbology.service';
import { Viewport } from './ol-wrapper/Viewport';
import { OLInteractionHelper } from './ol-wrapper/ol-interaction.helper';
import { InteractionsService } from './interactions/interactions.service';
import { LayersService } from './layers/layers.service';
import { LAYERS } from './layers/layers.const';
import { INTERACTION } from './interactions/interactions.const';
import { FeaturesService } from './features/features.service';
import { Transaction } from './interactions/transaction.interface';
import { MapState } from './states/map.states.enum';
import { InteractorOptions } from './ol-wrapper/Interfaces/interactor-options.interface';
import { StringBusEvent } from './shared/common/string-bus-event';
import { UpdateService } from './update/update.service';
import { UpdateData } from './update/update-data.interface';

export default class MapService extends StringBusEvent {
  private viewport!: Viewport;
  private interactionsService!: InteractionsService;
  private layersService!: LayersService;
  private featuresService!: FeaturesService;
  private serviceState!: MapState;

  constructor(private readonly updateService: UpdateService, private readonly symbologyService: SymbologyService) {
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
    this.updateService.onCreationDone((data) => {
      this.onCreation(data);
    });

    this.updateService.onCreationCanceled(() => {
      this.cancelCreation();
    });

    this.updateService.onDelete((id: number) => {
      this.onDelete(id);
    });

    this.updateService.onRequestUpdate((data) => {
      this.requestUpdate(data);
    });

    this.updateService.onShowFeature((data: any) => {
      this.showFeature(data);
    });

    this.updateService.onHideFeature((data: any) => {
      this.hideFeature(data);
    });
  }

  public initBaseConfiguration(): void {
    this.serviceState = MapState.Default;
    // const self = this.featuresService.InitSelfMarker();
    this.interactionsService.onNewFeature((transaction: Transaction) => {
      this.onNewFeature(transaction);
    });

    this.layersService.setServices(this.symbologyService, this.updateService);
    this.layersService.createDefaultRasterLayer();
    // this.layersService.addVectorLayer(LAYERS.SELF_LAYER, true, true, [self]);
    this.layersService.addVectorLayer(LAYERS.INTERACTION_LAYER, true, true);
  }

  public createMap(target: string | HTMLElement, extendControl = false): Map {
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

  //#region Feature
  public onNewFeature(transaction: Transaction): void {
    this.interactionsService.stopCurrentInteraction();
    this.publish(INTERACTION.INTERACTION_FINISHED, false);
    if (transaction.validateBeforeSave && this.serviceState === MapState.Interactor) {
      const feature = transaction.feature;
      this.featuresService.setFeatureStyle(feature, transaction.id);
      this.saveFeature(transaction);
      this.updateService.requestCreation(feature);
    } else {
      this.saveFeature(transaction);
    }
  }

  public saveFeature(transaction: Transaction): boolean {
    const id = 'Feature: ' + Math.floor(Math.random() * 100 + 1).toString();
    const feature = transaction.feature;
    feature.setId(id);
    this.featuresService.setFeatureStyle(feature, transaction.id);
    this.layersService.addFeaturesToLayer(LAYERS.INTERACTION_LAYER, [feature]);
    this.serviceState = MapState.Default;
    this.publish(INTERACTION.INTERACTION_FINISHED, false);
    return true;
  }

  public saveFeatureWithName(data: UpdateData): void {
    this.featuresService.saveFeature(data);
    this.serviceState = MapState.Default;
    this.publish(INTERACTION.INTERACTION_FINISHED, false);
  }

  showFeature(data: any): void {
    const feature = this.featuresService.getOrCreateFeature(data);
    this.layersService.showFeature(feature);
    this.updateService.showDone(true);
  }

  hideFeature(data: any): void {
    const feature = this.featuresService.getFeature(data.id);

    if (!feature) {
      return;
    }

    this.layersService.removeFeature(feature);
    this.updateService.showDone(false);
  }
  //#endregion
  //#region Interactor

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

  public onInteractorFinish(callback: any): any {
    return this.subscribe(INTERACTION.INTERACTION_FINISHED, callback);
  }

  //#endregion
  //#region UpdateService
  public onCreation(data: UpdateData): void {
    this.saveFeatureWithName(data);
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
  //#endregion
}
