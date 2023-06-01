import './ContentScreen.css';
import JobManagerScreen from "../job/JobManagerScreen";
import React, {Component, useRef, useEffect, createRef, ReactElement} from "react";
import MyMap from "./MapScreen";
import {fromLonLat} from "ol/proj";
import OlMap from "ol/Map";
import OlLayerTile from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import OlView from "ol/View";
import CanvasPanel from "../grafik/PPICanvasPanel";
import PolarGraphPanel from "../grafik/polar/PolarGraphPanel";
import {Axis, AxisVisualType} from "../../utils/GraphParts";
import PPIGraphPanel, {ppiOnClick, setZoomMode, setSecMode} from "../grafik/ppi/PPIGraphPanel";
import CartesianGraphPanel from "../grafik/kartezyen/CartesianGraphPanel";
import {numberToGlsl} from "ol/style/expressions";
import {unmountComponentAtNode} from "react-dom";
import ReactDOM from "react-dom/client";

var graphicType = 0;

const axis =
    new Axis("Metre",
        "m", "m",
        "#89CFF0", AxisVisualType.POINT, [0, 1000], 70);

const axis2 =
    new Axis("Metre",
        "m", "m",
        "#89CFF0", AxisVisualType.POINT, [0, 500], 30);


const xAxis = new Axis("Metre",
    "m", "m",
    "#89CFF0", AxisVisualType.POINT, [-70, 70]);

const yAxis = [new Axis("Metre",
    "m", "m",
    "#89CFF0", AxisVisualType.POINT, [0, 900])];


class ContentScreen extends Component<{}, { gt: number, boards: [ReactElement, ReactElement] }> {

    ppiGraph = <PPIGraphPanel axis={axis}/>;
    cartesianGraph = <CartesianGraphPanel xAxis={xAxis} yAxes={yAxis}/>;

    constructor(props: {}) {
        super(props);
        this.state = {gt: 0, boards: [this.ppiGraph, this.cartesianGraph]}
    }

    componentDidMount() {

        // if (graphicType == 0)
        //     this.setState({gt: graphicType, boards: [this.ppiGraph, this.cartesianGraph]})
        // else
        //     this.setState({gt: graphicType, boards: [this.cartesianGraph, this.ppiGraph]})

        this.setState({gt: graphicType})
    }

    changeGraphic = (type: number) => {
        graphicType = type;
        this.setState({gt: graphicType})
        // if (type == 0)
        //     this.setState({gt: graphicType, boards: [this.ppiGraph, this.cartesianGraph]})
        // else
        //     this.setState({gt: graphicType, boards: [this.cartesianGraph, this.ppiGraph]})
    }

    render() {


        // const ppiGraph = <PPIGraphPanel axis={axis}/>;
        // const cartesianGraph = <CartesianGraphPanel xAxis={xAxis} yAxes={yAxis}/>;
        // const ppiGraph2 = <PPIGraphPanel axis={axis2}/>;


        // let graph = this.state.gt == 0 ? ppiGraph : null//cartesianGraph;
        return (
            <div id="content-screen" className="content parent">
                <div className="content left-column">
                    <div className="content left-column-icon"></div>
                    <div className="content left-column-job">
                        <JobManagerScreen changeGraphic={this.changeGraphic}/>
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


                    <div className="content toolbar">
                        <button className=".content tool content tool-yenile" onClick={ppiOnClick}></button>
                        <button className=".content tool content tool-mouse-hand" onClick={setZoomMode}></button>
                        <button className=".content tool content tool-mouse-imlec" onClick={setSecMode}></button>
                    </div>
                    <div className="content main-column-grafik">
                        {this.state.boards[0]}
                        {/*{this.state.boards[1]}*/}
                        {/*{cartesianGraph}*/}
                    </div>
                    {/*<MyMap className="googleMap"/>*/}
                </div>
            </div>
        );
    }

}

export default ContentScreen;