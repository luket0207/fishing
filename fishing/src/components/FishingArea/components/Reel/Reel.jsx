import { useState, useEffect } from "react";
import "./Reel.scss";

const Reel = ({ caughtFish, caughtFishSize, setFishingScene, resetCast }) => {
  const lineStrength = 50;
  const hookStrength = 80;
  const fishSize = caughtFishSize;
  const fishRarity = caughtFish.rarity;

  const generateStrikeSnapChance = (lineStrength, fishSize) => {
    if (fishSize > lineStrength + 10) {
      return 95;
    } else if (fishSize > lineStrength + 5) {
      return 80;
    } else if (fishSize > lineStrength) {
      return 70;
    } else {
      return 60 - (lineStrength - fishSize);
    }
  };

  const generateReelSnapChance = (lineStrength, fishSize) => {
    if (fishSize > lineStrength + 20) {
      return 100;
    } else if (fishSize > lineStrength + 15) {
      return 90;
    } else if (fishSize > lineStrength + 10) {
      return 80;
    } else if (fishSize > lineStrength) {
      return 70;
    } else {
      return 30 - (lineStrength - fishSize);
    }
  };

  const generateTakeBaitChance = (hookStrength, fishRarity) => {
    switch (fishRarity) {
      case "common":
        if (hookStrength < 10) return 50;
        else if (hookStrength < 20) return 20;
        else if (hookStrength < 30) return 10;
        else if (hookStrength < 40) return 5;
        else if (hookStrength < 50) return 4;
        else if (hookStrength < 60) return 3;
        else if (hookStrength < 70) return 2;
        else if (hookStrength < 80) return 1;
        else if (hookStrength < 90) return 0;
        else if (hookStrength > 89) return 0;
        else throw new Error(`Unknown hookStrength in reel: ${hookStrength}`);

      case "uncommon":
        if (hookStrength < 10) return 100;
        else if (hookStrength < 20) return 80;
        else if (hookStrength < 30) return 60;
        else if (hookStrength < 40) return 40;
        else if (hookStrength < 50) return 30;
        else if (hookStrength < 60) return 20;
        else if (hookStrength < 70) return 10;
        else if (hookStrength < 80) return 5;
        else if (hookStrength < 90) return 2;
        else if (hookStrength > 89) return 1;
        else throw new Error(`Unknown hookStrength in reel: ${hookStrength}`);

      case "rare":
        if (hookStrength < 10) return 100;
        else if (hookStrength < 20) return 100;
        else if (hookStrength < 30) return 80;
        else if (hookStrength < 40) return 60;
        else if (hookStrength < 50) return 40;
        else if (hookStrength < 60) return 30;
        else if (hookStrength < 70) return 20;
        else if (hookStrength < 80) return 10;
        else if (hookStrength < 90) return 5;
        else if (hookStrength > 89) return 1;
        else throw new Error(`Unknown hookStrength in reel: ${hookStrength}`);

      case "epic":
        if (hookStrength < 10) return 100;
        else if (hookStrength < 20) return 100;
        else if (hookStrength < 30) return 100;
        else if (hookStrength < 40) return 80;
        else if (hookStrength < 50) return 60;
        else if (hookStrength < 60) return 40;
        else if (hookStrength < 70) return 30;
        else if (hookStrength < 80) return 20;
        else if (hookStrength < 90) return 10;
        else if (hookStrength > 89) return 5;
        else throw new Error(`Unknown hookStrength in reel: ${hookStrength}`);

      case "legendary":
        if (hookStrength < 10) return 100;
        else if (hookStrength < 20) return 100;
        else if (hookStrength < 30) return 100;
        else if (hookStrength < 40) return 100;
        else if (hookStrength < 50) return 80;
        else if (hookStrength < 60) return 60;
        else if (hookStrength < 70) return 40;
        else if (hookStrength < 80) return 30;
        else if (hookStrength < 90) return 20;
        else if (hookStrength > 89) return 10;
        else throw new Error(`Unknown hookStrength in reel: ${hookStrength}`);

      case "mythical":
        if (hookStrength < 10) return 100;
        else if (hookStrength < 20) return 100;
        else if (hookStrength < 30) return 100;
        else if (hookStrength < 40) return 100;
        else if (hookStrength < 50) return 100;
        else if (hookStrength < 60) return 80;
        else if (hookStrength < 70) return 60;
        else if (hookStrength < 80) return 40;
        else if (hookStrength < 90) return 30;
        else if (hookStrength > 89) return 20;
        else throw new Error(`Unknown hookStrength in reel: ${hookStrength}`);

      default:
        throw new Error(`Unknown rarity in reel: ${fishRarity}`);
    }
  };

  function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const generateDistance = (fishRarity) => {
    switch (fishRarity) {
      case "common":
        return getRandomNumber(2, 4);
      case "uncommon":
        return getRandomNumber(2, 5);
      case "rare":
        return getRandomNumber(3, 5);
      case "epic":
        return getRandomNumber(3, 6);
      case "legendary":
        return getRandomNumber(4, 7);
      case "mythical":
        return getRandomNumber(5, 8);
      default:
        throw new Error(`Unknown rarity in reel: ${fishRarity}`);
    }
  };

  const strikeSnapChance = generateStrikeSnapChance(lineStrength, fishSize);
  const reelSnapChance = generateReelSnapChance(lineStrength, fishSize);
  const takeBaitChance = generateTakeBaitChance(hookStrength, fishRarity);
  const [distance, setDistance] = useState(generateDistance(fishRarity));
  const [activeIndex, setActiveIndex] = useState(distance - 1); // Start with initial distance

  const getRandomPercentage = () => Math.random() * 100;

  const handleStrike = () => {
    const snapRoll = getRandomPercentage();
    if (snapRoll <= strikeSnapChance) {
      console.log("Line snapped!");
      resetCast();
      return;
    }

    const baitRoll = getRandomPercentage();
    if (baitRoll <= takeBaitChance) {
      console.log("Bait taken!");
      resetCast();
      return;
    }

    setDistance((prevDistance) => {
      const newDistance = Math.max(prevDistance - 2, 0);
      if (newDistance === 0) {
        console.log("Fish caught!");
        fishIsCaught();
      }
      setActiveIndex(newDistance - 1); // Update active index
      return newDistance;
    });
  };

  const handleReel = () => {
    const snapRoll = getRandomPercentage();
    if (snapRoll <= reelSnapChance) {
      console.log("Line snapped!");
      resetCast();
      return;
    }

    const baitRoll = getRandomPercentage();
    if (baitRoll <= takeBaitChance) {
      console.log("Bait taken!");
      resetCast();
      return;
    }

    setDistance((prevDistance) => {
      const newDistance = Math.max(prevDistance - 1, 0);
      if (newDistance === 0) {
        console.log("Fish caught!");
        fishIsCaught();
      }
      setActiveIndex(newDistance - 1); // Update active index
      return newDistance;
    });
  };

  const fishIsCaught = () => {
    setFishingScene("catch");
  };

  // Calculate position of the red box based on active index
  const rippleStyle = {
    
    top: `${((7 - activeIndex) * 75) + 20}px`, // Adjust for red box height (30px) and grid square height (75px)

  };

  return (
    <div className="reel">
      <div className="reel-display">
        <div className="reel-display-grid">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="grid-square"></div>
          ))}
          <div className="reel-ripple" style={rippleStyle}></div>
          <div className="reel-ripple second" style={rippleStyle}></div>
          <div className="reel-ripple third" style={rippleStyle}></div>
          </div>
      </div>
      <div className="reel-panel">
        <div className="reel-panel-buttons">
          <button className="panel-button" onClick={handleStrike}>
            Strike
          </button>
          <button className="panel-button" onClick={handleReel}>
            Reel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reel;
