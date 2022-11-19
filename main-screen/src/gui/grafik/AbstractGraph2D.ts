import {GraphComponentMoved} from "../../utils/GraphParts";
import Myr from "../../utils/myr";

export const MARGIN_TOP_IDX = 0;
export const MARGIN_RIGHT_IDX = 1;
export const MARGIN_BOTTOM_IDX = 2;
export const MARGIN_LEFT_IDX = 3;

export abstract class AbstractGraph2D {

    // protected myr: Myr;
    // protected gl: WebGL2RenderingContext;
    public graphics: CanvasRenderingContext2D
    public radarVideo: CanvasRenderingContext2D
    protected margins = [16, 16, 20, 16]
    protected width: number = NaN
    protected height: number = NaN
    protected repaintRequested = false;

    public constructor(public canvas2d: HTMLCanvasElement, public canvasRadarVideo: HTMLCanvasElement) {
        this.init();
        // this.gl = canvasRadarVideo.getContext("webgl2", {
        //     antialias: false,
        //     depth: false,
        //     alpha: false
        // })!;
        // this.myr = new Myr(canvasRadarVideo, this.gl);
        // this.myr.setClearColor(new Myr.Color(68, 75, 80, 80))
        // this.myr.bind();
        // this.myr.clear();
        this.graphics = canvas2d.getContext('2d')!;
        this.radarVideo = canvasRadarVideo.getContext('2d')!;
        this.resize(canvas2d.width, canvas2d.height, false, true)
        this.repaint()
        setInterval(() => this.repaint(), 1000 / 30);
    }

    public resize(width: number, height: number, repaint = false, force = false) {

        width |= 0
        height |= 0
        if (force || width !== this.canvas2d.width || height !== this.canvas2d.height) {
            this.canvas2d.width = width
            this.canvas2d.height = height
            this.canvasRadarVideo.width = width
            this.canvasRadarVideo.height = height

            this.width = (width - this.margins[MARGIN_LEFT_IDX] - this.margins[MARGIN_RIGHT_IDX]) | 0
            this.height = (height - this.margins[MARGIN_TOP_IDX] - this.margins[MARGIN_BOTTOM_IDX]) | 0
            if (repaint) this.repaint()
        }

    }

    public clearCanvas() {
        const transform = this.graphics.getTransform();
        this.graphics.clearRect(-transform.e / transform.a, -transform.f / transform.d,
            this.canvas2d.width, this.canvas2d.height);
    }

    public clearRadarVideo() {
        const transform = this.radarVideo.getTransform();
        this.radarVideo.clearRect(-transform.e / transform.a, -transform.f / transform.d,
            this.canvasRadarVideo.width, this.canvasRadarVideo.height);
    }

    public repaint() {
        if (this.repaintRequested) return;
        this.repaintRequested = true;
        setTimeout(() => {
            this.repaintRequested = false;
            this.clearCanvas();
            this.drawCanvas();
            this.drawGL();
        }, 16)
    }

    public abstract drawCanvas(): void;

    public abstract drawGL(): void

    public abstract drawRadarVideo(id: number, rgbArray: number[]): void

    public componentListener(listener: GraphComponentMoved) {
        this.listener = listener;
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