import './App.css';
import HeaderScreen from "./gui/main-screen/HeaderScreen";
import ContentScreen from "./gui/main-screen/ContentScreen";
import BottomScreen from "./gui/main-screen/BottomScreen";


const App: React.FC = () => {
    return (
        <div className="parent">
            <HeaderScreen/>
            <ContentScreen/>
            <BottomScreen/>
        </div>
    );
}
export default App;