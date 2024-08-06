import { useState, useEffect } from "react";
import "./Hook.scss";
import Snag from "./components/Snag/Snag";
import Float from "./components/Float/Float";

const Hook = ({
  activeBiome,
  fishArray,
  weather,
  resetCast,
  setCaughtFishSize,
  setCaughtFish,
  setFishingScene,
}) => {
  const [snagCheck, setSnagCheck] = useState(false);

  const calculateBiomeModifiers = (activeBiome, weather) => {
    switch (activeBiome) {
      case "normal":
        const no = weather === "clear" ? 10 : 0;
        return [no, 0];
      case "shallow":
        const sh = weather === "sunny" ? 15 : 5;
        return [sh, 5];
      case "deep":
        const de = weather === "cloudy" ? 15 : 5;
        return [de, 5];
      case "reeds":
        const re = weather === "rain" ? 30 : 20;
        return [re, 40];
      case "swamp":
        const sw = weather === "thunder" ? 60 : 40;
        return [sw, 60];
      case "land":
        return [0, 100];
      default:
        throw new Error(`Unknown biome: ${activeBiome}`);
    }
  };

  const [biomeCatchModifier, biomeSnagModifier] = calculateBiomeModifiers(
    activeBiome,
    weather
  );

  function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const endHook = (fish = null) => {
    console.log(fish);
    if (fish) {
      console.log("Hook caught");
      setFishingScene("reel");
    } else {
      const snagChance = getRandomNumber(0, 100);
      if (snagChance < biomeSnagModifier) {
        setSnagCheck(true);
        console.log("Snagged");
      } else {
        setSnagCheck(false);
        console.log("Hook miss");
        resetCast();
      }
    }
  };

  const endSnag = () => {
    setSnagCheck(false);
    console.log("Snag End");
    resetCast();
  };

  useEffect(() => {
    if (activeBiome === "land") {
      setSnagCheck(true);
    } else {
      setSnagCheck(false);
    }
  }, []);

  return (
    <div className="hook">
      {snagCheck && (
        <Snag
          biomeSnagModifier={biomeSnagModifier}
          setCaughtFish={setCaughtFish}
          endSnag={endSnag}
        />
      )}
      {!snagCheck && (
        <Float
          fishArray={fishArray}
          activeBiome={activeBiome}
          weather={weather}
          setCaughtFish={setCaughtFish}
          setCaughtFishSize={setCaughtFishSize}
          biomeCatchModifier={biomeCatchModifier}
          biomeSnagModifier={biomeSnagModifier}
          endHook={endHook}
        />
      )}
    </div>
  );
};

export default Hook;
