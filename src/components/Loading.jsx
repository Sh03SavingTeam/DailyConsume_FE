import React from 'react';
import CustomSpinner from '../assets/spinner.gif';

function Loading(props) {
    return (
        <div className="loading_div">
            <img src= {CustomSpinner} alt='로딩 이미지'/>
        </div>
    );
}

export default Loading;