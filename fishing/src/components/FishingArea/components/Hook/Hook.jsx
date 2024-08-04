import { useState, useEffect } from "react";
import "./Hook.scss";
import Snag from "./components/Snag/Snag";
import Float from "./components/Float/Float";

const Hook = ({ activeBiome, fishArray, weather, resetCast }) => {

  const [caughtFish, setCaughtFish] = useState(null);
  const [landCheck, setLandCheck] = useState(false);
 

  const endHook = () => {
    if (caughtFish) {
      console.log("Caught Fish")
    } else {
      resetCast();
    }
  }

  // Move function definitions to the top
  const calculateWeatherCatchModifier = (weather) => {
    return 10;
  };

  const calculateBiomeModifiers = (activeBiome, weather) => {
    switch (activeBiome) {
      case "normal":
        return [0, 0];
      case "shallow":
        return [0, 60];
      case "deep":
        return [5, 60];
      case "reeds":
        return [20, 20];
      case "swamp":
        return [40, 30];
      case "land":
        return [0, 60];
      default:
        throw new Error(`Unknown biome: ${activeBiome}`);
    }
  };

  //catch

  const weatherCatchModifier = calculateWeatherCatchModifier(weather);

  //more than one
  const [biomeCatchModifier, biomeSnagModifier] = calculateBiomeModifiers(activeBiome, weather);

  const startHookSequence = (fishArray) => {
   //working
  }


  useEffect(() => {
    if (activeBiome === "land") {
      setLandCheck(true);
    } else {
      startHookSequence(fishArray);
    }
  }, []);

  return (
    <div className="hook">
      <p>Hook</p>
      {landCheck && <Snag biomeSnagModifier={biomeSnagModifier} endHook={endHook}/> }
      {!landCheck && <Float fishArray={fishArray} activeBiome={activeBiome} weather={weather} />}
    </div>
  );
};

export default Hook;
