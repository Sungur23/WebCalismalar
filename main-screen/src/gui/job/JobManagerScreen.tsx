import './JobManagerScreen.css';
import React, {Component, useCallback, useEffect, useRef, useState} from 'react';
import {Segmented} from 'antd';
import {AppstoreOutlined} from '@ant-design/icons';
import {PPILineModel, TrackModel} from "../../api/SimulationAPI";
import {context} from "../../api/Context";
import {setTracks, setPPILineVideo, drawRadarVideo, cleanRadarVideo} from "../grafik/ppi/PPIGraphPanel";

const modeValues = ['STNDBY', 'TIMF', 'SAR', 'ISAR'];

const modes = [
    {
        label: <div style={{color: "darkblue"}}>STNDBY</div>,
        value: modeValues[0],
        // icon: <BarsOutlined/>,
    },
    {
        label: 'TIMF',
        value: modeValues[1],
        icon: <AppstoreOutlined/>,
    },
    {
        label: 'SAR',
        value: modeValues[2],
        icon: <AppstoreOutlined/>,
    },
    {
        label: 'ISAR',
        value: modeValues[3],
        icon: <AppstoreOutlined/>,
    },];

class JobManagerScreen extends Component<{ changeGraphic: (number: number) => void }, {
    value: string,
    interval: any,
    videoInterval: any,
    isDisabled: boolean,
    lineID: number
}> {

    constructor(props: { changeGraphic: (number: number) => void }) {
        super(props);
        this.state = {
            value: modeValues[0],
            interval: undefined,
            videoInterval: undefined,
            isDisabled: false,
            lineID: 0
        }
    }

    handleChange = (val: string) => {
        this.setState({value: val});
        //TIMF
        if (val == modeValues[0]) {
            // contentScreen.changeGraphic(0);
            this.props.changeGraphic(0);
            clearInterval(this.state.interval);
            clearInterval(this.state.videoInterval);
            this.setSimStatus(false);
            setTracks([]);

            setTimeout(() => {
                cleanRadarVideo()
            }, 200)
        } else if (val == modeValues[1]) {

            // contentScreen.changeGraphic(0);
            this.props.changeGraphic(0);
            this.setSimStatus(true);


            this.setState({
                interval: setInterval(() => {
                    this.onTest();
                }, 30)
            });

            this.setState({
                videoInterval: setInterval(() => {
                    this.onVideo();
                }, 5)
            });

        } else {
            // contentScreen.changeGraphic(1);
            this.props.changeGraphic(1);
            clearInterval(this.state.interval);
            clearInterval(this.state.videoInterval);
            this.setSimStatus(false);
            setTracks([]);

            setTimeout(() => {
                cleanRadarVideo()
            }, 200)
        }
    };

    // segmentedMenu = (
    //     <Segmented
    //         id={'segmented-id'}
    //         options={modes}
    //         value={this.state.value}
    //         disabled={this.state.isDisabled}
    //         onChange={(val) => this.handleChange(val.toString())}
    //     />
    // );

    handleButton = () => {
        this.setState({value: modeValues[0]});
        this.setState({isDisabled: !this.state.isDisabled});
        // alert(isDisabled);
    };

    onTest = async () => {
        let res: TrackModel[];
        res = (await context.services.api.api.getTracks()).data;
        var numRes = [...res].sort((a, b) => a.id! - b.id!);
        // alert(res[0].id);

        // console.log(numRes);
        setTracks(numRes);
    };

    onVideo = async () => {

        if (this.state.lineID < 140)
            this.setState({lineID: this.state.lineID + 1});
        else {
            this.setState({lineID: 0});
            // this.drawVideo();
        }
        this.setVideo(this.state.lineID)
    };
    setSimStatus = async (state: boolean) => {
        let res = await context.services.api.api.setSimulationState(state);

    };

    setVideo = async (id: number) => {
        let line: PPILineModel;
        line = (await context.services.api.api.getPpiLine(id)).data;
        setPPILineVideo(line);
    };

    drawVideo = async () => {
        await drawRadarVideo()
    };

    render() {
        return (
            <div className="job parent">
                <Segmented
                    id={'segmented-id'}
                    options={modes}
                    value={this.state.value}
                    disabled={this.state.isDisabled}
                    onChange={(val) => this.handleChange(val.toString())}
                />
                <button hidden={true} onClick={this.handleButton}> T</button>
            </div>
        );
    }
}

export default JobManagerScreen;