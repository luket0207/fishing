import { useState, useEffect } from 'react';
import './Start.scss';
import { useGame } from '../../GameContext';
import useGenerateMapRow from '../../gamesetup/MapGeneration/GenerateMapRow';

const Start = ({ setMainScene }) => {
    const [loading, setLoading] = useState(false);
    const { state, dispatch } = useGame();
    const mapRow = useGenerateMapRow(1); // Call the hook here

    const setMap = () => {
        dispatch({ type: 'SET_MAP_ROW_ONE', payload: mapRow });
    };

    const startGame = () => {
        setLoading(true);
        setMap();
        setLoading(false);
        setMainScene('map');
    };

    return (
        <div className="start">
            {!loading && <button onClick={startGame}>Start Game</button>}
            {loading && <p>Loading</p>}
        </div>
    );
};

export default Start;
