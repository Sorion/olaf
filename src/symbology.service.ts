import Feature from 'ol/feature';
import MultiPoint from 'ol/geom/multipoint';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import Icon from 'ol/style/icon';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/Style';

interface StylesMap {
  [key: string]: Style[];
}

export class SymbologyService {
  private stylesIndexed: StylesMap = {};

  public get styles(): StylesMap {
    return this.stylesIndexed;
  }

  constructor() {
    this.registerDefaultMarker();
    this.registerDefaultLineStyle();
    this.registerDefaultLineMeasure();
    this.registerDefaultLineMeasureEdition();
    this.registerDefaultPlane();
  }

  public registerDefaultMarker(): void {
    const image = new Icon({
      scale: 0.3,
      snapToPixel: false,
      src: '../../assets/img/marker.png',
    });
    const style = new Style({
      image,
    });

    this.styles.marker = [style];
  }

  public registerDefaultPlane(): void {
    const image = new Icon({
      scale: 0.3,
      snapToPixel: false,
      src: '../../assets/img/plane.png',
    });
    const style = new Style({
      image,
    });

    this.styles['default:plane'] = [style];
  }

  public getPlaneStyle(heading: number): Style {
    const image = new Icon({
      rotation: heading,
      scale: 0.3,
      snapToPixel: false,
      src: '../../assets/img/plane.png',
    });
    const style = new Style({
      image,
    });

    return style;
  }

  public registerDefaultLineStyle(): void {
    const styles = [
      new Style({
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
        stroke: new Stroke({
          color: 'blue',
          width: 3,
        }),
      }),
      new Style({
        geometry: (feature: any) => {
          // return the coordinates of the first ring of the polygon
          const coordinates = feature.getGeometry().getCoordinates()[0];
          return new MultiPoint(coordinates);
        },
        image: new Circle({
          fill: new Fill({
            color: 'orange',
          }),
          radius: 5,
        }),
      }),
    ];

    this.styles['default:line'] = styles;
  }

  public registerDefaultLineMeasure(): void {
    const styles = [
      new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.1)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 3,
        }),
      }),
      new Style({
        image: new Circle({
          fill: new Fill({
            color: '#ffcc33',
          }),
          radius: 7,
        }),
      }),
    ];

    this.styles['default:measure'] = styles;
  }

  public registerDefaultLineMeasureEdition(): void {
    const styles = [
      new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.1)',
        }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 3,
        }),
      }),
      new Style({
        image: new Circle({
          fill: new Fill({
            color: '#ffcc33',
          }),
          radius: 7,
        }),
      }),
    ];

    this.styles['edition:measure'] = styles;
  }

  public getStyle(feature: Feature): Style[] {
    return this.styles[feature.get('type')];
  }

  public getStyleByName(id: string): Style[] {
    return this.styles[id];
  }
}
