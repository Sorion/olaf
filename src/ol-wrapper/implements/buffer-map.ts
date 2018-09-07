import { BaseMap } from '../Interfaces/base-map.interface';
import Base from 'ol/layer/base';

export class BufferMap implements BaseMap {
  layers: Base[];
  interactions: any[];

  constructor() {
    this.layers = [];
    this.interactions = [];
  }

  public addLayer(layer: Base): void {
    this.layers.push(layer);
  }

  public getLayers(): Base[] {
    return this.layers;
  }

  public addInteraction(interactor: any): void {
    this.interactions.push(interactor);
  }

  public getInteractions(): any[] {
    return this.interactions;
  }
}
