import React, { useState, useEffect } from "react";
import { useNotification } from "../../../../../../gamesetup/Notification/NotificationContext";
import "./Float.scss";
import Display from "./Display";

const Float = ({ fishArray, activeBiome, weather }) => {
  // Constants related to fishing gear and modifiers
  const rodCatchModifier = 80;
  const activeBait = "worm";
  const tackleCatchModifier = 20;
  const showNotification = useNotification();

  const [nibblingFishWeight, setNibblingFishWeight] = useState(0);
  const [floatState, setFloatState] = useState("rest");
  const [timer, setTimer] = useState(null); // For controlling the timer

  // Function to generate a random number between 0 and max (exclusive)
  const RandomNumber = (max) => Math.floor(Math.random() * max);

  // Base bite chances based on fish rarity
  const baseBiteChance = {
    common: 60,
    uncommon: 50,
    rare: 40,
    epic: 30,
    legendary: 10,
    mythical: 5,
  };

  // Function to simulate a nibble event
  const generateNibble = () => {
    let nibbleChance = 0; // Total nibble chance accumulator
    let maxChance = fishArray.length * 80 + 200; // Maximum possible value for random number generation
    const fishNibbleChances = []; // Store nibble chances for each fish

    fishArray.forEach((fish) => {
      let fishBiteChance = baseBiteChance[fish.rarity.toLowerCase()] || 0;

      // Increase bite chance based on liked conditions
      if (fish.likesBait.toLowerCase() === activeBait.toLowerCase()) {
        fishBiteChance += 20; // Add bonus for liked bait
      }
      if (fish.likesBiome.toLowerCase() === activeBiome.toLowerCase()) {
        fishBiteChance += 10; // Add bonus for liked biome
      }
      if (fish.likesWeather.toLowerCase() === weather.toLowerCase()) {
        fishBiteChance += 10; // Add bonus for liked weather
      }

      // Adjust bite chance for disliked conditions
      if (fish.dislikesBait.toLowerCase() === activeBait.toLowerCase()) {
        fishBiteChance = 0; // No chance to nibble if bait is disliked
      } else {
        if (fish.dislikesBiome.toLowerCase() === activeBiome.toLowerCase()) {
          fishBiteChance = Math.round(fishBiteChance / 1.5); // Reduce chance if biome is disliked
        }
        if (fish.dislikesWeather.toLowerCase() === weather.toLowerCase()) {
          fishBiteChance = Math.round(fishBiteChance / 1.5); // Reduce chance if weather is disliked
        }
      }

      // Log the nibble chance for each fish
      console.log(
        `Fish: ${fish.name}, Base Bite Chance: ${
          baseBiteChance[fish.rarity.toLowerCase()] || 0
        }, Final Bite Chance: ${fishBiteChance}`
      );

      fishNibbleChances.push(fishBiteChance); // Store individual fish nibble chance
      nibbleChance += fishBiteChance; // Accumulate total nibble chance
    });

    // Add rod and tackle modifiers to the total nibble chance
    nibbleChance += rodCatchModifier + tackleCatchModifier;

    // Generate a random number to determine if a nibble occurs
    const randomNumber = RandomNumber(maxChance);
    console.log(
      `nibbleChance: ${nibbleChance}, maxChance: ${maxChance}, randomNumber: ${randomNumber}`
    );
    console.log(fishArray);

    if (randomNumber < nibbleChance) {
      console.log("Successful nibble!");

      // Determine which fish is nibbling
      const totalNibbleChances = fishNibbleChances.reduce(
        (acc, chance) => acc + chance,
        0
      );
      const randomNibble = RandomNumber(totalNibbleChances);
      console.log(`Random number for fish selection: ${randomNibble}`);

      let accumulatedChance = 0;
      let selectedFish = null;

      // Iterate through fish to determine which one is nibbling
      for (let i = 0; i < fishNibbleChances.length; i++) {
        accumulatedChance += fishNibbleChances[i];
        if (randomNibble < accumulatedChance) {
          selectedFish = fishArray[i];
          console.log(`Fish nibbling: ${selectedFish.name}`);
          break;
        }
      }

      // Generate and log the weight of the selected fish
      if (selectedFish) {
        const fishWeight = generateFishWeight(selectedFish);
        setNibblingFishWeight(fishWeight);
        const timeline = generateNibbleTimeline();
        startTimer(timeline);
        console.log(`Fish weight: ${fishWeight.toFixed(2)}`);
      }
    } else {
      showNotification("No Nibble", false);
      console.log("No nibble."); // No nibble if random number exceeds nibble chance
    }
  };

  // Function to generate a fish's weight based on its size range and conditions
  const generateFishWeight = (fish) => {
    const minSize = parseFloat(fish.minSize);
    const maxSize = parseFloat(fish.maxSize);
    const sizeRange = maxSize - minSize;

    // Generate a size factor with a high bias towards smaller sizes
    const exponent = 3; // Adjust this value to increase/decrease bias
    let sizeFactor = Math.pow(Math.random(), exponent);
    let size = minSize + sizeFactor * sizeRange;

    // Increase the likelihood of larger sizes if conditions are favorable
    let adjustmentFactor = 1;

    if (fish.likesBait.toLowerCase() === activeBait.toLowerCase()) {
      adjustmentFactor += 0.2; // Increase by 20%
    }

    if (fish.likesBiome.toLowerCase() === activeBiome.toLowerCase()) {
      adjustmentFactor += 0.1; // Increase by 10%
    }

    if (fish.likesWeather.toLowerCase() === weather.toLowerCase()) {
      adjustmentFactor += 0.1; // Increase by 10%
    }

    size = minSize + adjustmentFactor * (size - minSize);

    // Ensure size is within the min and max size bounds
    size = Math.max(minSize, Math.min(maxSize, size));

    return size;
  };

  const generateRandomValue = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateNibbleTimeline = () => {
    const waitDuration = generateRandomValue(4, 10); // Random number between 3 and 10 (inclusive)
    const fakeMove = Math.random() < 0.5; // 50% chance of true or false
    const fakeMoveDuration = generateRandomValue(2, 4); // Random number between 1 and 3 (inclusive)
    const fakeMoveExtraWait = generateRandomValue(4, 8); // Random number between 3 and 6 (inclusive)
    const fakeMoveTwo = Math.random() < 0.5; // 50% chance of true or false
    const fakeMoveTwoDuration = generateRandomValue(2, 4); // Random number between 1 and 3 (inclusive)
    const fakeMoveTwoExtraWait = generateRandomValue(4, 8); // Random number between 3 and 6 (inclusive)
    const teaseDuration = generateRandomValue(2, 4); // Random number between 1 and 3 (inclusive)
    const nibbleDuration = 3; 

    // Logging or returning the generated values
    console.log({
      waitDuration,
      fakeMove,
      fakeMoveDuration,
      fakeMoveExtraWait,
      fakeMoveTwo,
      fakeMoveTwoDuration,
      fakeMoveTwoExtraWait,
      teaseDuration,
      nibbleDuration,
    });

    return {
      waitDuration,
      fakeMove,
      fakeMoveDuration,
      fakeMoveExtraWait,
      fakeMoveTwo,
      fakeMoveTwoDuration,
      fakeMoveTwoExtraWait,
      teaseDuration,
      nibbleDuration,
    };
  };

  const startTimer = ({
    waitDuration,
    fakeMove,
    fakeMoveDuration,
    fakeMoveExtraWait,
    fakeMoveTwo,
    fakeMoveTwoDuration,
    fakeMoveTwoExtraWait,
    teaseDuration,
    nibbleDuration,
  }) => {
    let totalDuration = waitDuration;
    setFloatState("rest");

    if (timer) {
      clearTimeout(timer); // Clear any existing timer
    }

    const updateState = (newState, delay) => {
      setTimeout(() => setFloatState(newState), delay * 1000);
    };

    // Initial rest period
    updateState("rest", waitDuration);
    totalDuration += waitDuration;

    // Handle first fake move if applicable
    if (fakeMove) {
      setTimeout(() => {
        setFloatState("fake");
        setTimeout(() => {
          setFloatState("rest");
          totalDuration += fakeMoveDuration + fakeMoveExtraWait;

          // Handle second fake move if applicable
          if (fakeMoveTwo) {
            setTimeout(() => {
              setFloatState("fake");
              setTimeout(() => {
                setFloatState("rest");
                totalDuration += fakeMoveTwoDuration + fakeMoveTwoExtraWait;

                // Proceed to tease and nibble phases
                setTimeout(() => {
                  setFloatState("tease");
                  setTimeout(() => {
                    setFloatState("nibble");
                    setTimeout(() => {
                      setFloatState("rest");
                      setTimeout(() => {
                        setFloatState("missed");
                      }, (waitDuration / 2) * 1000);
                    }, nibbleDuration * 1000);
                  }, teaseDuration * 1000);
                }, fakeMoveTwoExtraWait * 1000);
              }, fakeMoveTwoDuration * 1000);
            }, fakeMoveExtraWait * 1000);
          } else {
            // If no second fake move, proceed to tease and nibble
            setTimeout(() => {
              setFloatState("tease");
              setTimeout(() => {
                setFloatState("nibble");
                setTimeout(() => {
                  setFloatState("rest");
                  setTimeout(() => {
                    setFloatState("missed");
                  }, (waitDuration / 2) * 1000);
                }, nibbleDuration * 1000);
              }, teaseDuration * 1000);
            }, fakeMoveExtraWait * 1000);
          }
        }, fakeMoveDuration * 1000);
      }, waitDuration * 1000);
    } else if (fakeMoveTwo) {
      // Handle second fake move independently if first is not present
      setTimeout(() => {
        setFloatState("fake");
        setTimeout(() => {
          setFloatState("rest");
          totalDuration += fakeMoveTwoDuration + fakeMoveTwoExtraWait;

          // Proceed to tease and nibble phases
          setTimeout(() => {
            setFloatState("tease");
            setTimeout(() => {
              setFloatState("nibble");
              setTimeout(() => {
                setFloatState("rest");
                setTimeout(() => {
                  setFloatState("missed");
                }, (waitDuration / 2) * 1000);
              }, nibbleDuration * 1000);
            }, teaseDuration * 1000);
          }, fakeMoveTwoExtraWait * 1000);
        }, fakeMoveTwoDuration * 1000);
      }, waitDuration * 1000);
    } else {
      // If neither fakeMove nor fakeMoveTwo is present, proceed directly to tease and nibble
      setTimeout(() => {
        setFloatState("tease");
        setTimeout(() => {
          setFloatState("nibble");
          setTimeout(() => {
            setFloatState("rest");
            setTimeout(() => {
              setFloatState("missed");
            }, (waitDuration / 2) * 1000);
          }, nibbleDuration * 1000);
        }, teaseDuration * 1000);
      }, waitDuration * 1000);
    }
  };

  useEffect(() => {
    // Cleanup timer if component unmounts
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return (
    <div className="hook-float">
      <div className="hook-float-display">
        <button onClick={generateNibble}>Check Nibble</button>
        <div className="float-state-display">
          <p>Float State: {floatState}</p>
          <Display state={floatState} size={nibblingFishWeight} />
        </div>
      </div>
    </div>
  );
};

export default Float;
