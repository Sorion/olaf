import Interaction from 'ol/interaction/interaction';

export interface InteractorOptions {
  interactor: Interaction;
  validateBeforeSave: boolean;
  autoDisable: boolean;
  styleID: string;
}
