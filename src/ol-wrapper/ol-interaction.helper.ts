import Draw from 'ol/interaction/draw';
import Interaction from 'ol/interaction/interaction';
import Map from 'ol/map';
import { MeasureInteractor } from '../interactions/MeasureInteractor';
import { SymbologyService } from '../symbology/symbology.service';
import { INTERACTION } from '../interactions/interactions.const';
import GeometryType from 'ol/geom/GeometryType';

export class OLInteractionHelper {
  static getLineInteraction(): Interaction {
    const draw = new Draw({
      type: GeometryType.MULTI_LINE_STRING,
    });
    draw.setActive(false);
    return draw;
  }

  static getPointMInteraction(): Interaction {
    const draw = new Draw({
      type: GeometryType.POINT,
    });
    draw.setActive(false);
    return draw;
  }

  static getMeasureInteraction(symbologyService: SymbologyService, map: Map, autoDisable = true): MeasureInteractor {
    const style = symbologyService.getStyleByName(INTERACTION.EDITION_MEASURE);
    const draw = new MeasureInteractor(
      {
        type: 'LineString',
        style,
      },
      map,
      autoDisable,
    );
    draw.setActive(false);
    return draw;
  }
}
