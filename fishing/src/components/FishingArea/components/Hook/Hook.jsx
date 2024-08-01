import { useState, useEffect } from "react";
import "./Hook.scss";

const Hook = ({ activeBiome, fishArray, weather }) => {

  const [nibblingFish, setNibblingFish] = useState("");
  const [landCheck, setLandCheck] = useState(false);
  const rodStrikeModifier = 80;
  const hookStrikeModifier = 60;
  const lineStrikeModifier = 0;
  const rodSnagModifier = 50;
  const lineSnagModifier = 50;
  

  // Move function definitions to the top
  const calculateWeatherCatchModifier = (weather) => {
    return 10;
  };

  const calculateBiomeModifiers = (activeBiome, weather) => {
    switch (activeBiome) {
      case "normal":
        return [0, 0];
      case "shallow":
        return [0, 5];
      case "deep":
        return [5, 5];
      case "reeds":
        return [20, 40];
      case "swamp":
        return [40, 80];
      case "land":
        return [0, 0];
      default:
        throw new Error(`Unknown biome: ${activeBiome}`);
    }
  };

  //catch
  const rodCatchModifier = 80;
  const baitCatchModifier = 20;
  const tackleCatchModifer = 20;
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
      {landCheck && <p>Land</p>}
      {!landCheck && <p>Not Land</p>}
    </div>
  );
};

export default Hook;
