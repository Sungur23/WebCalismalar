import React, {Component, useState, useEffect} from "react";
import "./CanvasPanel.css"
import hh_MTT from "../../img/hh_MTT_25.png"
import {Alert} from "antd";
import {TrackModel} from "../../api/SimulationAPI";

const degsToRads = deg => (deg * Math.PI) / 180.0;

var canvasWidthPosition;
var canvasHeightPosition;

function getPositionHipotenus(pos1, pos2) {

    return Math.sqrt(Math.pow((pos1[0] - pos2[0]), 2) + Math.pow((pos1[1] - pos2[1]), 2));
}


function getHalkaRenk(id) {

    if (id == 0)
        return '#133C40';
    else if (id == 1)
        return '#113539';
    else if (id == 2)
        return '#102F33';
    else if (id == 3)
        return '#0E272B';
    else
        return '#133C40';
}

function randomNumber(min, max) {
    // 👇️ get number between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomBool() {
    return Boolean(Math.round(Math.random()));
}

function getImgPos(img, coord) {
    return [coord[0] + img.width / 2, coord[1] + img.height / 2];
}

var scale = 1;
var orgnx = (0);
var orgny = (0);
var visibleWidth = 0;
var visibleHeight = 0;
var zoomIntensity = 0.05;
var zoom = 1;
const MAX_ZOOM_LIMIT = 16;
const MIN_ZOOM_LIMIT = 1;

var polarYaricap;
const halkaSayisi = 4;
let polarAngle = 50;

var adimX = 0.1;
var adimY = 0.5;
const img = new Image();
var diffControl = {id: -1, diff: 0}

var mouseDragActive = false;
let dragStart = {x: 0, y: 0}
let mouseDragToolActive = true;

function init() {
    scale = 1;
    zoom = 1;
    orgnx = (0);
    orgny = (0);
    visibleWidth = 0;
    visibleHeight = 0;
}

var targetSize = 200;
// let ppiScopePos = Array(targetSize).fill().map((u, y) =>
//     [randomNumber(-polarAngle, polarAngle), randomNumber(0, 200)]
// );
// let ppiScopeYon = Array(targetSize).fill(0).map(row => new Array(2).fill(randomBool()));

let ppiScopeObjects = [];

export function setTracks(trackList) {

    if (ppiScopeObjects.length == 0)
        ppiScopeObjects = Array(trackList.length).fill().map((u, y) => [0, 0]);
    for (let i = 0; i < ppiScopeObjects.length; i++) {
        ppiScopeObjects[i][0] = trackList[i].azimuth;
        ppiScopeObjects[i][1] = trackList[i].range;
    }
}

var cursor = {
    x: 200, y: 200,
    clickX: 200, clickY: 200
}
var compOnceControl = {
    c: 0
}
var selectedId = {
    id: -1
}

const handleMouseMove = event => {
    cursor.x = event.clientX - event.target.offsetLeft;
    cursor.y = event.clientY - event.target.offsetTop;
};

function getTransCoord(arr) {
    return [getAzmTrans(arr), getRangeTrans(arr)]
}

function getAzmTrans([yanca, menzil]) {
    return canvasWidthPosition - (menzil * Math.sin(degsToRads(yanca)));
}

