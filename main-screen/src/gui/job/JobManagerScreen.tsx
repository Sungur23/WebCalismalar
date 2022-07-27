import './JobManagerScreen.css';
import React, {useEffect, useState} from 'react';
import {Avatar, Segmented} from 'antd';
import {UserOutlined} from '@ant-design/icons';
import SegmentedPicker from "./SegmentedPicker";

const JobManagerScreen: React.FC = () => {
    const [selection, setSelection] = useState(0);
    const options = ['OFF', 'TIMF', 'SAR', 'ISAR'];

    // const [value, setValue] = useState('2021');
    return (
        <div className="job parent">
            {/*<Segmented options={['Daily', 'Weekly', 'Monthly']} onClick={() => {*/}
            {/*    setValue("2023");*/}
            {/*    alert("TextBox Value is ");*/}
            {/*}}/>;*/}

            <SegmentedPicker
                options={options}
                selection={selection}
                onSelectionChange={(newSelection) => {
                    setSelection(newSelection);
                    alert(newSelection);
                }}
            />

        </div>
    );
}
export default JobManagerScreen;