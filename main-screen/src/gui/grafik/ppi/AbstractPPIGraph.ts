import {AbstractGraph2D, MARGIN_LEFT_IDX, MARGIN_TOP_IDX} from "../AbstractGraph2D";
import {Axis} from "../../../utils/GraphParts";
import {GraphData} from "../../../utils/GraphData";
import {PPIProjection} from "../../../utils/PPIProjection";
import Myr from "../../../utils/myr";
import Utils from "../../../utils/Utils";
import hh_MTT from "../../../img/hh_MTT_25.png";


var centerX: number = NaN
var centerY: number = NaN
var radiusPx: number = NaN

export abstract class AbstractPPIGraph extends AbstractGraph2D {

    public polarAngle = 50;
    public img = new Image();
    public SELECTION_DIFF_CONSTANT = 4;
    public scale = 1;
    public orgnx = (0);
    public orgny = (0);
    public visibleWidth = 0;
    public visibleHeight = 0;
    public zoom = 1;
    public halkaSayisi = 4;
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
    protected proj = new PPIProjection();

    public constructor(canvas2d: HTMLCanvasElement,
                       protected axis: Axis,
                       protected getData: () => GraphData) {
        super(canvas2d);

        if (axis.range === undefined) {
            throw new Error("You must define range for axis for polar graphs")
        }
        this.axis = Axis.copy(axis)
        radiusPx = this.axis.range![1] / Math.sqrt(2);
        this.img.src = hh_MTT;

        // this.polarYaricap = this.axis.range![1] / Math.sqrt(2);
        this.polarAngle = this.axis.angle!;

        // Scroll effect function
        canvas2d.addEventListener('wheel', (event) => this.zoomControl(event));
        canvas2d.addEventListener('click', (event) => this.handleMouseClick(event));
        canvas2d.addEventListener('mousemove', (event) => this.handleMouseMove(event));
        canvas2d.addEventListener('mouseup', (event) => this.handleMouseDragStop(event));
        canvas2d.addEventListener('mousedown', (event) => this.handleMouseDragStart(event));
    }

    getScaledPosition(canvas: HTMLCanvasElement, pos: any) {
        if (this.scale == 1)
            return pos;

        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        const transform = context.getTransform();

        const invertedScaleX = 1 / transform.a;
        const invertedScaleY = 1 / transform.d;

        const x = invertedScaleX * pos[0] - invertedScaleX * transform.e;
        const y = invertedScaleY * pos[1] - invertedScaleY * transform.f;

        return [x, y];
    }

    control() {
        var rect = this.canvas2d.getBoundingClientRect();
        if ((this.cursor.clickX < 0 || this.cursor.clickX > this.canvas2d.width)
            || (this.cursor.clickY < 0 || this.cursor.clickY > this.canvas2d.height)) {
            return;
        }
        var str = "";
        var selId = -1;
        const mouseScaled = this.getScaledPosition(this.canvas2d, [this.cursor.clickX, this.cursor.clickY]);
        const data = this.getData();
        const target = [NaN, NaN];
        for (let i = 0; i < data.x.length; i++) {

            // const coord = getImgPos(img, getTransCoord(ppiScopePos[i]));

            this.proj.toView([this.axis.toRatio(data.y[i]), data.x[i]], target);
            // const coord = this.getTransCoord(ppiScopeObjects[i]);
            const number = Math.floor(Utils.getPositionHipotenus(target, mouseScaled));

            str = i + " --> " + [Math.floor(target[0]), Math.floor(target[1])]
                + " - " + [this.cursor.clickX, this.cursor.clickY] + " :" + number;
            const carpan = this.scale == 1 ? 0 : (this.scale / 20);
            if (number < 12 - 12 * carpan) {

                // ilk bulgu
                if (this.diffControl.id == -1) {
                    selId = i;
                    this.diffControl.id = i;
                    this.diffControl.diff = number;
                }
                // daha yakin hedef varsa guncelle
                else if (number < this.diffControl.diff) {
                    this.diffControl.id = i;
                    this.diffControl.diff = number;
                }
            }
        }
        this.selectedId.id = selId;
        this.diffControl.id = -1;
        this.diffControl.diff = 0;
    }

    handleMouseClick(event: any) {

        var rect = this.canvas2d.getBoundingClientRect();
        this.cursor.clickX = ((event.clientX - rect.left) / (rect.right - rect.left)) * this.canvas2d.width;
        this.cursor.clickY = ((event.clientY - rect.top) / (rect.bottom - rect.top)) * this.canvas2d.height

        if ((this.cursor.clickX < 0 || this.cursor.clickX > this.canvas2d.width)
            || (this.cursor.clickY < 0 || this.cursor.clickY > this.canvas2d.height)) {
            return;
        }

        const width = this.canvas2d.width;
        const height = this.canvas2d.height;

        event.preventDefault();
        this.control();
    };

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

    resetCanvas() {
        this.graphics.resetTransform();
        this.drawCanvas();
    }

    clearCanvas() {
        const transform = this.graphics.getTransform();
        this.graphics.clearRect(-transform.e / transform.a, -transform.f / transform.d,
            this.canvas2d.width, this.canvas2d.height);
    }

