import Feature from 'ol/feature';

import { UPDATE } from './update.const';
import { UpdateData } from './update-data.interface';
import { StringBusEvent } from '../shared/common/string-bus-event';

export class UpdateService extends StringBusEvent {

    constructor() {
        super();
    }

    unsubscribeService(id: object): void {
        this.unsubscribe(id);
    }

    //#region Update
    onRequestUpdate(callback: (data: any) => void): object {
        return this.subscribe(UPDATE.UPDATE_REQUEST, callback);
    }

    onUpdate(callback: (data: any) => void): object {
        return this.subscribe(UPDATE.UPDATE_START, callback);
    }

    onUpdateDone(callback: (data: any) => void): object {
        return this.subscribe(UPDATE.UPDATE_DONE, callback);
    }

    onUpdateCanceled(callback: any): object {
        return this.subscribe(UPDATE.UPDATE_CANCELED, callback);
    }

    update(data: any): void {
        this.publish(UPDATE.UPDATE_START, data);
    }

    requestUpdate(data: any): void {
        this.publish(UPDATE.UPDATE_REQUEST, data);
    }

    updateDone(data: UpdateData): void {
        this.publish(UPDATE.UPDATE_DONE, data);
    }

    updateCanceled(reason?: string): void {
        this.publish(UPDATE.UPDATE_CANCELED, { reason });
    }
    //#endregion

    //#region Creation
    onCreation(callback: (data: Feature) => void): object {
        return this.subscribe(UPDATE.CREATION_REQUEST, callback);
    }

    onCreationDone(callback: (data: any) => void): object {
        return this.subscribe(UPDATE.CREATION_DONE, callback);
    }

    onCreationCanceled(callback: any): object {
        return this.subscribe(UPDATE.CREATION_CANCELED, callback);
    }

    requestCreation(feature: Feature): void {
        this.publish(UPDATE.CREATION_REQUEST, feature);
    }

    creationDone(data: UpdateData): void {
        this.publish(UPDATE.CREATION_DONE, data);
    }

    cancelCreation(reason?: string): void {
        this.publish(UPDATE.CREATION_CANCELED, reason);
    }
    //#endregion

    //#region Visibility
    showFeature(mission: any): void {
        this.publish(UPDATE.SHOW_REQUEST, mission);
    }

    hideFeature(mission: any): void {
        this.publish(UPDATE.HIDE_REQUEST, mission);
    }

    onHideFeature(callback: any): object {
        return this.subscribe(UPDATE.HIDE_REQUEST, callback);
    }

    onShowFeature(callback: any): object {
        return this.subscribe(UPDATE.SHOW_REQUEST, callback);
    }

    showDone(value: boolean = true): void {
        this.publish(UPDATE.SHOW_DONE, value);
    }

    onShowDone(callback: any): object {
        return this.subscribe(UPDATE.SHOW_DONE, callback);
    }

    //#endregion

    onDelete(callback: any): object {
        return this.subscribe(UPDATE.DELETE, callback);
    }

    delete(id: number): void {
        this.publish(UPDATE.DELETE, id);
    }

    //#region adsb
    createAdsb(data: any): void {
        this.publish(UPDATE.CREATE_ADSB, data);
    }
    onCreateADSB(callback: any): object {
        return this.subscribe(UPDATE.CREATE_ADSB, callback);
    }

    updateAdsb(data: any): void {
        this.publish(UPDATE.UPDATE_ADSB, data);
    }
    onUpdateADSB(callback: any): object {
        return this.subscribe(UPDATE.UPDATE_ADSB, callback);
    }

    deleteAdsb(id: any): void {
        this.publish(UPDATE.DELETE_ADSB, id);
    }
    onDeleteADSB(callback: any): object {
        return this.subscribe(UPDATE.DELETE_ADSB, callback);
    }
    //#endregion
}
