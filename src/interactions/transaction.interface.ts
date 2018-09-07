import Feature from 'ol/feature';

export interface Transaction {
  feature: Feature;
  id: string;
  validateBeforeSave: boolean;
}
