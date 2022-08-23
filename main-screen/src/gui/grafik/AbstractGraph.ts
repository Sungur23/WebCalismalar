import {GraphComponentMoved} from "../../utils/GraphParts";
import Myr from "../../utils/myr";

export const MARGIN_TOP_IDX = 0;
export const MARGIN_RIGHT_IDX = 1;
export const MARGIN_BOTTOM_IDX = 2;
export const MARGIN_LEFT_IDX = 3;

export abstract class AbstractGraph {

    protected myr: Myr;
    protected gl: WebGL2RenderingContext;
    protected graphics: CanvasRenderingContext2D
    protected margins = [16, 16, 20, 16]
    protected width: number = NaN
    protected height: number = NaN
    protected repaintRequested = false;

    public constructor(protected canvas3d: HTMLCanvasElement, protected canvas2d: HTMLCanvasElement) {
        this.init();
        this.graphics = canvas2d.getContext('2d')!;
        this.gl = canvas3d.getContext("webgl2", {
            antialias: false,
            depth: false,
            alpha: false
        })!
        this.myr = new Myr(this.canvas3d, this.gl);
        this.myr.setClearColor(new Myr.Color(0, 0, 0, 1))
        this.myr.bind();
        this.myr.clear()
        this.resize(canvas3d.width, canvas3d.height, false, true)
        this.repaint()
    }

    public resize(width: number, height: number, repaint = false, force = false) {

        width |= 0
        height |= 0
        if (force || width !== this.canvas3d.width || height !== this.canvas3d.height) {
            this.canvas2d.width = width
            this.canvas2d.height = height
            this.width = (width - this.margins[MARGIN_LEFT_IDX] - this.margins[MARGIN_RIGHT_IDX]) | 0
            this.height = (height - this.margins[MARGIN_TOP_IDX] - this.margins[MARGIN_BOTTOM_IDX]) | 0
            if (repaint) this.repaint()
        }

    }

    public repaint() {
        if (this.repaintRequested) return;
        this.repaintRequested = true;
        setTimeout(() => {
            this.repaintRequested = false;
            this.drawGL();
            this.drawCanvas();
        }, 16)
    }

    public abstract drawCanvas(): void;

    public abstract drawGL(): void

    public componentListener(listener: GraphComponentMoved) {
        this.listener = listener;
    }

    protected drawGLMarginMask(color = Myr.Color.BLACK) {
        this.myr.primitives.fillRectangle(color, 0, 0, this.margins[MARGIN_LEFT_IDX], this.canvas3d.height);
        this.myr.primitives.fillRectangle(color, this.width + this.margins[MARGIN_LEFT_IDX], 0, this.margins[MARGIN_RIGHT_IDX], this.canvas3d.height);
        this.myr.primitives.fillRectangle(color, 0, 0, this.canvas3d.width, this.margins[MARGIN_TOP_IDX]);
        this.myr.primitives.fillRectangle(color, 0, this.margins[MARGIN_TOP_IDX] + this.height, this.canvas3d.width, this.canvas3d.height - (this.margins[MARGIN_TOP_IDX] + this.height));
    }

    protected clipCanvasMargins() {
        this.graphics.rect(this.margins[MARGIN_LEFT_IDX], this.margins[MARGIN_TOP_IDX], this.width, this.height);
        this.graphics.clip()
    }

    protected valueToRatio(value: number, range?: [number, number]) {
        return range ? (value - range[0]) / (range[1] - range[0]) : NaN
    }

    protected ratioToValue(ratio: number, range?: [number, number]) {
        return range ? ratio * (range[1] - range[0]) + range[0] : NaN
    }

    protected init() {
        this.margins = [16, 16, 20, 16]
    }

    protected listener: GraphComponentMoved = () => {
    }


}