import Feature from 'ol/feature';

export interface ITransaction {
  feature: Feature;
  id: string;
  validateBeforeSave: boolean;
}
