export class GeolocationService {

  // private socket: SocketIOClient.Socket;

  // private sourceGPSData: Observable<Position>;
  // private sourceGPSSpeed: Observable<number>;

  // private eventGPSData = 'gpsData';
  // private eventGPSSpeed = 'gpsSpeed';

  // constructor() {
  //   const gpsWebSocketURL = environment.websocketURL + '/gps';
  //   this.socket = io(gpsWebSocketURL);
  //   this.subscribeToGpsData();
  //   this.subscribeToGpsSpeed();
  // }

  // public subscribeToGpsData(): void {
  //   this.sourceGPSData = Observable.create(observer => {
  //     this.socket.on(this.eventGPSData, data => {
  //       observer.next(data);
  //     });
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   });
  // }

  // public subscribeToGpsSpeed(): void {
  //   this.sourceGPSSpeed = Observable.create(observer => {
  //     this.socket.on(this.eventGPSSpeed, data => {
  //       observer.next(data);
  //     });
  //     return () => {
  //       this.socket.disconnect();
  //     };
  //   });
  // }

  // public getObservablePosition(): Observable<Position> {
  //   return this.sourceGPSData;
  // }

  // public getObservableSpeed(): Observable<number> {
  //   return this.sourceGPSSpeed;
  // }
}
