import Vector from 'ol/source/vector';
import Feature from 'ol/feature';
import proj from 'ol/proj';
import Coordinate from 'ol';

export class MapHelper {
    public static createVectorSource(features?: Array<Feature>): Vector {
        const vector = new Vector({
            features
        });
        return vector;
    }

    public static convertDegreeToRad(angle: number): number {
        return angle * (Math.PI / 180);
    }

    public static convertRadToDegree(rad: number): number {
        return rad * (180 / Math.PI);
    }

    public static computeAverageAngle(angle1: number, angle2: number): number {
        const res = Math.abs(angle1 - angle2);
        return angle1 > angle2 ? res - angle2 : res + angle2;
    }

    public static minimizeRotation(angle: number): number {
        if (angle > Math.PI) {
            return 2 * Math.PI - angle;
        }
        return -angle;
    }

    public static minimizeRotationDegree(angle: number): number {
        if (angle > 360) {
            return 2 * 360 - angle;
        }
        return -angle;
    }

    public static convertPostionToCoord(position: Position): Coordinate.Coordinate {
        const long = position.coords.longitude;
        const lat = position.coords.latitude;
        const coord: Coordinate.Coordinate = [long, lat];
        const convertedCoord = proj.fromLonLat(coord);

        return convertedCoord;
    }

    public static convertLatLonToOL(lat: number, lon: number): Coordinate.Coordinate {
        const coord = [lon, lat] as Coordinate.Coordinate;
        return proj.fromLonLat(coord);
    }
}
