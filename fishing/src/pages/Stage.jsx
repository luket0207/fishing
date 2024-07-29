import React, { useState } from 'react';
import GameComponent from '../GameComponent';
import FishingArea from '../components/FishingArea/FishingArea';
import Map from '../components/Map/Map';
import './Stage.scss';
import Start from './Start/Start';

const Stage = () => {

  const [mainScene, setMainScene] = useState('start');
  const [activeGrid, setActiveGrid] = useState([]);
  const [activeFishArray, setActiveFishArray] = useState([]);

  return (
    <div className="stage">
      {mainScene === 'start' && <Start setMainScene={setMainScene}/>}
      {mainScene === 'map' && <Map setMainScene={setMainScene} setActiveGrid={setActiveGrid}/>}
      {mainScene === 'fishingArea' && <FishingArea setMainScene={setMainScene} activeGrid={activeGrid} />}
    </div>
  );
}

export default Stage;
