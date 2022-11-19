import {
    Axis,
    AxisVisualType,
    Graph,
    GraphComponent2D,
    GraphComponentType,
    Graphics2D,
    HorizontalLine,
    randomColor,
    Shape,
    VerticalLine
} from '../../../utils/GraphParts';
import {GraphData} from '../../../utils/GraphData';
import {AbstractCartesianGraph} from './AbstractCartesianGraph';
import {out} from '../../../utils/Utils';
import {MARGIN_LEFT_IDX, MARGIN_TOP_IDX} from '../AbstractGraph2D';
import {pull, remove} from 'lodash';

export abstract class AbstractXYGraph extends AbstractCartesianGraph implements Graph {

    protected getData: (axis: Axis) => GraphData
    protected parts = [] as GraphComponent2D[]
    protected partToShape = new Map<GraphComponent2D, Shape | undefined>()
    protected underPart: GraphComponent2D | undefined
    protected verticalCount = 0;
    protected horizontalCount = 0;

    public constructor(canvas2d: HTMLCanvasElement,
                       canvasRadarVideo: HTMLCanvasElement,
                       xAxis: Axis,
                       yAxes: Axis[] = [],
                       getData: (axis: Axis) => GraphData) {
        super(canvas2d, canvasRadarVideo, xAxis, yAxes);
        this.getData = getData;
    }

    valueToX(value: number, range: [number, number] = this.xAxis.range!): number {
        return this.ratioToX(this.valueToRatio(value, range))
    }

    valueToY(value: number, range: [number, number] = this.yAxisMinMax(this.yAxes[0])): number {
        return this.ratioToY(this.valueToRatio(value, range))
    }

    xToValue(x: number, range: [number, number] = this.xAxis.range!) {
        const ratio = this.xToRatio(x);
        return this.ratioToValue(ratio, range);
    }

    yToValue(y: number, range: [number, number] = this.yAxisMinMax(this.yAxes[0])) {
        const ratio = this.yToRatio(y);
        return this.ratioToValue(ratio, range);
    }

    public underCursorType(x: number, y: number): GraphComponentType | undefined {
        return this.underCursor(x, y)?.type();
    }

    public underCursor(x: number, y: number): GraphComponent2D | undefined {
        const rtr = out<GraphComponent2D>(undefined)
        this.partToShape.forEach((v, k) => {
            if (v?.contains(x, y)) {
                rtr.value = k;
            }
        })
        return rtr.value;
    }

    public down(event: MouseEvent) {
        this.underPart = this.underCursor(event.offsetX, event.offsetY)
    }

    public up(event: MouseEvent) {
        if (this.underPart) this.notifyComponentMoved(false);
        this.underPart = undefined;
    }

    public dragged(event: MouseEvent) {
        if (this.underPart) {
            const xRatio = this.xToRatio(event.offsetX)
            const yRatio = this.yToRatio(event.offsetY)
            this.underPart.moveTo(xRatio, yRatio)
            this.notifyComponentMoved(true);
            this.repaint()
        } else {
            this.pan(event.movementX / this.canvas2d.width, event.movementY / this.canvas2d.height)
        }
    }

    graphics2d(): Graphics2D {
        return this.graphics
    }

    public addVerticalLine(id: string, hexColor = randomColor()) {
        const ratio = this.xToRatio(++this.verticalCount * (this.width / 9) + this.margins[MARGIN_LEFT_IDX])
        this.parts.push(new VerticalLine(id, ratio, hexColor))
        this.notifyComponentMoved(false);
    }

    public addHorizontalLine(id: string, hexColor = randomColor()) {
        const ratio = this.yToRatio(++this.horizontalCount * (this.height / 9) + this.margins[MARGIN_TOP_IDX])
        this.parts.push(new HorizontalLine(id, ratio, hexColor))
        this.notifyComponentMoved(false);
    }

    public removeLine(id: String) {
        const part = this.parts.find(v => v.id === id)
        if (part) {
            pull(this.parts, part);
            this.partToShape.delete(part)
            return true;
        }
        return false;
    }

    public drawCanvas(): void {
        super.drawCanvas()
        this.graphics.save()
        this.clipCanvasMargins()
        for (const part of this.parts) {
            this.partToShape.set(part, part.drawCanvas(this))
        }
        this.graphics.restore()
    }

    public yAxisMinMax(yAxis: Axis): [number, number] {
        const data = this.getData(yAxis)
        const min = yAxis.range ? yAxis.range[0] : data.minY
        const max = yAxis.range ? yAxis.range[1] : data.maxY
        return [min, max]
    }

    public drawGL(): void {

    }


    public drawRadarVideo(id: number, rgbArray: number[]): void {
    }

    protected init() {
        this.margins = [16, 60, 20, 60]
    }

    private notifyComponentMoved(interacting: boolean) {
        const axisValues: any = {};
        this.parts.forEach(part => {
            const [xRatio, yRatio] = part.ratios();
            const values: any = {};
            axisValues[part.id] = values;
            if (xRatio !== undefined) {
                const xValue = this.ratioToValue(xRatio, this.xAxis.range);
                if (isNaN(xValue) === false) values[this.xAxis.id] = xValue;
            }
            if (yRatio !== undefined) {
                this.yAxes.forEach(yAxis => {
                    const yValue = this.ratioToValue(yRatio, this.yAxisMinMax(yAxis));
                    if (isNaN(yValue) === false) values[yAxis.id] = yValue
                })
            }
        });
        this.listener(interacting, this.underPart?.id ?? "", axisValues);
    }
}