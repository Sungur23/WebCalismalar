import {AbstractGraph, MARGIN_LEFT_IDX, MARGIN_TOP_IDX} from "../AbstractGraph";
import {Axis} from "../../../utils/GraphParts";
import {GraphData} from "../../../utils/GraphData";
import {ScopeProjection} from "../../../utils/ScopeProjection";
import Myr from "../../../utils/myr";


var centerX: number = NaN
var centerY: number = NaN
var radiusPx: number = NaN

export abstract class AbstractPolarGraph extends AbstractGraph {

    protected proj = new ScopeProjection();

    public constructor(canvas3d: HTMLCanvasElement, canvas2d: HTMLCanvasElement,
                       protected axis: Axis,
                       protected getData: () => GraphData) {
        super(canvas3d, canvas2d);
        if (axis.range === undefined) {
            throw new Error("You must define range for axis for polar graphs")
        }
        this.axis = Axis.copy(axis)

    }

    public resize(width: number, height: number, repaint = false, force = false) {
        super.resize(width, height, repaint, force);

        radiusPx = Math.min(this.width, this.height) / 2;
        centerX = this.width / 2 + this.margins[MARGIN_LEFT_IDX]
        centerY = this.height / 2 + this.margins[MARGIN_TOP_IDX]

        this.proj?.update(0, centerX, centerY, this.width, this.height, 1);
    }

    public drawCanvas(): void {

        this.graphics.font = `11px`
        this.graphics.lineWidth = 1
        this.graphics.fillStyle = "gray"
        this.graphics.strokeStyle = "gray"
        this.graphics.textAlign = "center"
        this.graphics.textBaseline = "middle"
        this.graphics.clearRect(0, 0, this.canvas2d.width, this.canvas2d.height)
        this.graphics.beginPath()
        const target = [NaN, NaN]
        for (let t = 0; t < 360; t += 45) {
            this.proj.toView([1, t], target);
            this.graphics.moveTo(centerX, centerY)
            this.graphics.lineTo(target[0], target[1])
            this.proj.toView([1 + 16 / radiusPx, t], target);
        }
        for (let r = radiusPx / 4; r <= radiusPx; r += radiusPx / 4) {
            this.graphics.moveTo(centerX, centerY)
            this.graphics.arc(centerX, centerY, r, 0, 360)
        }
        this.graphics.fillStyle = "rgba(255, 255, 255, 0.85)"
        for (let t = 0; t < 360; t += 45) {
            this.proj.toView([1 + 12 / radiusPx, t], target);
            this.graphics.fillText(t + "", target[0], target[1])
        }
        this.graphics.font = `10px`
        this.graphics.textAlign = "right"
        this.graphics.textBaseline = "top"
        this.graphics.fillStyle = this.axis.hexColor
        for (let r = 0; r <= radiusPx; r += radiusPx / 4) {
            this.graphics.fillText(this.axis.toValue(r / radiusPx).toFixed(0), centerX + r, centerY)
        }

        this.graphics.stroke()
    }

    public drawGL(): void {
        this.myr.bind()
        this.myr.clear()
        const data = this.getData()
        const target = [NaN, NaN]
        const color = Myr.Color.fromHex(this.axis.hexColor);
        for (let i = 0; i < data.x.length; i++) {
            this.proj.toView([this.axis.toRatio(data.y[i]), data.x[i]], target);
            this.myr.primitives.drawPoint(color, target[0], target[1])
        }
        this.myr.flush()
    }

    protected init() {
        this.margins = [32, 32, 32, 32]
    }
}