function getRangeTrans([yanca, menzil]) {
    return canvasHeightPosition - (menzil * Math.cos(degsToRads(yanca)));
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

function clearCanvas(canvas) {
    var ctx = canvas.getContext('2d');     // gets reference to canvas context

    const transform = ctx.getTransform();
    ctx.clearRect(-transform.e / transform.a, -transform.f / transform.d, canvas.width, canvas.height);
}

const SELECTION_DIFF_CONSTANT = 4;

class CanvasPanel extends Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        // this.canvas = document.getElementById('glCanvas');
        // this.ctx = this.canvas.getContext('2d');
        img.src = hh_MTT;
        this.state = {
            cursor: {x: 0, y: 0},
            globalCoords: {x: 0, y: 0}
        }
        window.addEventListener('mousemove', handleMouseMove);
        // window.addEventListener('click', this.selectionControl(this.canvasRef));
    }

    handleMouseClick(canvasRef) {

        function getScaledPosition(canvas, pos) {
            if (scale == 1)
                return pos;

            const context = canvas.getContext('2d');
            const transform = context.getTransform();

            const invertedScaleX = 1 / transform.a;
            const invertedScaleY = 1 / transform.d;

            const x = invertedScaleX * pos[0] - invertedScaleX * transform.e;
            const y = invertedScaleY * pos[1] - invertedScaleY * transform.f;

            return [x, y];
        }

        function control(canvas) {
            var rect = canvas.getBoundingClientRect();
            if ((cursor.clickX < 0 || cursor.clickX > canvas.width)
                || (cursor.clickY < 0 || cursor.clickY > canvas.height)) {
                return;
            }
            var str = "";
            var selId = -1;
            const mouseScaled = getScaledPosition(canvas, [cursor.clickX, cursor.clickY]);
            for (let i = 0; i < ppiScopeObjects.length; i++) {

                // const coord = getImgPos(img, getTransCoord(ppiScopePos[i]));
                const coord = getTransCoord(ppiScopeObjects[i]);
                const number = parseInt(getPositionHipotenus(coord, mouseScaled));

                str = i + " --> " + [parseInt(coord[0]), parseInt(coord[1])]
                    + " - " + [cursor.clickX, cursor.clickY] + " :" + number;
                const carpan = scale == 1 ? 0 : (scale / 20);
                if (number < 12 - 12 * carpan) {

                    // ilk bulgu
                    if (diffControl.id == -1) {
                        selId = i;
                        diffControl.id = i;
                        diffControl.diff = number;
                    }
                    // daha yakin hedef varsa guncelle
                    else if (number < diffControl.diff) {
                        diffControl.id = i;
                        diffControl.diff = number;
                    }
                    // alert(str);
                    // break;
                }
            }
            // alert(str);
            selectedId.id = selId;
            diffControl.id = -1;
            diffControl.diff = 0;
        }

        return function (event) {

            const canvas = canvasRef.current;
            var rect = canvas.getBoundingClientRect();
            cursor.clickX = ((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
            cursor.clickY = ((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height

            if ((cursor.clickX < 0 || cursor.clickX > canvas.width)
                || (cursor.clickY < 0 || cursor.clickY > canvas.height)) {
                return;
            }

            const width = canvas.width;
            const height = canvas.height;

            event.preventDefault();
            var scroll = event.deltaY < 0 ? 1 : -1;

            var coor = "X coords: " + cursor.clickX + ", Y coords: " + cursor.clickY;
            // console.log("mouse: " + coor);
            control(canvas);
        };
    }

    handleMouseMove(canvasRef) {

        return function (event) {

            if (mouseDragActive) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                var rect = canvas.getBoundingClientRect();
                const dragX = ((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
                const dragY = ((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height

                if ((dragX < 0 || dragX > canvas.width)
                    || (dragY < 0 || dragY > canvas.height)) {
                    return;
                }

                event.preventDefault();

                if (scale != 1) {

                    const xTemp = (dragX - dragStart.x) / scale;
                    const yTemp = (dragY - dragStart.y) / scale;
                    ctx.translate(xTemp, yTemp);
                    dragStart.x = dragX;
                    dragStart.y = dragY;
                }
                ctx.save();
            }
        };
    }


    handleMouseDragStop(canvasRef) {
        return function (event) {
            // event.stopPropagation();
            const canvas = canvasRef.current;
            // clearCanvas(canvas);
            canvas.style.cursor = "default";
            dragStart = {x: 0, y: 0};
            mouseDragActive = false;
        };
    }

    handleMouseDragStart(canvasRef) {
        return function (event) {

            if (!mouseDragToolActive) return;

            const canvas = canvasRef.current;
            var rect = canvas.getBoundingClientRect();
            const dragX = ((event.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
            const dragY = ((event.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height

            if (scale == 1 || (dragX < 0 || dragX > canvas.width)
                || (dragY < 0 || dragY > canvas.height)) {
                return;
            }

            dragStart = {x: dragX, y: dragY};
            mouseDragActive = true;
            canvas.style.cursor = "pointer";
        };
    }

    zoomControl(canvas) {
        return function (event) {

            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            var scroll = event.deltaY < 0 ? 1 : -1;
            zoom = Math.exp(scroll * zoomIntensity);

            if ((scale * zoom) > MAX_ZOOM_LIMIT || (scale * zoom) < MIN_ZOOM_LIMIT) return;

            // clearCanvas(canvas);
            ctx.translate(orgnx, orgny);

            orgnx -= cursor.x / (scale * zoom) - cursor.x / scale;
            orgny -= cursor.y / (scale * zoom) - cursor.y / scale;

            ctx.scale(zoom, zoom);
            ctx.translate(-orgnx, -orgny);
            ctx.save();
            // Updating scale and visisble width and height
            scale *= zoom;
            visibleWidth = width / scale;
            visibleHeight = height / scale;
        };
    }

    drawPPIgrafik(ctx) {

    }

    canvasDraw(ctx, width, height) {

        return function draw() {

            // const transform = ctx.getTransform();
            // console.log(transform.a.toFixed(2) + " | " +
            //     transform.b.toFixed(2) + " | " +
            //     transform.c.toFixed(2) + " | " +
            //     transform.d.toFixed(2) + " | " +
            //     transform.e.toFixed(2) + " | " +
            //     transform.f.toFixed(2));
            clearCanvas(ctx.canvas);
            // ctx.clearRect(-transform.e / transform.a, -transform.f / transform.d, width, height);
            // alert(width + " - " + height);

            ctx.strokeStyle = 'gray';
            // ctx.globalAlpha = 0.7;
            for (let i = 0; i < halkaSayisi; i++) {

                ctx.beginPath();
                ctx.moveTo(canvasWidthPosition, canvasHeightPosition);
                ctx.arc(canvasWidthPosition, canvasHeightPosition,
                    ((halkaSayisi - i) * polarYaricap / halkaSayisi),
                    degsToRads(-polarAngle - 90), degsToRads(polarAngle - 90), false);
                ctx.moveTo(canvasWidthPosition, canvasHeightPosition);

                // const arr1 = [50, polarYaricap];
                // const coord1 = getTransCoord(arr1);
                // ctx.lineTo(coord1[0], coord1[1]);

                ctx.fillStyle = getHalkaRenk(i);
                ctx.fill();
                ctx.closePath();

                if (i == 0) {
                    // ctx.closePath();
                    // ctx.stroke();
                }
            }

            for (let i = 0; i < ppiScopeObjects.length; i++) {
                const coord = getTransCoord(ppiScopeObjects[i]);
                ctx.drawImage(img, coord[0] - img.width / 2, coord[1] - img.height / 2, img.width / scale, img.height / scale);
            }

            if (selectedId.id != -1) {
                const coord = getTransCoord(ppiScopeObjects[selectedId.id]);

                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2 / scale;

                const w = img.width;
                const h = img.height;
                const tx = coord[0] - getSelectionWidthLimit(img);
                const ty = coord[1] - getSelectionHeightLimit(img);

                ctx.strokeRect(tx, ty, (w + SELECTION_DIFF_CONSTANT * 2) / scale, (h + SELECTION_DIFF_CONSTANT * 2) / scale);
            }
            // ctx.save();
        }

        function getSelectionWidthLimit(img) {

            return (img.width / 2) + SELECTION_DIFF_CONSTANT / scale;
        }

        function getSelectionHeightLimit(img) {

            return (img.height / 2) + SELECTION_DIFF_CONSTANT / scale;
        }


        function moveTargets() {

            // for (let id = 0; id < ppiScopePos.length; id++) {
            //
            //     ppiScopeYon[id][0] ? ppiScopePos[id][0] += -adimX : ppiScopePos[id][0] += adimX;
            //     ppiScopeYon[id][1] ? ppiScopePos[id][1] += -adimY : ppiScopePos[id][1] += adimY;
            //
            //     if (ppiScopePos[id][0] > polarAngle) {
            //         ppiScopePos[id][0] = polarAngle;
            //         ppiScopeYon[id][0] = true;
            //     }
            //     if (ppiScopePos[id][0] < -polarAngle) {
            //         ppiScopePos[id][0] = -polarAngle;
            //         ppiScopeYon[id][0] = false;
            //     }
            //
            //     if (ppiScopePos[id][1] >= polarYaricap) {
            //         ppiScopePos[id][1] = polarYaricap;
            //         ppiScopeYon[id][1] = true;
            //     }
            //     if (ppiScopePos[id][1] < 0) {
            //         ppiScopePos[id][1] = 0;
            //         ppiScopeYon[id][1] = false;
            //     }
            // }
        }

    }

    onClick = (canvasRef) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.resetTransform();
        init();
        // this.canvasDraw(ctx, width, height).call();
    };


    componentDidMount() {
        // Draws a square in the middle of the canvas rotated
        // around the centre by this.props.angle
        // const {angle} = this.props;
        if (compOnceControl.c == 0) {
            compOnceControl.c = 1;
            const canvas = this.canvasRef.current;
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            polarYaricap = halkaSayisi * (height / 6);
            if (polarYaricap > height)
                polarYaricap = height;

            canvasWidthPosition = width / 2;
            canvasHeightPosition = height - 10;//height * 5 / 6;

            // polarYaricap = halkaSayisi * (height / 6);
            setInterval(this.canvasDraw(ctx, width, height), 1000 / 30);
            // Scroll effect function
            canvas.onwheel = this.zoomControl(canvas);
            canvas.addEventListener('click', this.handleMouseClick(this.canvasRef));
            window.addEventListener('mousemove', this.handleMouseMove(this.canvasRef));
            window.addEventListener('mouseup', this.handleMouseDragStop(this.canvasRef));
            window.addEventListener('mousedown', this.handleMouseDragStart(this.canvasRef));
        }
    }

    render() {

        return <div style={{height: "100%", backgroundColor: "#27464e", display: "flex", flexDirection: "column"}}>
            <button className="yenile" onClick={() => this.onClick(this.canvasRef)}></button>
            <canvas width="600" height="600" ref={this.canvasRef}
                    style={{backgroundColor: "#27464e", flex: "97%"}}/>
            {/*<canvas ref={this.canvasRef}  style={{backgroundColor: "#27464e"}}/>*/}
        </div>;
    }
}


export default CanvasPanel;