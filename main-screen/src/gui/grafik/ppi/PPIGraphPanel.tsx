import React, {Component, useCallback, useEffect, useRef, useState} from "react";
import {GraphData} from "../../../utils/GraphData";
import PPIGraph from "./PPIGraph";
import {Axis} from "../../../utils/GraphParts";
import {useResizeDetector} from "react-resize-detector";


export default function PPIGraphPanel(props: { axis: Axis }) {
    const canvas2dRef = useRef<HTMLCanvasElement>(null);
    var ppiGraph: PPIGraph;
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
            // alert("Hello + " + width + ":" + height)
            graphData = new GraphData();
            graphData.x = [-30, 15]
            graphData.y = [550, 220]
            ppiGraph = new PPIGraph(canvas2d, props.axis, () => graphData);
            ppiGraph.resize(width!, height!, true, true);
        }
    }, [width, height, canvas2dRef]);


    return (
        <div style={{width: "100%", height: "100%", position: "relative"}} ref={rootDiv}>

            <div style={{position: "absolute", width: "100%", height: "100%"}}>
                <canvas id="canvas2d" width={width} height={height} ref={canvas2dRef}/>
            </div>
        </div>
    );
}
