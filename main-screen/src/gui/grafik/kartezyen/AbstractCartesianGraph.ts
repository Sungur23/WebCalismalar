import {AbstractGraph2D, MARGIN_LEFT_IDX, MARGIN_TOP_IDX} from "../AbstractGraph2D";
import {Axis, GraphComponentType} from "../../../utils/GraphParts";
import {GraphData} from "../../../utils/GraphData";
import {PPIProjection} from "../../../utils/PPIProjection";
import Myr from "../../../utils/myr";
import Utils, {wrap} from "../../../utils/Utils";
import hh_MTT from "../../../img/hh_MTT_25.png";
import {fdatasync} from "fs";


var centerX: number = NaN
var centerY: number = NaN
var radiusPx: number = NaN
const TO_RADIANS = Math.PI / 180;

export abstract class AbstractCartesianGraph extends AbstractGraph2D {


    protected zoom = 1
    protected centerRatioX = 0.5;
    protected centerRatioY = 0.5;

    public constructor(canvas2d: HTMLCanvasElement,
                       canvasRadarVideo: HTMLCanvasElement,
                       protected xAxis: Axis,
                       protected yAxes: Axis[] = []) {
        super(canvas2d, canvasRadarVideo);
    }

    public drawCanvas(): void {

        this.clearCanvas();
        /**************************************************************/
        this.graphics.font = `12px`
        this.graphics.lineWidth = 1
        this.graphics.fillStyle = "gray"
        this.graphics.strokeStyle = "gray"
        this.graphics.textAlign = "center"
        this.graphics.textBaseline = "bottom"
        this.graphics.clearRect(0, 0, this.canvas2d.width, this.canvas2d.height)
        this.graphics.fillText("Zoom x" + this.zoom.toFixed(2), this.width / 2 + this.margins[MARGIN_LEFT_IDX], this.margins[MARGIN_TOP_IDX])
        const countX = 10;
        const countY = 5;
        const minXRatio = this.xToRatio(this.margins[MARGIN_LEFT_IDX])
        const maxXRatio = this.xToRatio(this.width + this.margins[MARGIN_LEFT_IDX])
        this.graphics.beginPath()
        this.graphics.textBaseline = "top"
        const endY = this.margins[MARGIN_TOP_IDX] + this.height;
        for (let i = 0; i <= countX; i++) {
            const ratio = (maxXRatio - minXRatio) / countX * i + minXRatio
            const x = this.ratioToX(ratio)
            const value = this.xRatioToLabel(ratio)
            const text = value < 10 && value > -10 ? value.toFixed(2) : value.toFixed(0)
            this.graphics.moveTo(x, endY)
            this.graphics.lineTo(x, this.margins[MARGIN_TOP_IDX])
            this.graphics.fillText(text, x, endY + 8)
        }
        this.graphics.stroke()

        this.graphics.font = `bolder 16px`
        this.graphics.textBaseline = "middle"
        this.graphics.textAlign = "left"
        for (let i = 0; i < this.yAxes.length; i++) {
            const yAxis = this.yAxes[i]
            this.graphics.fillStyle = yAxis.hexColor
            this.graphics.fillText(yAxis.name, this.width + this.margins[MARGIN_LEFT_IDX] + 8, (i + 0.5) * (this.canvas2d.height / this.yAxes.length))
        }

        this.graphics.font = `12px`
        this.graphics.strokeStyle = "gray"
        this.graphics.fillStyle = "white"
        this.graphics.textBaseline = "middle"
        this.graphics.textAlign = "right"
        this.graphics.beginPath()
        for (let i = 0; i < this.yAxes.length; i++) {
            const yAxis = this.yAxes[i]
            this.graphics.fillStyle = yAxis.hexColor
            const [min, max] = this.yAxisMinMax(yAxis);
            const scale = max - min
            const minYRatio = this.yToRatio(this.height + this.margins[MARGIN_TOP_IDX])  // y pixel axis reverse of y ratio axis
            const maxYRatio = this.yToRatio(this.margins[MARGIN_TOP_IDX])
            for (let j = 0; j <= countY; j++) {
                const ratio = (maxYRatio - minYRatio) / countY * j + minYRatio
                const y = this.ratioToY(ratio)
                const value = ratio * scale
                this.graphics.moveTo(this.margins[MARGIN_LEFT_IDX], y)
                this.graphics.lineTo(this.margins[MARGIN_LEFT_IDX] + this.width, y)
                this.graphics.fillText((value).toFixed(0), ((i + 1) / this.yAxes.length) * this.margins[MARGIN_LEFT_IDX] - 5, y)
            }
        }
        this.graphics.stroke()
    }

    public yAxisMinMax(yAxis: Axis): [number, number] {
        return yAxis.range!;
    }

    public ratioToX(ratio: number) {
        return this.margins[MARGIN_LEFT_IDX] + this.width / 2 + ((ratio - this.centerRatioX) * this.zoom * this.width)
    }

    public xToRatio(x: number) {
        return ((x - this.margins[MARGIN_LEFT_IDX] - this.width / 2) / this.zoom / this.width) + this.centerRatioX
    }

    public ratioToY(ratio: number) {
        return (this.margins[MARGIN_TOP_IDX] + this.height / 2 + ((ratio - this.centerRatioY) * -1 * this.zoom * this.height))
    }

    public yToRatio(y: number) {
        return ((y - this.margins[MARGIN_TOP_IDX] - this.height / 2) / -1 / this.zoom / this.height) + this.centerRatioY
    }

    public underCursorType(viewX: number, viewY: number): GraphComponentType | undefined {
        return undefined
    }

    public inside(x: number, y: number) {
        if (x < this.margins[MARGIN_LEFT_IDX]) return false
        if ((this.margins[MARGIN_LEFT_IDX] + this.width) < x) return false
        if (y < this.margins[MARGIN_TOP_IDX]) return false
        if ((this.margins[MARGIN_TOP_IDX] + this.height) < y) return false
        return true
    }

    public getZoom() {
        return this.zoom
    }

    public setZoom(zoom: number) {
        this.zoom = zoom
    }

    public down(event: MouseEvent) {

    }

    public up(event: MouseEvent) {

    }

    public dragged(event: MouseEvent) {
        this.pan(event.movementX / this.canvas2d.width, event.movementY / this.canvas2d.height)
    }

    public pan(xRatioDiff: number, yRatioDiff: number) {
        this.centerRatioX -= xRatioDiff / this.zoom;
        this.centerRatioY += yRatioDiff / this.zoom;
        this.extentChanged()
    }

    public zoomRatio(ratio: number) {
        this.zoom *= ratio
        this.extentChanged()
    }

    public zoomAt(ratio: number, x: number, y: number) {
        const ratioX = this.xToRatio(x)
        const ratioY = this.yToRatio(y)
        this.zoom *= ratio
        const ratioX2 = this.xToRatio(x)
        const ratioY2 = this.yToRatio(y)
        if (Number.isNaN(ratioX) === false) this.centerRatioX -= ratioX2 - ratioX
        if (Number.isNaN(ratioY) === false) this.centerRatioY -= ratioY2 - ratioY
        this.extentChanged()
    }

    public extentChanged() {
        this.repaint()
    }

    public abstract xRatioToLabel(value: number): number;

    protected init() {
        this.margins = [32, 32, 32, 32]
    }
}