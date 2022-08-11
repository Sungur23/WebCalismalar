import React, {Component, useState, useEffect} from "react";
import "./CanvasPanel.css"
import hh_MTT from "../../img/hh_MTT.png"
import {Alert} from "antd";

const degsToRads = deg => (deg * Math.PI) / 180.0;


function getCanvasWidthPosition(width) {
    return width / 2;
}

function getCanvasHeightPosition(height) {
    return height * 5 / 6;
}

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

var scale = 1;
var orgnx = (0);
var orgny = (0);
var visibleWidth = 0;
var visibleHeight = 0;
var zoomIntensity = 0.05;

function init() {
    scale = 1;
    orgnx = (0);
    orgny = (0);
    visibleWidth = 0;
    visibleHeight = 0;
}

let ppiScopePos = [
    [100, 105],
    [90, 125],
    [80, 145],
    [70, 165]
];
let ppiScopeYon = [
    [false, false],
    [false, true],
    [false, false],
    [false, true]
];

var adimX = 0.02;
var adimY = 0.01;
const img = new Image();

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

            for (let i = 0; i < ppiScopePos.length; i++) {

                const number = parseInt(getPositionHipotenus(ppiScopePos[i], mouseScaled));

                // str += i + " --> " + ([parseInt(ppiScopePos[i][0]), parseInt(ppiScopePos[i][1])] + "  scale:" + scale.toFixed(2) + " \n "
                //     + mouseScaled[0].toFixed(2) + "," + mouseScaled[1].toFixed(2) + " * "
                //     + [cursor.clickX.toFixed(2), cursor.clickY.toFixed(2)] + "  diff:" + number) + "\n";


                str = i + " --> "
                    + [parseInt(ppiScopePos[i][0]), parseInt(ppiScopePos[i][1])]
                    + " - "
                    + [cursor.clickX, cursor.clickY]
                    + " :"
                    + number;
                const carpan = scale == 1 ? 0 : (scale / 20);
                // console.log(12 - 12 * carpan);
                if (number < 12 - 12 * carpan) {
                    selId = i;
                    // alert(str);
                    break;
                }
            }
            // alert(str);

            selectedId.id = selId;
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
            console.log("mouse: " + coor);
            control(canvas);
        };
    }

    handleMouseMove(canvasRef) {

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
            console.log("mouse move: " + coor);
        };
    }

    zoomControl(canvas) {
        return function (event) {

            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            var scroll = event.deltaY < 0 ? 1 : -1;
            var zoom = Math.exp(scroll * zoomIntensity);

            if ((scale * zoom) > 4 || (scale * zoom) < 1) return;

            ctx.clearRect(0, 0, width, height);
            ctx.translate(orgnx, orgny);

            orgnx -= cursor.x / (scale * zoom) - cursor.x / scale;
            orgny -= cursor.y / (scale * zoom) - cursor.y / scale;

            ctx.scale(zoom, zoom);
            ctx.translate(-orgnx, -orgny);

            // Updating scale and visisble width and height
            scale *= zoom;
            visibleWidth = width / scale;
            visibleHeight = height / scale;
        };
    }

    canvasDraw(ctx, width, height) {

        return function draw() {

            if (ctx != null) {
                ctx.clearRect(0, 0, width, height);
                // alert(width + " - " + height);
                let ang = 50;
                const wCenter = getCanvasWidthPosition(width);
                const hCenter = getCanvasHeightPosition(height);
                const r = height / 6;

                ctx.strokeStyle = 'gray';
                ctx.globalAlpha = 0.7;

                //draw full circles
                // ctx.moveTo(wCenter, hCenter);
                // for (let i = 0; i < 7; i++) {
                //     ctx.beginPath();
                //     ctx.arc(wCenter, hCenter, 10 + 10 * i, 0, Math.PI * 2, true);
                //     ctx.fill();
                // }

                for (let i = 0; i < 4; i++) {

                    ctx.beginPath();
                    ctx.moveTo(wCenter, hCenter);
                    ctx.arc(wCenter, hCenter, r * (4 - i), degsToRads(-ang - 90), degsToRads(ang - 90), false);
                    ctx.fillStyle = getHalkaRenk(i);
                    ctx.fill();

                    if (i == 5) {
                        ctx.closePath();
                        ctx.stroke();
                    }
                }

                // const time = new Date();
                // ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
                // ctx.translate(105, 0);
                // ctx.fillRect(0, -12, 40, 24); // Shadow
                moveX();
                moveY();
                const imgWidth = img.width / 3;
                const imgHeight = img.height / 3;

                ctx.drawImage(img, ppiScopePos[0][0], ppiScopePos[0][1], imgWidth, imgHeight);
                ctx.drawImage(img, ppiScopePos[1][0], ppiScopePos[1][1], imgWidth, imgHeight);
                ctx.drawImage(img, ppiScopePos[2][0], ppiScopePos[2][1], imgWidth, imgHeight);
                ctx.drawImage(img, ppiScopePos[3][0], ppiScopePos[3][1], imgWidth, imgHeight);

                if (selectedId.id != -1) {
                    ctx.strokeRect(ppiScopePos[selectedId.id][0], ppiScopePos[selectedId.id][1], imgWidth, imgHeight);
                }
            }
        }

        function moveX() {

            for (let id = 0; id < ppiScopePos.length; id++) {
                ppiScopeYon[id][0] ? ppiScopePos[id][0] += -adimX : ppiScopePos[id][0] += adimX;
                if (ppiScopePos[id][0] > 300) {
                    ppiScopeYon[id][0] = true;
                }
                if (ppiScopePos[id][0] < 70 + (id * 10)) {
                    ppiScopeYon[id][0] = false;
                }
            }
        }

        function moveY() {

            for (let id = 0; id < ppiScopePos.length; id++) {
                ppiScopeYon[id][1] ? ppiScopePos[id][1] += -adimY : ppiScopePos[id][1] += adimY;
                if (ppiScopePos[id][1] > 210) {
                    ppiScopeYon[id][1] = true;
                }
                if (ppiScopePos[id][1] < 90) {
                    ppiScopeYon[id][1] = false;
                }
            }
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
            setInterval(this.canvasDraw(ctx, width, height), 1);
            // Scroll effect function
            canvas.onwheel = this.zoomControl(canvas);
            window.addEventListener('click', this.handleMouseClick(this.canvasRef));
            window.addEventListener('dragleave', this.handleMouseMove(this.canvasRef));
        }
    }

    render() {

        return <div style={{height: "100%", backgroundColor: "#27464e", display: "flex", flexDirection: "column"}}>
            <button className="yenile" onClick={() => this.onClick(this.canvasRef)}></button>
            <canvas width="450" height="400" ref={this.canvasRef}
                    style={{backgroundColor: "#27464e", flex: "97%", maxWidth: "450", maxHeight: "400"}}/>
            {/*<canvas ref={this.canvasRef}  style={{backgroundColor: "#27464e"}}/>*/}
        </div>;
    }
}


export default CanvasPanel;