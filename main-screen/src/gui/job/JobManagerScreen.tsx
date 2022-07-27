import './JobManagerScreen.css';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Segmented} from 'antd';
import {AppstoreOutlined} from '@ant-design/icons';

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
        setValue(val)
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

    return (
        <div className="job parent">
            {segmentedMenu}
            <button hidden={true} onClick={handleButton}> T</button>
        </div>
    );
}
export default JobManagerScreen;