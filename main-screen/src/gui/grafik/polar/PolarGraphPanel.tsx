import React, {useEffect, useRef} from "react";
import {GraphData} from "../../../utils/GraphData";
import PolarGraph from "./PolarGraph";
import {Axis} from "../../../utils/GraphParts";
import {useResizeDetector} from "react-resize-detector";


export default function PolarGraphPanel(props: { axis: Axis }) {
    const canvas3dRef = useRef<HTMLCanvasElement>(null);
    const canvas2dRef = useRef<HTMLCanvasElement>(null);
    var polarGraph: PolarGraph;
    var graphData: GraphData;


    let {
        height,
        width,
        ref: rootDiv,
    } = useResizeDetector<HTMLDivElement>({
        handleHeight: true, handleWidth: true, refreshMode: "debounce", refreshRate: 200,
    });

    useEffect(() => {
        const canvas3d = canvas3dRef.current;
        const canvas2d = canvas2dRef.current;
        const cleanUpFn = {
            fn: () => {
            }
        };

        if (canvas2d && canvas3d) {
            (async () => {
                graphData = new GraphData();
                graphData.x = [-30, 15]
                graphData.y = [550, 220]
                polarGraph = new PolarGraph(canvas3d, canvas2d, props.axis, () => graphData);
                polarGraph.resize(width!, height!, true, true);
            })();

        }
        return () => cleanUpFn.fn();
    }, [width, height, canvas2dRef, canvas3dRef]);


    return (
        <div style={{width: "100%", height: "100%", position: "relative"}} ref={rootDiv}>
            <div style={{position: "absolute", width: "100%", height: "100%"}}>
                <canvas id="canvas3d" width={width} height={height} ref={canvas3dRef}/>
            </div>
            <div style={{position: "absolute", width: "100%", height: "100%"}}>
                <canvas id="canvas2d" width={width} height={height} ref={canvas2dRef}/>
            </div>
        </div>
    );
}
