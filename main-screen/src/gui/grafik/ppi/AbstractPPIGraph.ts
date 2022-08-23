import {AbstractGraph2D, MARGIN_LEFT_IDX, MARGIN_TOP_IDX} from "../AbstractGraph2D";
import {Axis} from "../../../utils/GraphParts";
import {GraphData} from "../../../utils/GraphData";
import {ScopeProjection} from "../../../utils/ScopeProjection";
import Myr from "../../../utils/myr";
import Utils from "../../../utils/Utils";


var centerX: number = NaN
var centerY: number = NaN
var radiusPx: number = NaN

export abstract class AbstractPPIGraph extends AbstractGraph2D {

    public polarAngle = 50;
    public img = new Image();
    public SELECTION_DIFF_CONSTANT = 4;
    public canvasWidthPosition: number;
    public canvasHeightPosition: number;
    public scale = 1;
    public orgnx = (0);
    public orgny = (0);
    public visibleWidth = 0;
    public visibleHeight = 0;
    public zoom = 1;
    public halkaSayisi = 4;
    public polarYaricap: number;
    public zoomIntensity = 0.05;
    public MAX_ZOOM_LIMIT = 16;
    public MIN_ZOOM_LIMIT = 1;
    public mouseDragActive = false;
    public diffControl = {id: -1, diff: 0}
    public dragStart = {x: 0, y: 0}
    public mouseDragToolActive = true;
    public cursor = {
        x: 200, y: 200,
        clickX: 200, clickY: 200
    }
    public selectedId = {
        id: -1
    }
    protected proj = new ScopeProjection();

    public constructor(canvas2d: HTMLCanvasElement,
                       protected axis: Axis,
                       protected getData: () => GraphData) {
        super(canvas2d);

        if (axis.range === undefined) {
            throw new Error("You must define range for axis for polar graphs")
        }
        this.axis = Axis.copy(axis)

        this.polarYaricap = this.axis.range![1] / Math.sqrt(2);
        this.polarAngle = this.axis.angle!;
        this.canvasWidthPosition = canvas2d.width / 2;
        this.canvasHeightPosition = canvas2d.height - 10;

        // Scroll effect function
        canvas2d.addEventListener('wheel', (event) => this.zoomControl(event));
        // canvas2d.addEventListener('click', (event) => this.handleMouseClick(event));
        canvas2d.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        canvas2d.addEventListener('mouseup', (event) => this.handleMouseDragStop(event));
        canvas2d.addEventListener('mousedown', (event) => this.handleMouseDragStart(event));
    }

    handleMouseMove(event: any) {

        if (this.mouseDragActive) {

            var rect = this.canvas2d.getBoundingClientRect();
            const dragX = ((event.clientX - rect.left) / (rect.right - rect.left)) * this.canvas2d.width;
            const dragY = ((event.clientY - rect.top) / (rect.bottom - rect.top)) * this.canvas2d.height

            if ((dragX < 0 || dragX > this.canvas2d.width)
                || (dragY < 0 || dragY > this.canvas2d.height)) {
                return;
            }

            event.preventDefault();

            if (this.scale != 1) {

                const xTemp = (dragX - this.dragStart.x) / this.scale;
                const yTemp = (dragY - this.dragStart.y) / this.scale;
                this.graphics.translate(xTemp, yTemp);
                this.dragStart.x = dragX;
                this.dragStart.y = dragY;
            }
            this.graphics.save();
            this.drawCanvas();
        }
    }


    handleMouseDragStop(event: any) {
        // event.stopPropagation();
        // clearCanvas(canvas);
        this.canvas2d.style.cursor = "default";
        this.dragStart = {x: 0, y: 0};
        this.mouseDragActive = false;
    };


    handleMouseDragStart(event: any) {

        if (!this.mouseDragToolActive) return;

        var rect = this.canvas2d.getBoundingClientRect();
        const dragX = ((event.clientX - rect.left) / (rect.right - rect.left)) * this.canvas2d.width;
        const dragY = ((event.clientY - rect.top) / (rect.bottom - rect.top)) * this.canvas2d.height

        if (this.scale == 1 || (dragX < 0 || dragX > this.canvas2d.width)
            || (dragY < 0 || dragY > this.canvas2d.height)) {
            return;
        }

        this.dragStart = {x: dragX, y: dragY};
        this.mouseDragActive = true;
        this.canvas2d.style.cursor = "pointer";
    };

    zoomControl(event: any) {

        const width = this.canvas2d.width;
        const height = this.canvas2d.height;

        // alert(event.AT_TARGET);
        event.preventDefault();
        var scroll = event.deltaY < 0 ? 1 : -1;
        this.zoom = Math.exp(scroll * this.zoomIntensity);

        if ((this.scale * this.zoom) > this.MAX_ZOOM_LIMIT || (this.scale * this.zoom) < this.MIN_ZOOM_LIMIT) return;

        // clearCanvas(canvas);
        this.graphics.translate(this.orgnx, this.orgny);

        this.orgnx -= this.cursor.x / (this.scale * this.zoom) - this.cursor.x / this.scale;
        this.orgny -= this.cursor.y / (this.scale * this.zoom) - this.cursor.y / this.scale;

        this.graphics.scale(this.zoom, this.zoom);
        this.graphics.translate(-this.orgnx, -this.orgny);
        this.graphics.save();
        // Updating scale and visisble width and height
        this.scale *= this.zoom;
        this.visibleWidth = width / this.scale;
        this.visibleHeight = height / this.scale;
        this.drawCanvas()
    };

    clearCanvas() {
        const transform = this.graphics.getTransform();
        this.graphics.clearRect(-transform.e / transform.a, -transform.f / transform.d,
            this.canvas2d.width, this.canvas2d.height);
    }

    public resize(width: number, height: number, repaint = false, force = false) {
        super.resize(width, height, repaint, force);

        radiusPx = Math.min(this.width, this.height) / 2;
        centerX = this.width / 2 + this.margins[MARGIN_LEFT_IDX]
        centerY = this.height / 2 + this.margins[MARGIN_TOP_IDX]

        this.proj?.update(0, centerX, centerY, this.width, this.height, 1);
    }

    public drawCanvas(): void {

        this.clearCanvas();
        this.graphics.strokeStyle = 'gray';

        // const halkaSayisi = 4;
        // const canvasWidthPosition = this.canvas2d.width / 2;
        // const canvasHeightPosition = this.canvas2d.height;
        // const polarYaricap = this.axis.range![1] / Math.sqrt(2);
        // const polarAngle = this.axis.angle!;
        for (let i = 0; i < this.halkaSayisi; i++) {

            this.graphics.beginPath();
            this.graphics.moveTo(this.canvasWidthPosition!, this.canvasHeightPosition!);
            this.graphics.arc(this.canvasWidthPosition!, this.canvasHeightPosition!,
                ((this.halkaSayisi - i) * this.polarYaricap! / this.halkaSayisi),
                Utils.degsToRads(-this.polarAngle - 90), Utils.degsToRads(this.polarAngle - 90), false);
            this.graphics.moveTo(this.canvasWidthPosition!, this.canvasHeightPosition!);

            this.graphics.fillStyle = Utils.getHalkaRenk(i);
            this.graphics.fill();
            this.graphics.closePath();
        }
    }

    public drawGL(): void {


    }

    protected init() {
        this.margins = [32, 32, 32, 32]
    }
}