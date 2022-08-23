import React, {Component, useState, useEffect} from "react";
import "./PPICanvasPanel.css"
import Utils from "../../utils/Utils";
import {TrackModel} from "../../api/SimulationAPI";
import hh_MTT from "../../img/hh_MTT_25.png";


var ppiScopeObjects: any[] = [];

export function setTracks(trackList: TrackModel[]) {

    if (trackList == null || trackList.length == 0) {
        console.log("PPI Scope Object Reset")
        ppiScopeObjects = [];
        return;
    }
    // var tip : Utils.TRACK_TYPES = Utils.TRACK_TYPES[trackList[0].type];
    // console.log(tip);
    if (ppiScopeObjects.length == 0)
        ppiScopeObjects = (Array(trackList.length).fill(0).map((u, y) => [0, 0]));
    for (let i = 0; i < (ppiScopeObjects).length; i++) {
        ppiScopeObjects[i][0] = trackList[i].azimuth;
        ppiScopeObjects[i][1] = trackList[i].range;
    }
}

class PPICanvasPanel extends Component {
    public canvasRef: React.RefObject<HTMLCanvasElement>;
    public ro: ResizeObserver;


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
    public compOnceControl = 0;
    public selectedId = {
        id: -1
    }

    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.canvasRef = React.createRef();
        this.ro = new ResizeObserver(e => {
            //for (let en of e) {
            // console.log(e[0].target.clientWidth + " - " + e[0].target.clientHeight);
            const canvas = this.canvasRef.current as HTMLCanvasElement;
            canvas.height = e[0].target.clientHeight * 0.97;
            canvas.width = e[0].target.clientWidth;

            this.canvasWidthPosition = canvas.width / 2;
            this.canvasHeightPosition = canvas.height - 10;//height * 5 / 6;

            //}
        });
        ppiScopeObjects = [];
        this.polarYaricap = 0;
        this.canvasHeightPosition = 0;
        this.canvasWidthPosition = 0;
        this.img.src = hh_MTT;
    }

    init() {
        this.scale = 1;
        this.zoom = 1;
        this.orgnx = (0);
        this.orgny = (0);
        this.visibleWidth = 0;
        this.visibleHeight = 0;
    }

    getTransCoord(arr: number[]) {
        return [this.getAzmTrans(arr), this.getRangeTrans(arr)]
    }

    getAzmTrans(coord: number[]) {
        return this.canvasWidthPosition - ((coord[1] * Math.sin(Utils.degsToRads(coord[0]))) * this.polarYaricap / 1000);
    }

