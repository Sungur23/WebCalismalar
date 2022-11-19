import React, {Component, useCallback, useEffect, useRef, useState} from "react";
import {GraphData} from "../../../utils/GraphData";
import PPIGraph from "./PPIGraph";
import {Axis} from "../../../utils/GraphParts";
import {useResizeDetector} from "react-resize-detector";
import {PPILineModel, TrackModel} from "../../../api/SimulationAPI";

import WebWorker from "web-worker:./PPIRadarVideoWorker.ts"
import PPIRadarVideoWorker from "./PPIRadarVideoWorker"

var ppiGraph: PPIGraph;
var graphData: GraphData;
var zoomMode: boolean = false;
var shift = 0;

export function ppiOnClick() {
    ppiGraph.resetCanvas();
}

export function setZoomMode() {
    zoomMode = !zoomMode;
    ppiGraph.setZoomMode(zoomMode);
}

export function setSecMode() {
    zoomMode = false;
    ppiGraph.setSecimMod(true);
}

export const setTracks = (trackList: TrackModel[]) => {

    // ppiGraph.clearData();
    graphData.x = []
    graphData.y = []
    // if (trackList == null || trackList.length == 0) {
    //     console.log("PPI Scope Object Reset")
    //     ppiGraph.clearData();
    // }
    // var tip : Utils.TRACK_TYPES = Utils.TRACK_TYPES[trackList[0].type];
    // console.log(tip);
    // const data = new GraphData();
    for (let i = 0; i < trackList.length; i++) {
        graphData.x[i] = trackList[i].azimuth!;
        graphData.y[i] = trackList[i].range!;
    }
    // ppiGraph.setAllData(data);

}


export const setPPILineVideo = (line: PPILineModel) => {

    const id = line.lineId!;
    if (id == ppiGraph.polarAngle * 2)
        shift += 5;
    if (ppiGraph.lineModel) {

        const sId = (id + shift) % (ppiGraph.polarAngle * 2 + 1)

        ppiGraph.lineModel[sId] = line;
        ppiGraph.drawRadarVideo(sId, line.rgbArray!)
    } else {
        ppiGraph.lineModel = [];
        ppiGraph.lineModel[id] = line;
        ppiGraph.drawRadarVideo(id, line.rgbArray!)
    }

}

export const drawRadarVideo = async () => {
    ppiGraph.drawRadarVideoAll()
}

export const cleanRadarVideo = async () => {
    ppiGraph.lineModel = [];
    ppiGraph.drawRadarVideoAll()
}

export default function PPIGraphPanel(props: { axis: Axis }) {
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

        if (canvas2d && canvasRadarVideo && rootDiv.current != null && width && height && ppiGraph != null) {
            ppiGraph.resize(width!, height!, true, true);
        }

        if (canvas2d && canvasRadarVideo && rootDiv.current != null && width && height && ppiGraph == null) {
            // alert("Hello + count: " + count + " |" + width.toFixed(1) + " : " + height.toFixed(1))
            graphData = new GraphData();
            // graphData.x = [-30, 15]
            // graphData.y = [550, 220]
            // canvas2d.transferControlToOffscreen();
            ppiGraph = new PPIGraph(canvas2d, canvasRadarVideo, props.axis, graphData);
            ppiGraph.resize(width!, height!, true, true);
        }

    }, [width, height, canvas2dRef, canvasRadarVideoRef]);

    return (

        <div id="ppiMain" style={{width: "100%", height: "100%", position: "relative"}} ref={rootDiv}>
            <div style={{position: "absolute", width: "100%", height: "100%"}}>
                <canvas id="canvasRadarVideo" width={width} height={height} ref={canvasRadarVideoRef}/>
            </div>
            <div style={{position: "absolute", width: "100%", height: "100%"}}>
                {/*<button className="tool-yenile" onClick={() => ppiGraph.resetCanvas()}></button>*/}
                <canvas id="canvas2d" width={width} height={height} ref={canvas2dRef}/>
            </div>
        </div>
    );
}
