import React, {Component, useCallback, useEffect, useRef, useState} from "react";
import {GraphData} from "../../../utils/GraphData";
import CartesianGraph from "./CartesianGraph";
import {Axis} from "../../../utils/GraphParts";
import {useResizeDetector} from "react-resize-detector";
import {TrackModel} from "../../../api/SimulationAPI";
import {PanelUtil} from "../../../utils/PanelUtil";


var cartesianGraph: CartesianGraph;
const initialData: { [key: string]: GraphData } = {};
var zoomMode: boolean = false;


export default function CartesianGraphPanel(props: { xAxis: Axis; yAxes: Axis[] }) {
    const canvas2dRef = useRef<HTMLCanvasElement>(null);
    const canvasRadarVideoRef = useRef<HTMLCanvasElement>(null);

    const {
        height,
        width,
        ref: rootDiv,
    } = useResizeDetector<HTMLDivElement>({
        handleHeight: true, handleWidth: true,
        refreshMode: "debounce", refreshRate: 200, skipOnMount: false
    });
    useEffect(() => {
        const canvas2d = canvas2dRef.current;
        const canvasRadarVideo = canvasRadarVideoRef.current;

        if (canvas2d && canvasRadarVideo && rootDiv.current != null && width && height && cartesianGraph != null) {
            cartesianGraph.resize(width!, height!, true, true);
        }

        if (canvas2d && canvasRadarVideo && rootDiv.current != null && width && height && cartesianGraph == null) {
            // graphData.x = [-30, 15]
            // graphData.y = [550, 220]
            props.yAxes.forEach(v => initialData[v.id] = new GraphData())
            cartesianGraph = new CartesianGraph(canvas2d, canvasRadarVideo, props.xAxis, props.yAxes, axis => initialData[axis.id]);
            PanelUtil.addListeners(canvas2d, cartesianGraph);
            cartesianGraph.resize(width!, height!, true, true);
        }
    }, [width, height, canvas2dRef, canvasRadarVideoRef]);

    return (

        <div style={{width: "100%", height: "100%", position: "relative"}} ref={rootDiv}>
            <div style={{position: "absolute", width: "100%", height: "100%"}}>
                {/*<button className="tool-yenile" onClick={() => ppiGraph.resetCanvas()}></button>*/}
                <canvas id="canvas2d" width={width} height={height} ref={canvas2dRef}/>
                <canvas id="canvasRadarVideo" width={width} height={height} ref={canvasRadarVideoRef}/>
            </div>
        </div>
    );
}
