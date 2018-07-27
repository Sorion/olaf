import { BaseMap } from '../Interfaces/base-map.interface';
import Base from 'ol/layer/base';

export class BufferMap implements BaseMap {
  layers: Array<Base>;
  interactions: Array<any>;

  constructor() {
    this.layers = [];
    this.interactions = [];
  }

  public addLayer(layer: Base): void {
    this.layers.push(layer);
  }

  public getLayers(): Array<Base> {
    return this.layers;
  }

  public addInteraction(interactor: any): void {
    this.interactions.push(interactor);
  }

  public getInteractions(): Array<any> {
    return this.interactions;
  }
}
