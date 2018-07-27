import Draw from 'ol/interaction/draw';
import Interaction from 'ol/interaction/interaction';
import Feature from 'ol/feature';
import Collection from 'ol/collection';
import Map from 'ol/map';
import { MeasureInteractor } from '../interactions/MeasureInteractor';
import { SymbologyService } from '../symbology.service';
import { INTERACTION } from '../interactions/interactions.const';

export class OLInteractionHelper {
  static getLineInteraction(features?: Collection<Feature>): Interaction {
    const draw = new Draw({
      type: 'MultiLineString',
    });
    draw.setActive(false);
    return draw;
  }

  static getPointMInteraction(): Interaction {
    const draw = new Draw({
      type: 'Point',
    });
    draw.setActive(false);
    return draw;
  }

  static getMeasureInteraction(
    symbologyService: SymbologyService,
    map: Map,
    autoDisable: boolean = true,
  ): MeasureInteractor {
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
