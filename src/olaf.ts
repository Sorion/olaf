import MapService from './map.service';
import { UpdateService } from './update/update.service';
import { SymbologyService } from './symbology/symbology.service';

export interface OlafAppInstance {
  updateService: UpdateService;
  mapService: MapService;
  symbologyService: SymbologyService;
}

export class OlafStatic {
  private readonly updateService = new UpdateService();
  private readonly symbologyService = new SymbologyService();
  private mapService!: MapService;

  public create(): OlafAppInstance {
    this.mapService = new MapService(this.updateService, this.symbologyService);
    const instance: OlafAppInstance = {
      updateService: this.updateService,
      mapService: this.mapService,
      symbologyService: this.symbologyService,
    };

    return instance;
  }
}

export const Olaf = new OlafStatic();
