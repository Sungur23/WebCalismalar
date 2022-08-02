import React, {useState} from 'react';
import {Menu, MenuTheme, Switch} from "antd";

const items = [
    {label: 'A', key: 'A'},
    {label: 'B', key: 'B'},
    {
        label: 'C',
        key: 'C',
        children: [{label: 'D', key: 'D'}],
    },
];

const SolMenu = () => {
    const [theme, setTheme] = useState<MenuTheme>('dark');
    const [current, setCurrent] = useState('1');

    const changeTheme = (value: any) => {
        setTheme(value ? 'dark' : 'light');
    };

    const onClick = (e: { key: React.SetStateAction<string>; }) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <>
            {/*<Switch*/}
            {/*    checked={theme === 'dark'}*/}
            {/*    onChange={changeTheme}*/}
            {/*    checkedChildren="Koyu"*/}
            {/*    // unCheckedChildren={<CheckOutlined/>}*/}
            {/*    unCheckedChildren="Açık"*/}
            {/*/>*/}
            <Menu
                theme={theme}
                onClick={onClick}
                defaultOpenKeys={['sub1']}
                selectedKeys={[current]}
                mode="inline"
                items={items}
            />
        </>
    );
};

export default SolMenu;