import { useState } from 'react';
import './CastWheel.scss';

const CastWheel = ({ aim, power, aimRange, powerRange }) => {

    const aimSectionSize = 180 / (aimRange * 2);
    const aimRotation = (aimSectionSize * aim);

    const powerSectionSize = 1 / powerRange;
    const powerValue = power * powerSectionSize;

    const castWheelStyle = {
        transform: `rotate(${aimRotation}deg)`
    };

    const powerStyle = {
        transform: `scale(${powerValue})`
    };

    return (
        <div className="cast-wheel-container">
            <div className="cast-wheel" style={castWheelStyle}>
                <span className="power-gauge" style={powerStyle}></span>
                <span className="aim-direction"></span>
            </div>
        </div>
    );
};

export default CastWheel;
