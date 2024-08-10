import { useState } from 'react';
import './CastWheel.scss';

const CastWheel = ({ aim, power, aimRange, powerRange }) => {

    const aimSectionSize = (90 + aimRange) / (aimRange * 2);
    const aimRotation = (aimSectionSize * aim);

    const powerSectionSize = 1 / powerRange;
    const powerValue = power * powerSectionSize;

    const interpolateColor = (value, startColor, endColor) => {
        const interpolate = (start, end, factor) => start + (end - start) * factor;
        const result = startColor.map((start, i) => Math.round(interpolate(start, endColor[i], value)));
        return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    };

    const startColor = [255, 165, 0]; // Orange
    const endColor = [220, 20, 60];   // Crimson

    const powerColor = interpolateColor(powerValue, startColor, endColor);

    const castWheelStyle = {
        transform: `rotate(${aimRotation}deg)`
    };

    const powerStyle = {
        transform: `scale(${powerValue})`,
        backgroundColor: powerColor
    };

    return (
        <div className="cast-wheel-container">
            <div className="cast-wheel" style={castWheelStyle}>
                <span className="power-gauge" style={powerStyle}></span>
                <span className="aim-direction"></span>
                <span className="detail"></span>
            </div>
        </div>
    );
};

export default CastWheel;
