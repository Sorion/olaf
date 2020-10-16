import Point from 'ol/geom/point';
import Feature from 'ol/feature';
import MultiLineString from 'ol/geom/multilinestring';
import { Coordinate } from 'ol/coordinate';
import { SymbologyService } from '../symbology/symbology.service';
import { Dictionary } from '../shared/common/dictionary.interface.ts';
import { MapHelper } from '../MapHelper';
import { UpdateData } from '../update/update-data.interface';

export class FeaturesService {
  private symbologyService: SymbologyService;
  private selfMarker!: Feature;
  private features: Dictionary<Feature> = {};

  constructor(symbologyService: SymbologyService) {
    this.symbologyService = symbologyService;
  }

  public setFeatureStyle(feature: Feature, styleID: string): Feature {
    feature.setProperties({ type: styleID });
    return feature;
  }

  public InitSelfMarker(): Feature {
    this.selfMarker = new Feature({
      type: 'marker',
    });
    return this.selfMarker;
  }

  public updateSelfMarker(position: Position, heading = 0): void {
    const convertedCoord = MapHelper.convertPostionToCoord(position);
    this.selfMarker.setGeometry(new Point(convertedCoord));
    const radian = MapHelper.convertDegreeToRad(heading);
    const style = this.symbologyService.getStyle(this.selfMarker)[0];
    style.getImage().setRotation(radian);
  }

  public saveFeature(data: UpdateData): void {
    this.features[data.id] = data.feature;
  }

  public deleteFeature(id: number): Feature {
    const feature = this.features[id];
    delete this.features[id];

    return feature;
  }

  public getFeature(id: number): Feature {
    return this.features[id];
  }

  public getOrCreateFeature(data: any): Feature {
    let feature: Feature;
    feature = this.getFeature(data.id);
    if (feature) {
      return feature;
    }
    feature = this.createFeature([data]);
    return feature;
  }

  public createFeature(data: any): Feature {
    const coords = this.getCoordsFromLatLonArray(data.data);
    const feature = new Feature({
      geometry: new MultiLineString(coords),
      name: data.name,
      type: 'default:line',
    });

    return feature;
  }

  public getCoordsFromLatLonArray(data: any[]): Coordinate[][] {
    const coords: Coordinate[][] = [[]];
    for (let index = 0; index < data.length; index++) {
      const step = data[index];
      const singleCoord = [step.longitude, step.latitude] as Coordinate;
      coords[0].push(singleCoord);
    }
    return coords;
  }
}
