import { useState, useEffect } from "react";
import CastControl from "./components/CastControl/CastControl";
import FishingGrid from "./components/FishingGrid/FishingGrid";
import "./FishingArea.scss";
import Hook from "./components/Hook/Hook";
import { useNotification } from "../../gamesetup/Notification/NotificationContext";
import Reel from "./components/Reel/Reel";

const FishingArea = ({ setMainScene, activeGrid, fishArray }) => {
  const [fishingScene, setFishingScene] = useState("cast");
  const size = activeGrid.length;
  const [activeSquareId, setActiveSquareId] = useState(null);
  const [activeBiome, setActiveBiome] = useState("");
  const weather = "rain";
  const showNotification = useNotification();
  const [caughtFish, setCaughtFish] = useState(null);
  const [caughtFishSize, setCaughtFishSize] = useState(0);

  const handleBack = () => {
    setMainScene("map");
  };

  const getActiveBiome = () => {
    const foundSquare = activeGrid.find(
      (square) => square.Id === activeSquareId
    );
    if (foundSquare) {
      setActiveBiome(foundSquare.Biome);
    } else {
      setActiveBiome("");
    }
  };

  useEffect(() => {
    if (activeSquareId !== null) {
      getActiveBiome();
    }
  }, [activeSquareId]);

  const resetCast = () => {
    showNotification("Turn Ended", true);
    setFishingScene("cast");
  };

  return (
    <div className="fishing-area">
      <button onClick={handleBack}>Back</button>

      {fishingScene === "cast" && (
        <div className="fishing-area-grid">
          <FishingGrid
            activeGrid={activeGrid}
            activeSquareId={activeSquareId}
          />
          <CastControl
            size={size}
            activeSquareId={activeSquareId}
            setActiveSquareId={setActiveSquareId}
            setFishingScene={setFishingScene}
            activeBiome={activeBiome}
            getActiveBiome={getActiveBiome}
          />
        </div>
      )}
      {fishingScene === "hook" && (
        <Hook
          activeBiome={activeBiome}
          fishArray={fishArray}
          resetCast={resetCast}
          weather={weather}
          setFishingScene={setFishingScene}
          caughtFish={caughtFish}
          setCaughtFish={setCaughtFish}
          setCaughtFishSize={setCaughtFishSize}
        />
      )}
      {fishingScene === "reel" && (
        <Reel
          caughtFish={caughtFish}
          caughtFishSize={caughtFishSize}
          setFishingScene={setFishingScene}
          resetCast={resetCast}
        />
      )}
      {fishingScene === "catch" && (
        <>
          <p>CATCH!</p>
        </>
      )}
    </div>
  );
};

export default FishingArea;
