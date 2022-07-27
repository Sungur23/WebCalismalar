import './ContentScreen.css';
import JobManagerScreen from "../job/JobManagerScreen";


const ContentScreen: React.FC = () => {
    return (
        <div className="content parent">
            <div className="content left-column">
                <JobManagerScreen/>
            </div>
            <div className="content main-column"></div>
        </div>
    );
}
export default ContentScreen;