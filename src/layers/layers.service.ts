import Tile from 'ol/layer/tile';
import Vector from 'ol/layer/vector';
import OSM from 'ol/source/osm';
import Feature from 'ol/feature';

import { LayersCollection } from '../ol-wrapper/Interfaces/layers-collection.interface';
import { SymbologyService } from '../symbology/symbology.service';
import { BufferMap } from '../ol-wrapper/implements/buffer-map';
import { LAYERS } from './layers.const';
import { VectorSource } from '../ol-wrapper/Interfaces/Export';
import { UpdateService } from '../update/update.service';
import { MapHelper } from '../MapHelper';

export class LayersService {
  private vectorLayers: LayersCollection = {};
  private rasterLayers: LayersCollection = {};
  private symbologyService!: SymbologyService;
  private updateService!: UpdateService;
  private baseMap: BufferMap;
  private tempFeatures: Feature[] = [];

  constructor() {
    this.baseMap = new BufferMap();
  }

  public setServices(symbologyService: SymbologyService, updateService: UpdateService) {
    this.symbologyService = symbologyService;
    this.updateService = updateService;
    this.registerEvent();
  }

  public registerEvent(): void {
    this.updateService.onCreation((data) => {
      const feature = data;
      this.addTempFeatures([feature]);
    });

    this.updateService.onCreationCanceled(() => {
      this.removeTempFeatures();
    });

    this.updateService.onCreationDone(() => {
      this.tempFeatures = [];
    });
  }

  public getBaseMap(): BufferMap {
    return this.baseMap;
  }

  public addVectorLayer(id: string, baseMap = false, useCustomSybology = false, features?: Feature[]): void {
    const vectorSource = MapHelper.createVectorSource(features);

    const vectorLayer = new Vector({
      source: vectorSource,
      updateWhileAnimating: true,
      updateWhileInteracting: true,
    });

    if (useCustomSybology) {
      vectorLayer.setStyle((feature) => {
        if (feature.get('type') === 'edition:measure') {
          return this.symbologyService.styles[feature.get('type')];
        } else {
          const style = this.symbologyService.styleFunction[feature.get('type')];
          if (!style) {
            throw new Error('Style not found in symbology, check if you register all styles properly');
          }
          return style(feature, 0);
        }
      });
    }

    this.vectorLayers[id] = vectorLayer;

    if (baseMap) {
      this.baseMap.addLayer(vectorLayer);
    }
  }

  public createDefaultRasterLayer(): Tile {
    const raster = new Tile({
      source: new OSM(),
    });

    this.rasterLayers[LAYERS.OSM_RASTER_NAME] = raster;

    this.baseMap.addLayer(raster);

    return raster;
  }

  public addFeaturesToLayer(layerId: string, features: Feature[]): void {
    const layer = this.vectorLayers[layerId];
    const source = layer.getSource() as VectorSource;
    source.addFeatures(features);
  }

  public addTempFeatures(features: Feature[]): void {
    this.tempFeatures = features;
    this.addFeaturesToLayer(LAYERS.INTERACTION_LAYER, features);
  }

  public removeTempFeatures(): void {
    const layer = this.vectorLayers[LAYERS.INTERACTION_LAYER];
    const source = layer.getSource() as VectorSource;
    for (let index = 0; index < this.tempFeatures.length; index++) {
      const element = this.tempFeatures[index];
      source.removeFeature(element);
    }
    this.tempFeatures = [];
  }

  public removeFeature(feature: Feature): void {
    const layer = this.vectorLayers[LAYERS.INTERACTION_LAYER];
    const source = layer.getSource() as VectorSource;

    source.removeFeature(feature);
  }

  showFeature(feature: Feature): void {
    const layer = this.vectorLayers[LAYERS.INTERACTION_LAYER];
    const source = layer.getSource() as VectorSource;
    source.addFeature(feature);
  }
}
