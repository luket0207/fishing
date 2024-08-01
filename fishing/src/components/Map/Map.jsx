import React, { useState } from 'react';
import { useGame } from '../../GameContext';
import Fish from '../Fish/Fish';
import './Map.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerVertical, faSpa, faSeedling, faMountain } from '@fortawesome/free-solid-svg-icons';

const Map = ({ setMainScene, setActiveGrid, setFishArray }) => {
    const { state } = useGame(); 
    const [currentRowIndex, setCurrentRowIndex] = useState(0);

    const rows = [1, 2, 3, 4, 5, 6];

    const handleLocationClick = (grid, fish) => {
        setActiveGrid(grid);
        setFishArray(fish);
        setMainScene('fishingArea');
    };

    const getBiomes = (biomeArray) => {
        const biomeNames = ['shallow', 'reeds', 'deep', 'swamp', 'land'];
        const biomeIcons = [faRulerVertical, faSeedling, faRulerVertical, faSpa, faMountain];
        return biomeArray
            .map((value, index) => value !== 0 ? (
                <div className={`biome biome-${biomeNames[index]}`} key={index}>
                    <FontAwesomeIcon icon={biomeIcons[index]} />
                </div>
            ) : null)
            .filter(Boolean);
    };

    const handlePrevRow = () => {
        setCurrentRowIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    const handleNextRow = () => {
        setCurrentRowIndex(prevIndex => Math.min(prevIndex + 1, rows.length - 1));
    };

    return (
        <div className='map-carousel'>
            <button className='carousel-button prev' onClick={handlePrevRow} disabled={currentRowIndex === 0}>
                &lt;
            </button>

            <div className='map'>
                <div className={`map-row map-row${rows[currentRowIndex]}`}>
                    {state[`mapRow${rows[currentRowIndex]}`].map((location) => (
                        <div 
                            key={location.id} 
                            className={`map-row-item map-row${rows[currentRowIndex]}-item ${location.locked ? 'locked' : ''}`} 
                            onClick={() => handleLocationClick(location.grid, location.fishArray)}
                        >
                            <div className='map-row-item-top'>
                                <p className='map-row-item-top-title'>{location.name}</p>
                            </div>
                            
                            <div className='map-row-item-biomes'>
                                {getBiomes(location.biomeArray).length === 0 ? 'None' : getBiomes(location.biomeArray)}
                            </div>
                            <p className='map-row-item-cost'>{location.cost}</p>
                            <div className='map-row-item-fish'>
                                {location.fishArray.map((fish) => (
                                    <div key={fish.id} className='fish-container'>
                                        <Fish id={fish.id} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className='carousel-button next' onClick={handleNextRow} disabled={currentRowIndex === rows.length - 1}>
                &gt;
            </button>
        </div>
    );
};

export default Map;
