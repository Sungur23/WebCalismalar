import './ContentScreen.css';
import JobManagerScreen from "../job/JobManagerScreen";
import React from "react";
import MyMap from "./MapScreen";

const ContentScreen: React.FC = () => {

    return (
        <div className="content parent">
            <div className="content left-column">
                <div className="content left-column-icon"></div>
                <div className="content left-column-job">
                    <JobManagerScreen/>
                </div>
                <div className="content left-column-skop"/>
                <div className="content left-bottom-map">
                    <MyMap className="googleMap"/>
                </div>
            </div>
            <div className="content main-column">
                <div className="content main-column-ust">
                    <div className="content main-column-ust-sol"/>
                    <div className="content main-column-ust-sag"/>
                </div>
                <div className="content main-column-alt"/>
            </div>
        </div>
    );
}
export default ContentScreen;