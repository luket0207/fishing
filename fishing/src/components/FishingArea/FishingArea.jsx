import { useState } from 'react';
import CastControl from './components/CastControl/CastControl';
import FishingGrid from './components/FishingGrid/FishingGrid';
import './FishingArea.scss';

const FishingArea = ({  }) => {
    const [biomeArray, setBiomeArray] = useState([5,1,10,5,0])
    const [fishingScene, setFishingScene] = useState('cast');
    const gridWidth = 37;
    const size = gridWidth * gridWidth;
    const [activeSquareId, setActiveSquareId] = useState(null);

  return (
    <div className="fishing-area">
      <FishingGrid size={size} activeSquareId={activeSquareId} biomeArray={biomeArray} />
      {fishingScene === 'cast' && <CastControl size={size} activeSquareId={activeSquareId} setActiveSquareId={setActiveSquareId} setFishingScene={setFishingScene} />}
      {fishingScene === 'hook' && <></>}
      {fishingScene === 'reel' && <></>}
      {fishingScene === 'catch' && <></>}
    </div>
  );
};

export default FishingArea;