// function clearCanvas(canvas) {
//     var ctx = canvas.getContext('2d');     // gets reference to canvas context
//     ctx.beginPath();    // clear existing drawing paths
//     ctx.save();         // store the current transformation matrix
//
//     // Use the identity matrix while clearing the canvas
//     ctx.setTransform(1, 0, 0, 1, 0, 0);
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//     ctx.restore();        // restore the transform
// }

    getRangeTrans(coord: number[]) {
        return this.canvasHeightPosition - ((coord[1] * Math.cos(Utils.degsToRads(coord[0]))) * this.polarYaricap / 1000);
    }


    clearCanvas(canvas: HTMLCanvasElement) {
        var ctx = canvas.getContext('2d');     // gets reference to canvas context

        if (ctx) {
            const transform = ctx.getTransform();
            ctx.clearRect(-transform.e / transform.a, -transform.f / transform.d, canvas.width, canvas.height);
        }
    }

    // handleMouseClick() {

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

    control(canvas: HTMLCanvasElement) {
        var rect = canvas.getBoundingClientRect();
        if ((this.cursor.clickX < 0 || this.cursor.clickX > canvas.width)
            || (this.cursor.clickY < 0 || this.cursor.clickY > canvas.height)) {
            return;
        }
        var str = "";
        var selId = -1;
        const mouseScaled = this.getScaledPosition(canvas, [this.cursor.clickX, this.cursor.clickY]);
        for (let i = 0; i < ppiScopeObjects.length; i++) {

            // const coord = getImgPos(img, getTransCoord(ppiScopePos[i]));
            const coord = this.getTransCoord(ppiScopeObjects[i]);
            const number = Math.floor(Utils.getPositionHipotenus(coord, mouseScaled));

            str = i + " --> " + [Math.floor(coord[0]), Math.floor(coord[1])]
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

        if (this.canvasRef == null) return;
        const canvas = this.canvasRef.current as HTMLCanvasElement;
        var rect = canvas.getBoundingClientRect();
        this.cursor.clickX = ((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
        this.cursor.clickY = ((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height

        if ((this.cursor.clickX < 0 || this.cursor.clickX > canvas.width)
            || (this.cursor.clickY < 0 || this.cursor.clickY > canvas.height)) {
            return;
        }

        const width = canvas.width;
        const height = canvas.height;

        event.preventDefault();
        this.control(canvas);
    };

    // }

    handleMouseMove(event: any) {

        if (this.mouseDragActive) {
            if (this.canvasRef == null) return;
            const canvas = this.canvasRef.current as HTMLCanvasElement;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

            var rect = canvas.getBoundingClientRect();
            const dragX = ((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
            const dragY = ((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height

            if ((dragX < 0 || dragX > canvas.width)
                || (dragY < 0 || dragY > canvas.height)) {
                return;
            }

            event.preventDefault();

            if (this.scale != 1) {

                const xTemp = (dragX - this.dragStart.x) / this.scale;
                const yTemp = (dragY - this.dragStart.y) / this.scale;
                ctx.translate(xTemp, yTemp);
                this.dragStart.x = dragX;
                this.dragStart.y = dragY;
            }
            ctx.save();
        }
    }


    handleMouseDragStop(event: any) {
        // event.stopPropagation();
        if (this.canvasRef == null) return;
        const canvas = this.canvasRef.current as HTMLCanvasElement;
        // clearCanvas(canvas);
        canvas.style.cursor = "default";
        this.dragStart = {x: 0, y: 0};
        this.mouseDragActive = false;
    };


    handleMouseDragStart(event: any) {

        if (this.canvasRef == null) return;
        if (!this.mouseDragToolActive) return;

        const canvas = this.canvasRef.current as HTMLCanvasElement;
        var rect = canvas.getBoundingClientRect();
        const dragX = ((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
        const dragY = ((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height

        if (this.scale == 1 || (dragX < 0 || dragX > canvas.width)
            || (dragY < 0 || dragY > canvas.height)) {
            return;
        }

        this.dragStart = {x: dragX, y: dragY};
        this.mouseDragActive = true;
        canvas.style.cursor = "pointer";
    };

    zoomControl(canvas: HTMLCanvasElement, event: any) {

        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const width = canvas.width;
        const height = canvas.height;

        var scroll = event.deltaY < 0 ? 1 : -1;
        this.zoom = Math.exp(scroll * this.zoomIntensity);

        if ((this.scale * this.zoom) > this.MAX_ZOOM_LIMIT || (this.scale * this.zoom) < this.MIN_ZOOM_LIMIT) return;

        // clearCanvas(canvas);
        ctx.translate(this.orgnx, this.orgny);

        this.orgnx -= this.cursor.x / (this.scale * this.zoom) - this.cursor.x / this.scale;
        this.orgny -= this.cursor.y / (this.scale * this.zoom) - this.cursor.y / this.scale;

        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-this.orgnx, -this.orgny);
        ctx.save();
        // Updating scale and visisble width and height
        this.scale *= this.zoom;
        this.visibleWidth = width / this.scale;
        this.visibleHeight = height / this.scale;
    };

    canvasDraw(ctx: CanvasRenderingContext2D, width: number, height: number) {

        // const transform = ctx.getTransform();
        // console.log(transform.a.toFixed(2) + " | " +
        //     transform.b.toFixed(2) + " | " +
        //     transform.c.toFixed(2) + " | " +
        //     transform.d.toFixed(2) + " | " +
        //     transform.e.toFixed(2) + " | " +
        //     transform.f.toFixed(2));
        this.clearCanvas(ctx.canvas);
        // ctx.clearRect(-transform.e / transform.a, -transform.f / transform.d, width, height);
        // alert(width + " - " + height);

        ctx.strokeStyle = 'gray';
        // ctx.globalAlpha = 0.7;
        for (let i = 0; i < this.halkaSayisi; i++) {

            ctx.beginPath();
            ctx.moveTo(this.canvasWidthPosition!, this.canvasHeightPosition!);
            ctx.arc(this.canvasWidthPosition!, this.canvasHeightPosition!,
                ((this.halkaSayisi - i) * this.polarYaricap! / this.halkaSayisi),
                Utils.degsToRads(-this.polarAngle - 90), Utils.degsToRads(this.polarAngle - 90), false);
            ctx.moveTo(this.canvasWidthPosition!, this.canvasHeightPosition!);

            // const arr1 = [50, polarYaricap];
            // const coord1 = getTransCoord(arr1);
            // ctx.lineTo(coord1[0], coord1[1]);

            ctx.fillStyle = Utils.getHalkaRenk(i);
            ctx.fill();
            ctx.closePath();

            if (i == 0) {
                // ctx.closePath();
                // ctx.stroke();
            }
        }

        if (ppiScopeObjects) {
            console.log(ppiScopeObjects.length);
            for (let i = 0; i < ppiScopeObjects!.length; i++) {
                const coord = this.getTransCoord(ppiScopeObjects![i]);
                ctx.drawImage(
                    this.img,
                    coord[0] - this.img.width / 2,
                    coord[1] - this.img.height / 2,
                    this.img.width / this.scale,
                    this.img.height / this.scale);
            }

            if (this.selectedId.id != -1) {
                const coord = this.getTransCoord(ppiScopeObjects![this.selectedId.id]);

                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2 / this.scale;

                const w = this.img.width;
                const h = this.img.height;
                const tx = coord[0] - this.getSelectionWidthLimit(this.img);
                const ty = coord[1] - this.getSelectionHeightLimit(this.img);

                ctx.strokeRect(tx, ty,
                    (w + this.SELECTION_DIFF_CONSTANT * 2) / this.scale,
                    (h + this.SELECTION_DIFF_CONSTANT * 2) / this.scale);
            }
            // ctx.save();
        }
    }

    getSelectionWidthLimit(img: any) {

        return (img.width / 2) + this.SELECTION_DIFF_CONSTANT / this.scale;
    }

    getSelectionHeightLimit(img: any) {

        return (img.height / 2) + this.SELECTION_DIFF_CONSTANT / this.scale;
    }

    onClick = () => {
        const canvas = this.canvasRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        ctx.resetTransform();
        this.init();
        // this.canvasDraw(ctx, width, height).call();
    };

    // onResize = (event: any) => {
    //     this.ro.observe(document.getElementById("main-canvas-div"));
    // }

    onResize(event: any) {
        const elementById = document.getElementById("main-canvas-div");
        if (elementById) {
            this.ro.observe(elementById);
        }
    }


    componentDidMount() {
        // Draws a square in the middle of the canvas rotated
        // around the centre by this.props.angle
        // const {angle} = this.props;
        if (this.compOnceControl == 0) {
            this.compOnceControl = 1;
            const canvas = this.canvasRef.current as HTMLCanvasElement;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            // console.log("CANVAS: " + width + " - " + height);

            this.polarYaricap = this.halkaSayisi * (canvas.height / 5);
            if (this.polarYaricap > canvas.height)
                this.polarYaricap = canvas.height;

            this.canvasWidthPosition = canvas.width / 2;
            this.canvasHeightPosition = canvas.height - 10;//height * 5 / 6;

            // orgnx = width / 2;
            // orgny = height / 2;

            // polarYaricap = halkaSayisi * (height / 6);
            setInterval(() => this.canvasDraw(ctx, canvas.width, canvas.height), 1000 / 30);
            // Scroll effect function
            canvas.addEventListener('wheel', (event) => this.zoomControl(canvas, event));
            canvas.addEventListener('click', (event) => this.handleMouseClick(event));
            canvas.addEventListener('mousemove', (event) => this.handleMouseMove(event));
            canvas.addEventListener('mouseup', (event) => this.handleMouseDragStop(event));
            canvas.addEventListener('mousedown', (event) => this.handleMouseDragStart(event));
            canvas.addEventListener('resize', (event) => this.onResize(event));
        }

    }

    render() {

        const h = window.innerHeight * 0.88;
        const w = h * Math.sqrt(2);//window.innerWidth * 0.65;

        return <div id="main-canvas-div" className="main-canvas" onChange={this.onResize}>
            <button className="tool-yenile" onClick={() => this.onClick()}></button>
            <canvas id="canvas" className="canvas" width={w} height={h} ref={this.canvasRef}/>
        </div>;
    }
}


export default PPICanvasPanel;