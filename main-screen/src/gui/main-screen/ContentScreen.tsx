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
                    {/*<MyMap className="googleMap"/>*/}
                    <CanvasPanel/>
                </div>
            </div>
            <div className="content main-column">
                <div className="content main-column-left">
                    <div className="content main-column-left-ust">
                        <div className="content main-column-left-ust-sol"/>
                        {/*<CanvasPanel className="content main-column-left-ust-sag"/>*/}
                        {/*<div className="content main-column-ust-sag"/>*/}
                    </div>
                    <div className="content main-column-left-alt"/>
                </div>

                <div className="content main-column-right">
                    {/*<CanvasPanel/>*/}
                    <MyMap className="googleMap"/>
                </div>
            </div>
        </div>
    );
}

export default ContentScreen;