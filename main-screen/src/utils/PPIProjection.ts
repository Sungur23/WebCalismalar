import {wrap} from "./Utils";

const TO_RADIANS = Math.PI / 180;

export class PPIProjection {
    private bearingCenter!: number;
    private centerX!: number;
    private centerY!: number;
    private pixelPerMeter!: number;
    private maxDistance!: number;
    private radius!: number;

    public update(bearingCenter: number, centerX: number, centerY: number, width: number, height: number, maxDistance: number, radius: number) {
        this.pixelPerMeter = radius;//Math.min(width, height);
        this.centerX = centerX;
        this.centerY = centerY;
        this.maxDistance = maxDistance;
        this.bearingCenter = bearingCenter;
        console.log("Center: " + this.centerX.toFixed(1) + ":" + this.centerY.toFixed(1))
    }

    toView = ([distance, bearing]: number[], target: number[]) => {
        target[0] = this.centerX + distance * this.pixelPerMeter * Math.cos(TO_RADIANS * wrap(bearing - this.bearingCenter + 270));
        target[1] = this.centerY + distance * this.pixelPerMeter * Math.sin(TO_RADIANS * wrap(bearing - this.bearingCenter + 270));
    }

    toView2 = ([distance, bearing]: number[], target: number[]) => {
        target[0] = this.centerX + distance * Math.cos(TO_RADIANS * wrap(bearing - this.bearingCenter + 270));
        target[1] = this.centerY + distance * Math.sin(TO_RADIANS * wrap(bearing - this.bearingCenter + 270));
    }
    // toView2 = ([distance, bearing, centerX, centerY]: number[], target: number[]) => {
    //     console.log(
    //         centerX.toFixed(1) + "  "
    //         //     + this.pixelPerMeter.toFixed(1) + " "
    //     )
    //     target[0] = centerX + distance * this.pixelPerMeter * Math.cos(TO_RADIANS * wrap(bearing - this.bearingCenter + 270));
    //     target[1] = centerY + distance * this.pixelPerMeter * Math.sin(TO_RADIANS * wrap(bearing - this.bearingCenter + 270));
    // }

    toModel = ([x, y]: number[], target: number[]) => {
        const x1 = x - this.centerX, y1 = y - this.centerY;
        target[0] = Math.hypot(x1, y1) / this.pixelPerMeter;
        target[1] = wrap(Math.atan2(y1, x1) / TO_RADIANS + this.bearingCenter + 90);
    }
}
