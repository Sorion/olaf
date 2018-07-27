import Point from 'ol/geom/point';
import Feature from 'ol/feature';
import MultiLineString from 'ol/geom/multilinestring';
import ol from 'ol';
import { SymbologyService } from '../symbology.service';
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

  public updateSelfMarker(position: Position, heading: number = 0): void {
    const convertedCoord = MapHelper.convertPostionToCoord(position);
    this.selfMarker.setGeometry(new Point(convertedCoord));
    const radian = MapHelper.convertDegreeToRad(heading);
    const style = this.symbologyService.getStyle(this.selfMarker)[0];
    style.getImage().setRotation(radian);
  }

  public saveFeature(data: UpdateData): void {
    this.features[data.missionId] = data.feature;
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
    feature = this.createFeaturesFromMissions([data])[0];
    return feature;
  }

  public createFeaturesFromMissions(datas: any[]): Feature[] {
    const features: Feature[] = [];

    for (let index = 0; index < datas.length; index++) {
      const data = datas[index];
      const feature = this.createFeature(data);
      features.push(feature);
      this.saveFeature({
        missionId: data.id,
        missionName: data.name,
        feature,
      });
    }

    return features;
  }

  public createFeature(data: any): Feature {
    const coords = this.getCoordsFromMissionSteps(data.data);
    const feature = new Feature({
      geometry: new MultiLineString(coords),
      name: data.name,
      type: 'default:line',
    });

    return feature;
  }

  public getCoordsFromMissionSteps(data: any[]): ol.Coordinate[][] {
    const coords: ol.Coordinate[][] = [[]];
    for (let index = 0; index < data.length; index++) {
      const step = data[index];
      const singleCoord = [step.longitude, step.latitude] as ol.Coordinate;
      coords[0].push(singleCoord);
    }
    return coords;
  }

  public createFeatureFromADSB(data: any): Feature {
    const coords = MapHelper.convertLatLonToOL(data.lat, data.lon);
    const feature = new Feature({
      geometry: new Point(coords),
      name: data.hex,
    });
    const radian = MapHelper.convertDegreeToRad(data.track);
    feature.setStyle(this.symbologyService.getPlaneStyle(radian));
    this.features[data.hex] = feature;
    return feature;
  }

  public updateFeatureFromADSB(data: any): void {
    const feature = this.features[data.hex];

    if (!feature) {
      return;
    }

    const coords = MapHelper.convertLatLonToOL(data.lat, data.lon);
    feature.setGeometry(new Point(coords));
    const radian = MapHelper.convertDegreeToRad(data.track);
    feature.setStyle(this.symbologyService.getPlaneStyle(radian));
  }

  public removeFeaturefromADSB(id: string): Feature {
    const feature = this.features[id];
    delete this.features[id];
    return feature;
  }
}
