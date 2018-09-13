import Feature from 'ol/feature';
import MultiPoint from 'ol/geom/multipoint';
import Circle from 'ol/style/circle';
import Fill from 'ol/style/fill';
import Icon from 'ol/style/icon';
import Stroke from 'ol/style/stroke';
import Style from 'ol/style/Style';
import Text from 'ol/style/text';

import ol from 'ol';
import { createLabelFromFeature } from './symbology.utils';

interface StylesMap {
  [key: string]: Style[];
}

interface StyleFunctionsMap {
  [key: string]: ol.StyleFunction;
}

export class SymbologyService {
  private stylesIndexed: StylesMap = {};
  private styleFunctionsIndexed: StyleFunctionsMap = {};

  public get styles(): StylesMap {
    return this.stylesIndexed;
  }

  public get styleFunction(): StyleFunctionsMap {
    return this.styleFunctionsIndexed;
  }

  constructor() {
    this.registerDefaultMarker();
    this.registerDefaultLineStyle();
    this.registerDefaultLineMeasure();
    this.registerDefaultLineMeasureEdition();
    this.registerDefaultPlane();
    this.registerDefaultLineMeasureFunction();
    // this.registerDefaultLineStyleFunction();
  }

  public addStyleFunction(id: string, func: ol.StyleFunction): void {
    this.styleFunction[id] = func;
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

  public registerDefaultLineStyleFunction(): void {
    const func = (feature: any, resolution: any) => {
      console.log(resolution);
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
          geometry: () => {
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
      return styles;
    };

    this.styleFunctionsIndexed['default:line'] = func;
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
        text: this.createLabel(),
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

  public registerDefaultLineMeasureFunction(): void {
    const line = (feature: Feature | ol.render.Feature, resolution?: any) => {
      console.log(resolution);
      const styles = [
        new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.1)',
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 3,
          }),
          text: createLabelFromFeature(feature),
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

      return styles;
    };

    this.styleFunction['default:measure'] = line;
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

  public createLabel(): Text {
    return new Text({
      backgroundFill: new Fill({
        color: '#fff',
      }),
      text: 'Toto',
      fill: new Fill({
        color: '#000',
      }),
      font: '14px Roboto',
      padding: [4, 4, 4, 4],
    });
  }
}
