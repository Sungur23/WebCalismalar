import {Line} from '@ant-design/charts';
import {Button} from "antd";
import './ButonTest.css';


const ButonTest: React.FC = () => {

    const gr = CanvasRenderingContext2D;


    const myData = [
        {x: 0, y: 0},
        {x: 1, y: 2},
        {x: 2, y: 4},
        {x: 3, y: 11},
        {x: 4, y: 9},
        {x: 5, y: 14},
        {x: 6, y: 19},
        {x: 7, y: 17}
    ];

    return (
        <>
            <Button type="primary">PRESS ME</Button>
            <Line
                data={myData}
                height={200}
                xField="x"
                yField="y"
                point={{size: 2, shape: 'diamon'}}
                color='blue'
            />
        </>

    );
}
export default ButonTest;
