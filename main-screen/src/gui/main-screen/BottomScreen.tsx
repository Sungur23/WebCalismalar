import './BottomScreen.css';
import {useEffect, useState} from "react";

const BottomScreen: React.FC = () => {

    const [dateState, setDateState] = useState(new Date());
    useEffect(() => {
        setInterval(() => setDateState(new Date()), 1000);
    }, []);


    const date = dateState.toLocaleDateString("tr-TR");
    const time = dateState.toLocaleTimeString("tr-TR");

    return (
        <div className="bottom parent">
            <div className="bottom left-column"/>
            <div className="bottom content-column"></div>
            <div className="bottom center-column"/>
            <div className="bottom right-column"/>
            <div className="bottom time-column">
                {time}<br/>{date}
            </div>
        </div>
    );
}
export default BottomScreen;