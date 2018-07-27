import Interaction from 'ol/interaction/interaction';

import { MapInteractorCollection } from '../ol-wrapper/Interfaces/map-interactor.collection.interface';
import { INTERACTION } from './interactions.const';
import { ITransaction } from './ITransaction';
import { MeasureInteractor } from './MeasureInteractor';
import { InteractorOptions } from '../ol-wrapper/Interfaces/interactor-options.interface';
import { StringBusEvent } from '../shared/common/string-bus-event';

export class InteractionsService extends StringBusEvent {
  private interactions: MapInteractorCollection = {};
  private currentInteraction: string;

  constructor() {
    super();
    this.currentInteraction = 'none';
  }

  public registerNewInteractor(id: string, interactorOptions: InteractorOptions): void {
    if (interactorOptions.autoDisable) {
      this.setAutoDisableCallback(interactorOptions.interactor);
    }
    this.setFinishCallback(interactorOptions);
    this.interactions[id] = interactorOptions;
    this.publish(INTERACTION.NEW_INTERACTOR, interactorOptions);
  }

  public enableInteraction(id: string): void {
    const interactor = this.interactions[id];
    if (id === 'measure') {
      const it = interactor.interactor as MeasureInteractor;
      it.init();
    }
    interactor.interactor.setActive(true);

    this.currentInteraction = id;
  }

  public disableInteraction(id: string): void {
    const interactor = this.interactions[id];
    interactor.interactor.setActive(false);
  }

  public onNewInteractor(callback: any): object {
    return this.subscribe(INTERACTION.NEW_INTERACTOR, callback);
  }

  public onNewFeature(callback: any): object {
    return this.subscribe(INTERACTION.INTERACTION_FINISHED, callback);
  }

  public setAutoDisableCallback(interactor: Interaction): void {
    interactor.on('drawend', (evt: any) => {
      interactor.setActive(false);
    });
  }

  public setFinishCallback(interactorOptions: InteractorOptions): void {
    interactorOptions.interactor.on('drawend', (evt: any) => {
      const transaction: ITransaction = {
        feature: evt.feature,
        id: interactorOptions.styleID,
        validateBeforeSave: interactorOptions.validateBeforeSave,
      };
      this.publish(INTERACTION.INTERACTION_FINISHED, transaction);
    });
  }

  public stopCurrentInteraction(): void {
    const interactor = this.interactions[this.currentInteraction];
    if (this.currentInteraction === 'measure') {
      const it = interactor.interactor as MeasureInteractor;
      it.destroy();
    }
    interactor.interactor.setActive(false);
    this.currentInteraction = 'none';
  }
}
