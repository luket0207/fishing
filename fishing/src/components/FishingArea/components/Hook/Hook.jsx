import { useState, useEffect } from "react";
import "./Hook.scss";

const Hook = ({ activeBiome, weather }) => {

  const [nibbleChance, setNibbleChance] = useState(0);
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

  //nibble
  const rodCatchModifier = 80;
  const baitCatchModifier = 20;
  const tackleCatchModifer = 20;
  const weatherCatchModifier = calculateWeatherCatchModifier(weather);
  const [biomeCatchModifier, biomeSnagModifier] = calculateBiomeModifiers(activeBiome, weather);

  const calculateNibbleChance = () => {

  }

  useEffect(() => {
    //I need to make the fish speicies list because all of these will be altered by it except for rod and tackle. 
  }, [rodCatchModifier, baitCatchModifier, tackleCatchModifer, weatherCatchModifier, biomeCatchModifier]);

  return (
    <div className="hook">
      <p>Hook</p>
    </div>
  );
};

export default Hook;
