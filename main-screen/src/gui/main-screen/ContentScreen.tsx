import './ContentScreen.css';
import JobManagerScreen from "../job/JobManagerScreen";
import React, {Component} from "react";
import MyMap from "./MapScreen";
import {fromLonLat} from "ol/proj";
import OlMap from "ol/Map";
import OlLayerTile from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import OlView from "ol/View";
import CanvasPanel from "../grafik/CanvasPanel";


const ContentScreen: React.FC = () => {


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
                <CanvasPanel className="content main-column"/>
                {/*<MyMap className="googleMap"/>*/}
            </div>
        </div>
    );
}

export default ContentScreen;