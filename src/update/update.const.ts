class UpdateServiceConst {
  //#region Creation
  public static readonly CREATION_REQUEST = 'creation-request';
  public static readonly CREATION_DONE = 'creation-done';
  public static readonly CREATION_CANCELED = 'creation-canceled';
  //#endregion

  //#region Update
  public static readonly UPDATE_REQUEST = 'request-update';
  public static readonly UPDATE_START = 'update-start';
  public static readonly UPDATE_DONE = 'update-done';
  public static readonly UPDATE_CANCELED = 'update-canceled';
  //#endregion

  //#region Visibility
  public static readonly SHOW_REQUEST = 'show-request';
  public static readonly HIDE_REQUEST = 'hide-request';
  public static readonly SHOW_DONE = 'show-completed';
  //#endregion

  public static readonly DELETE = 'delete';

  //#region ADSB
  public static readonly CREATE_ADSB = 'create-adsb';
  public static readonly UPDATE_ADSB = 'update-adsb';
  public static readonly DELETE_ADSB = 'delete-adsb';
  //#endregion
}

export { UpdateServiceConst as UPDATE };
