import './ContentScreen.css';
import JobManagerScreen from "../job/JobManagerScreen";
import React, {Component} from "react";
import MyMap from "./MapScreen";
import {fromLonLat} from "ol/proj";
import OlMap from "ol/Map";
import OlLayerTile from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import OlView from "ol/View";
import CanvasPanel from "../grafik/PPICanvasPanel";
import PolarGraphPanel from "../grafik/polar/PolarGraphPanel";
import {Axis, AxisVisualType} from "../../utils/GraphParts";
import PPIGraphPanel, {ppiOnClick} from "../grafik/ppi/PPIGraphPanel";


const ContentScreen: React.FC = () => {

    const axis =
        new Axis("Metre",
            "m", "m",
            "#89CFF0", AxisVisualType.POINT, [0, 1000], 50);

    return (
        <div className="content parent">
            <div className="content left-column">
                <div className="content left-column-icon"></div>
                <div className="content left-column-job">
                    <JobManagerScreen/>
                </div>
                <div className="content left-column-skop">
                    <MyMap className="googleMap"/>
                    {/*<CanvasPanel/>*/}
                </div>
            </div>

            <div className="content main-column-a">
                {/*<CanvasPanel/>*/}
                {/*<PolarGraphPanel*/}
                {/*    axis={new Axis("Metre", "m", "m", "#89CFF0", AxisVisualType.POINT, [0, 1000])}/>*/}


                <button className="tool-yenile" onClick={ppiOnClick}></button>
                <div className="content main-column-grafik">
                    <PPIGraphPanel
                        axis={axis}/>
                </div>
                {/*<MyMap className="googleMap"/>*/}
            </div>
        </div>
    );
}

export default ContentScreen;