import './HeaderScreen.css';
import aselsan_logo from "../../img/aselsan_logo_1.png"


const HeaderScreen: React.FC = () => {
    return (
        <div className="header header">
            <div className="header logo-column">
                <img src={aselsan_logo} className="header logo"/>
            </div>
            <div className="header text-column">
                AKINCI KGÜ
            </div>
        </div>
    );
}
export default HeaderScreen;