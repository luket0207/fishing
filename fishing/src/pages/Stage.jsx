import React, { useState } from 'react';
import GameComponent from '../GameComponent';
import FishingArea from '../components/FishingArea/FishingArea';
import Map from '../components/Map/Map';
import './Stage.scss';
import Start from './Start/Start';

const Stage = () => {

  const [mainScene, setMainScene] = useState('start');

  return (
    <div className="stage">
      {mainScene === 'start' && <Start setMainScene={setMainScene}/>}
      {mainScene === 'map' && <Map />}
      {mainScene === 'fishingArea' && <FishingArea />}
    </div>
  );
}

export default Stage;
