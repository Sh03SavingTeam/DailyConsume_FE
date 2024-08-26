import React from 'react';
import CustomSpinner from '../assets/spinner2.gif';
import RobotGif from "../assets/robot2.gif"

function Loading(props) {
    return (
        <div className="loading_div">
            <img src= {RobotGif} alt='로딩 이미지'/>
        </div>
    );
}

export default Loading;