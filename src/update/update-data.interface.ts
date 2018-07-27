import Feature from 'ol/feature';

export interface UpdateData {
    missionId: number;
    missionName: string;
    feature: Feature;
}
