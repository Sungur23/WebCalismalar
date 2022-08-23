import {wrap} from "./Utils";

const TO_RADIANS = Math.PI / 180;

export class ScopeProjection {
    public bearingCenter!: number;
    public centerX!: number;
    public centerY!: number;
    public pixelPerMeter!: number;
    public maxDistance!: number;

    public update(bearingCenter: number, centerX: number, centerY: number, width: number, height: number, maxDistance: number) {
        this.pixelPerMeter = Math.min(width, height) / 2 / maxDistance;
        this.centerX = centerX;
        this.centerY = centerY;
        this.maxDistance = maxDistance;
        this.bearingCenter = bearingCenter;
    }

    toView = ([distance, bearing]: number[], target: number[]) => {
        target[0] = this.centerX + distance * this.pixelPerMeter * Math.cos(TO_RADIANS * wrap(bearing - this.bearingCenter + 270));
        target[1] = this.centerY + distance * this.pixelPerMeter * Math.sin(TO_RADIANS * wrap(bearing - this.bearingCenter + 270));
    }

    toModel = ([x, y]: number[], target: number[]) => {
        const x1 = x - this.centerX, y1 = y - this.centerY;
        target[0] = Math.hypot(x1, y1) / this.pixelPerMeter;
        target[1] = wrap(Math.atan2(y1, x1) / TO_RADIANS + this.bearingCenter + 90);
    }
}
