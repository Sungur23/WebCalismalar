import './App.css';
import {prepareContext, context} from "./api/Context";
import HeaderScreen from "./gui/main-screen/HeaderScreen";
import ContentScreen from "./gui/main-screen/ContentScreen";
import BottomScreen from "./gui/main-screen/BottomScreen";
import {useCallback, useContext, useEffect, useRef} from "react";
import {Api, TrackModel} from "./api/SimulationAPI";
import {setTracks} from "./gui/grafik/CanvasPanel"

const App: React.FC = () => {

    const onTest = async () => {
        let res: TrackModel[];
        res = (await context.services.api.api.getTracks()).data;
        var numRes = [...res].sort((a, b) => a.id! - b.id!);
        // alert(res[0].id);

        // console.log(numRes);
        setTracks(numRes);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            onTest();
        }, 30);
    }, []);

    return (
        <div className="parent">
            <HeaderScreen/>
            <ContentScreen/>
            <BottomScreen/>
        </div>
    );
}
export default App;