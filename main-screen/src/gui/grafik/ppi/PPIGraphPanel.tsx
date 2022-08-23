import React, {Component, useCallback, useEffect, useRef, useState} from "react";
import {GraphData} from "../../../utils/GraphData";
import PPIGraph from "./PPIGraph";
import {Axis} from "../../../utils/GraphParts";
import {useResizeDetector} from "react-resize-detector";
import {TrackModel} from "../../../api/SimulationAPI";


var ppiGraph: PPIGraph;

export function ppiOnClick() {
    ppiGraph.resetCanvas();
}

export function setTracks(trackList: TrackModel[]) {

    if (trackList == null || trackList.length == 0) {
        console.log("PPI Scope Object Reset")
        ppiGraph.clearData();
    }
    // var tip : Utils.TRACK_TYPES = Utils.TRACK_TYPES[trackList[0].type];
    // console.log(tip);
    if (ppiGraph.getAllData().x.length == 0) {
        ppiGraph.getAllData().x = Array(trackList.length).fill(0);
        ppiGraph.getAllData().y = Array(trackList.length).fill(0);
    }
    for (let i = 0; i < ppiGraph.getAllData().x.length; i++) {
        ppiGraph.getAllData().x[i] = trackList[i].azimuth!;
        ppiGraph.getAllData().y[i] = trackList[i].range!;
    }
}

export default function PPIGraphPanel(props: { axis: Axis }) {
    const canvas2dRef = useRef<HTMLCanvasElement>(null);
    var graphData: GraphData;

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
        if (canvas2d && rootDiv.current != null && width && height) {
            // alert("Hello + count: " + count + " |" + width.toFixed(1) + " : " + height.toFixed(1))
            graphData = new GraphData();
            // graphData.x = [-30, 15]
            // graphData.y = [550, 220]
            ppiGraph = new PPIGraph(canvas2d, props.axis, () => graphData);
            ppiGraph.resize(width!, height!, true, true);
        }
    }, [width, height]);

    return (

        <div style={{width: "100%", height: "100%", position: "relative"}} ref={rootDiv}>
            <div style={{position: "absolute", width: "100%", height: "100%"}}>
                {/*<button className="tool-yenile" onClick={() => ppiGraph.resetCanvas()}></button>*/}
                <canvas id="canvas2d" width={width} height={height} ref={canvas2dRef}/>
            </div>
        </div>
    );
}
