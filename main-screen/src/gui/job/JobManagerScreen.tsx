import './JobManagerScreen.css';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Segmented} from 'antd';
import {AppstoreOutlined} from '@ant-design/icons';
import {TrackModel} from "../../api/SimulationAPI";
import {context} from "../../api/Context";
import {setTracks} from "../grafik/PPICanvasPanel";

const JobManagerScreen: React.FC = () => {

    const [isDisabled, setModesDisabled] = useState(false);
    const modeValues = ['STNDBY', 'TIMF', 'SAR', 'ISAR'];
    const [value, setValue] = useState(modeValues[0]);

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

    const handleChange = (val: string) => {
        setValue(val);
        //TIMF
        if (val == modeValues[1]) {

            let b = async () =>await context.services.api.api.;

        } else if (val == modeValues[0]) {

        }
    };
    const handleButton = () => {
        setValue(modeValues[0])
        setModesDisabled(!isDisabled);
        // alert(isDisabled);
    };
    const segmentedMenu = (
        <Segmented
            id={'segmented-id'}
            options={modes}
            value={value}
            disabled={isDisabled}
            onChange={(val) => handleChange(val.toString())}
        />
    );

    const onTest = async () => {
        let res: TrackModel[];
        res = (await context.services.api.api.getTracks()).data;
        var numRes = [...res].sort((a, b) => a.id! - b.id!);
        // alert(res[0].id);

        // console.log(numRes);
        setTracks(numRes);
    };
    return (
        <div className="job parent">
            {segmentedMenu}
            <button hidden={true} onClick={handleButton}> T</button>
        </div>
    );
}
export default JobManagerScreen;