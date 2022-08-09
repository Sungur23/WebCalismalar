import React, {Component} from "react";
import "./CanvasPanel.css"

const degsToRads = deg => (deg * Math.PI) / 180.0;


function getCanvasWidthPosition(width) {
    return width / 2;
}

function getCanvasHeightPosition(height) {
    return height * 5 / 6;
}

var scale = 1;
var orgnx = (0);
var orgny = (0);
var visibleWidth = 0;
var visibleHeight = 0;
var zoomIntensity = 0.05;

class CanvasPanel extends Component {
    constructor(props) {
        super(props);

        this.canvasRef = React.createRef();
        // this.canvas = document.getElementById('glCanvas');
        // this.ctx = this.canvas.getContext('2d');

    }

    zoomControl(canvas) {
        return function (event) {

            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;


            ctx.clearRect(0, 0, width, height);
            event.preventDefault();
            // var x = width / 2;//event.clientX - canvas.offsetLeft;
            // var y = height * 2 / 3;//event.clientY - canvas.offsetTop;
            var x = event.clientX - canvas.offsetLeft;
            var y = event.clientY - canvas.offsetTop;

            var scroll = event.deltaY < 0 ? 1 : -1;

            var zoom = Math.exp(scroll * zoomIntensity);

            ctx.translate(orgnx, orgny);

            orgnx -= x / (scale * zoom) - x / scale;
            orgny -= y / (scale * zoom) - y / scale;

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
                // ctx.fillStyle = 'green';
                // ctx.fillRect(10, 10, 400, 400);
                ctx.clearRect(0, 0, width, height);
                // ctx.fillRect(25, 25, 100, 100);
                // ctx.clearRect(45, 45, 60, 60);
                // ctx.strokeRect(50, 50, 50, 50);

                // ctx.beginPath();
                // ctx.moveTo(200, 400);
                // ctx.lineTo(10, 10);
                // ctx.lineTo(400, 10);
                // ctx.fill();

                // alert(width + " - " + height);
                let ang = 50;
                const wCenter = getCanvasWidthPosition(width);
                const hCenter = getCanvasHeightPosition(height);
                const r = height / 6;

                ctx.beginPath();
                ctx.moveTo(wCenter, hCenter);
                ctx.arc(wCenter, hCenter, r * 4, degsToRads(-ang - 90), degsToRads(ang - 90), false);
                ctx.fillStyle = '#133C40';
                ctx.fill();
                ctx.closePath();
                ctx.strokeStyle = 'gray';
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(wCenter, hCenter);
                ctx.arc(wCenter, hCenter, r * 3, degsToRads(-ang - 90), degsToRads(ang - 90), false);
                ctx.fillStyle = '#113539';
                ctx.fill();
                // ctx.closePath();
                // ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(wCenter, hCenter);
                ctx.arc(wCenter, hCenter, r * 2, degsToRads(-ang - 90), degsToRads(ang - 90), false);
                ctx.fillStyle = '#102F33';
                ctx.fill();
                // ctx.closePath();
                // ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(wCenter, hCenter);
                ctx.arc(wCenter, hCenter, r, degsToRads(-ang - 90), degsToRads(ang - 90), false);
                ctx.fillStyle = '#0E272B';
                ctx.fill();
                // ctx.closePath();
                // ctx.stroke();
            }
        }
    }

    onClick = (canvasRef) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.resetTransform();
        // this.canvasDraw(ctx, width, height).call();
    };


    componentDidMount() {
        // Draws a square in the middle of the canvas rotated
        // around the centre by this.props.angle
        // const {angle} = this.props;
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        setInterval(this.canvasDraw(ctx, width, height), 10);
        // Scroll effect function
        canvas.onwheel = this.zoomControl(canvas)
    }

    render() {

        return <div style={{height: "100%", backgroundColor: "#27464e", display: "flex", flexDirection: "column"}}>
            <button className="yenile" onClick={() => this.onClick(this.canvasRef)}></button>
            <canvas width="450" height="400" ref={this.canvasRef} style={{backgroundColor: "#27464e", flex: "97%"}}/>
            {/*<canvas ref={this.canvasRef}  style={{backgroundColor: "#27464e"}}/>*/}
        </div>;
    }
}


export default CanvasPanel;