    public resize(width: number, height: number, repaint = false, force = false) {
        super.resize(width, height, repaint, force);

        // radiusPx = Math.min(this.width, this.height) / 2;
        centerX = this.width / 2 + this.margins[MARGIN_LEFT_IDX]
        centerY = this.height + this.margins[MARGIN_TOP_IDX]

        this.proj?.update(0, centerX, centerY, this.width, this.height, 1, radiusPx);
    }

    public drawCanvas(): void {

        this.clearCanvas();
        this.graphics.strokeStyle = 'gray';

        this.graphics.globalAlpha = 0.1;
        // const halkaSayisi = 4;
        // const canvasWidthPosition = this.canvas2d.width / 2;
        // const canvasHeightPosition = this.canvas2d.height;
        // const polarYaricap = this.axis.range![1] / Math.sqrt(2);
        // const polarAngle = this.axis.angle!;
        for (let i = 0; i < this.halkaSayisi; i++) {

            this.graphics.beginPath();
            this.graphics.moveTo(centerX!, centerY!);
            this.graphics.arc(centerX!, centerY!,
                ((this.halkaSayisi - i) * radiusPx! / this.halkaSayisi),
                Utils.degsToRads(-this.polarAngle - 90), Utils.degsToRads(this.polarAngle - 90), false);
            this.graphics.moveTo(centerX!, centerY!);

            this.graphics.fillStyle = Utils.getHalkaRenk(i);
            this.graphics.fill();
            this.graphics.closePath();
        }

        this.graphics.globalAlpha = 1;
        this.graphics.beginPath()
        const target = [NaN, NaN]
        // this.graphics.setLineDash([10, 20])
        this.graphics.lineWidth = 0.2
        for (let t = -this.polarAngle; t <= this.polarAngle; t += 10) {
            this.proj.toView([1, t], target);
            this.graphics.moveTo(centerX, centerY)
            this.graphics.lineTo(target[0], target[1])
            this.proj.toView([1, t], target);
        }

        // this.graphics.stroke()
        // this.graphics.beginPath()
        // this.graphics.setLineDash([])
        for (let r = radiusPx / 4; r <= radiusPx; r += radiusPx / 4) {
            this.graphics.moveTo(centerX, centerY)
            this.graphics.arc(centerX, centerY, r, Utils.degsToRads(-this.polarAngle - 90), Utils.degsToRads(this.polarAngle - 90))
        }
        this.graphics.fillStyle = "rgba(255, 255, 255, 0.85)"
        // Yanca acilari
        for (let t = -this.polarAngle; t <= this.polarAngle; t += 10) {
            this.proj.toView([1 + 16 / radiusPx, t], target);
            this.graphics.fillText(t + "", target[0], target[1])
        }
        this.graphics.font = `10px`
        this.graphics.textAlign = "right"
        this.graphics.textBaseline = "top"
        this.graphics.fillStyle = this.axis.hexColor
        // Menzil degerleri negatif yon
        for (let r = radiusPx / 4; r <= radiusPx; r += radiusPx / 4) {
            this.graphics.moveTo(centerX, centerY)
            this.proj.toView([r / radiusPx, -this.polarAngle], target);
            this.graphics.fillText(this.axis.toValue(r / radiusPx).toFixed(0), target[0], target[1])
        }

        // Menzil degerleri pozitif yon
        for (let r = radiusPx / 4; r <= radiusPx; r += radiusPx / 4) {
            this.graphics.moveTo(centerX, centerY)
            this.proj.toView([(r + 5) / radiusPx, this.polarAngle + 1], target);
            this.graphics.fillText(this.axis.toValue(r / radiusPx).toFixed(0), target[0], target[1])
        }

        this.graphics.stroke()
    }

    public drawGL(): void {

        const data = this.getData()
        const target = [NaN, NaN]
        for (let i = 0; i < data.x.length; i++) {
            this.proj.toView([this.axis.toRatio(data.y[i]), data.x[i]], target);
            this.graphics.drawImage(
                this.img,
                target[0] - this.img.width / 2,
                target[1] - this.img.height / 2,
                this.img.width / this.scale,
                this.img.height / this.scale);
        }

        if (this.selectedId.id != -1) {
            this.proj.toView([this.axis.toRatio(data.y[this.selectedId.id]), data.x[this.selectedId.id]], target);

            this.graphics.strokeStyle = 'red';
            this.graphics.lineWidth = 2 / this.scale;

            const w = this.img.width;
            const h = this.img.height;
            const tx = target[0] - this.getSelectionWidthLimit(this.img);
            const ty = target[1] - this.getSelectionHeightLimit(this.img);

            this.graphics.strokeRect(tx, ty,
                (w + this.SELECTION_DIFF_CONSTANT * 2) / this.scale,
                (h + this.SELECTION_DIFF_CONSTANT * 2) / this.scale);
        }
        // ctx.save();

    }

    getSelectionWidthLimit(img: any) {
        return (img.width / 2) + this.SELECTION_DIFF_CONSTANT / this.scale;
    }

    getSelectionHeightLimit(img: any) {
        return (img.height / 2) + this.SELECTION_DIFF_CONSTANT / this.scale;
    }

    public clearData() {
        this.getData().clear();
    }

    public getAllData(): GraphData {
        return this.getData();
    }

    protected init() {
        this.margins = [32, 32, 32, 32]
    }
}