import { useState, useEffect } from 'react';
import CastControl from './components/CastControl/CastControl';
import FishingGrid from './components/FishingGrid/FishingGrid';
import './FishingArea.scss';
import Hook from './components/Hook/Hook';

const FishingArea = ({ setMainScene, activeGrid, fishArray }) => {
  const [fishingScene, setFishingScene] = useState('cast');
  const size = activeGrid.length;
  const [activeSquareId, setActiveSquareId] = useState(null);
  const [activeBiome, setActiveBiome] = useState('');

  const handleBack = () => {
    setMainScene('map');
  };

  const getActiveBiome = () => {
    const foundSquare = activeGrid.find(square => square.Id === activeSquareId);
    if (foundSquare) {
      setActiveBiome(foundSquare.Biome);
    } else {
      setActiveBiome('');
    }
  };

  useEffect(() => {
    if (activeSquareId !== null) {
      getActiveBiome();
    }
  }, [activeSquareId]);

  return (
    <div className="fishing-area">
      <button onClick={handleBack}>Back</button>
      <FishingGrid activeGrid={activeGrid} activeSquareId={activeSquareId} />
      {fishingScene === 'cast' && (
        <CastControl
          size={size}
          activeSquareId={activeSquareId}
          setActiveSquareId={setActiveSquareId}
          setFishingScene={setFishingScene}
          activeBiome={activeBiome}
          getActiveBiome={getActiveBiome}
        />
      )}
      {fishingScene === 'hook' && <Hook activeBiome={activeBiome} fishArray={fishArray} />}
      {fishingScene === 'reel' && <></>}
      {fishingScene === 'catch' && <></>}
    </div>
  );
};

export default FishingArea;
