import Map from 'ol/map';
import FullScreen from 'ol/control/fullscreen';
import ScaleLine from 'ol/control/scaleline';
import View from 'ol/view';
import Base from 'ol/layer/base';
import { MapHelper } from '../../layout/map/services/MapHelper';
import proj from 'ol/proj';
import Coordinate from 'ol';

export class Viewport {
  private map: Map;
  private miniMap: Map;
  private view: View;
  private readonly PARIS_COORD: Coordinate.Coordinate = [2.3488, 48.8534];

  constructor() {
    this.view = new View({
      center: proj.fromLonLat(this.PARIS_COORD),
      zoom: 5,
    });
  }

  public getMap(): Map {
    return this.map;
  }

  public getRotation(): number {
    return this.view.getRotation();
  }

  public centerOn(position: Position, zoom: number = 6, heading: number = 0) {
    const coord = MapHelper.convertPostionToCoord(position);
    const rotation = MapHelper.convertDegreeToRad(heading);
    this.view.animate({
      center: coord,
      zoom,
      rotation,
    });
  }

  public createMap(target: string, layers?: Array<Base>): Map {
    const map = new Map({
      target: target,
      view: this.view,
      layers,
    });
    this.map = map;
    return this.map;
  }

  public CreateMiniMap(target: string, layers?: Array<Base>): Map {
    if (target === undefined || target.length === 0) {
      throw new Error('Error while initialize mini map, target is undefined');
    }
    this.miniMap = new Map({
      target,
      view: this.view,
      layers,
    });
    return this.miniMap;
  }

  public setMapTarget(target: string | undefined): void {
    this.map.setTarget(target);
  }

  public destroyMap(): void {
    this.setMapTarget(undefined);
    this.map = undefined;
  }

  public destroyMiniMap(): void {
    this.miniMap.setTarget = undefined;
    this.miniMap = undefined;
  }

  public destroyViewport(): void {
    this.destroyMap();
    this.destroyMiniMap();
  }

  public addExtendedDefaultControlToMap(): void {
    this.map.addControl(new FullScreen());
    this.map.addControl(
      new ScaleLine({
        units: 'metric',
      }),
    );
  }
}
