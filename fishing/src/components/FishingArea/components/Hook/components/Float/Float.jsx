import React, { useState, useEffect } from "react";
import { useNotification } from "../../../../../../gamesetup/Notification/NotificationContext";
import "./Float.scss";
import Display from "./Display";

const Float = ({
  fishArray,
  activeBiome,
  weather,
  setCaughtFish,
  setCaughtFishSize,
  biomeCatchModifier,
  endHook,
}) => {
  // Constants related to fishing gear and modifiers
  const rodCatchModifier = 80;
  const activeBait = "worm";
  const tackleCatchModifier = 20;
  const showNotification = useNotification();

  const [nibblingFish, setNibblingFish] = useState(null);
  const [nibblingFishWeight, setNibblingFishWeight] = useState(0);
  const [floatState, setFloatState] = useState("rest");
  const [timer, setTimer] = useState(null);
  const [rodRested, setRodRested] = useState(false);

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
    nibbleChance += rodCatchModifier + tackleCatchModifier + biomeCatchModifier;

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

      if (selectedFish) {
        const fishWeight = generateFishWeight(selectedFish);
        setNibblingFish(selectedFish);
        setNibblingFishWeight(fishWeight.toFixed(2));
        const timeline = generateNibbleTimeline(true, selectedFish.rarity);
        startTimer(timeline);
        console.log(`Fish weight: ${fishWeight.toFixed(2)}`);
      }
    } else {
      console.log("No Nibble");
      const fishWeight = generateFishWeight(fishArray[0]);
      setNibblingFishWeight(fishWeight.toFixed(2));
      showNotification("No Nibble", false);
      const timeline = generateNibbleTimeline(false);
      startTimer(timeline);
    }
  };

  // Function to generate a fish's weight based on its size range and conditions
  const generateFishWeight = (fish) => {
    const minSize = parseFloat(fish.minSize);
    const maxSize = parseFloat(fish.maxSize);
    const recordCatch = parseFloat(fish.recordCatch);
    const sizeRange = maxSize - minSize;
    const adjustedRecordSize = Math.min(recordCatch, maxSize);
    const halfMiddle = minSize + (adjustedRecordSize - minSize) / 2;

    let size;

    // Determine the range based on a random number
    const randomValue = Math.random();

    if (randomValue < 0.6) {
      // 60% chance: Less than half of the middle of the range
      size = minSize + Math.random() * (halfMiddle - minSize);
    } else if (randomValue < 0.99) {
      // 39% chance: Between half of the middle and the record size
      size = halfMiddle + Math.random() * (adjustedRecordSize - halfMiddle);
    } else {
      // 1% chance: Above the record size if record size < max size
      if (adjustedRecordSize < maxSize) {
        size =
          adjustedRecordSize + Math.random() * (maxSize - adjustedRecordSize);
      } else {
        // Fallback if record size equals max size
        size = adjustedRecordSize;
      }
    }

    // Ensure size is within the min and max size bounds
    size = Math.max(minSize, Math.min(maxSize, size));

    return size;
  };

  const generateRandomValue = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateNibbleDuration = (fishRarity) => {
    switch (fishRarity) {
      case "common":
        return 4;
      case "uncommon":
        return 4;
      case "rare":
        return 3;
      case "epic":
        return 3;
      case "legendary":
        return 2;
      case "mythical":
        return 2;
      default:
        throw new Error(`Unknown rarity in float: ${fishRarity}`);
    }
  };

  const generateNibbleTimeline = (fishNibble, fishRarity) => {
    const waitDuration = generateRandomValue(2, 5); // Random number between 4 and 6 (inclusive)
    const fakeMove = fishNibble ? Math.random() < 0.5 : true; // 50% chance of true or false
    const fakeMoveDuration = generateRandomValue(1, 4); // Random number between 2 and 4 (inclusive)
    const fakeMoveExtraWait = generateRandomValue(2, 5); // Random number between 2 and 6 (inclusive)
    const fakeMoveTwo = Math.random() < 0.5; // 50% chance of true or false
    const fakeMoveTwoDuration = generateRandomValue(1, 4); // Random number between 2 and 4 (inclusive)
    const fakeMoveTwoExtraWait = generateRandomValue(2, 5); // Random number between 2 and 6 (inclusive)

    // Set teaseDuration and nibbleDuration based on fishNibble
    const teaseDuration = fishNibble ? generateRandomValue(2, 4) : 0; // 0 if fishNibble is true, otherwise random value between 2 and 4
    const nibbleDuration = fishNibble ? generateNibbleDuration(fishRarity) : 0; // 0 if fishNibble is true, otherwise 3

    // Logging or returning the generated values
    console.log({
      fishNibble,
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
    // Clear previous timer if it exists
    if (timer) {
      clearTimeout(timer);
    }

    setTimer(
      setTimeout(() => {
        setFloatState("rest");

        // Handle first fake move if applicable
        if (fakeMove) {
          setTimer(
            setTimeout(() => {
              setFloatState("fake");
              setTimer(
                setTimeout(() => {
                  setFloatState("rest");

                  // Handle second fake move if applicable
                  if (fakeMoveTwo) {
                    setTimer(
                      setTimeout(() => {
                        setFloatState("fake");
                        setTimer(
                          setTimeout(() => {
                            setFloatState("rest");

                            // Proceed to tease and nibble phases
                            setTimer(
                              setTimeout(() => {
                                if (teaseDuration !== 0) setFloatState("tease");
                                setTimer(
                                  setTimeout(() => {
                                    if (nibbleDuration !== 0)
                                      setFloatState("nibble");
                                    setTimer(
                                      setTimeout(() => {
                                        setFloatState("rest");
                                        setTimer(
                                          setTimeout(() => {
                                            setFloatState("missed");
                                          }, (waitDuration / 2) * 1000)
                                        );
                                      }, nibbleDuration * 1000)
                                    );
                                  }, teaseDuration * 1000)
                                );
                              }, fakeMoveTwoExtraWait * 1000)
                            );
                          }, fakeMoveTwoDuration * 1000)
                        );
                      }, fakeMoveExtraWait * 1000)
                    );
                  } else {
                    // If no second fake move, proceed to tease and nibble
                    setTimer(
                      setTimeout(() => {
                        if (teaseDuration !== 0) setFloatState("tease");
                        setTimer(
                          setTimeout(() => {
                            if (nibbleDuration !== 0) setFloatState("nibble");
                            setTimer(
                              setTimeout(() => {
                                setFloatState("rest");
                                setTimer(
                                  setTimeout(() => {
                                    setFloatState("missed");
                                  }, (waitDuration / 2) * 1000)
                                );
                              }, nibbleDuration * 1000)
                            );
                          }, teaseDuration * 1000)
                        );
                      }, fakeMoveExtraWait * 1000)
                    );
                  }
                }, fakeMoveDuration * 1000)
              );
            }, waitDuration * 1000)
          );
        } else if (fakeMoveTwo) {
          // Handle second fake move independently if first is not present
          setTimer(
            setTimeout(() => {
              setFloatState("fake");
              setTimer(
                setTimeout(() => {
                  setFloatState("rest");

                  // Proceed to tease and nibble phases
                  setTimer(
                    setTimeout(() => {
                      if (teaseDuration !== 0) setFloatState("tease");
                      setTimer(
                        setTimeout(() => {
                          if (nibbleDuration !== 0) setFloatState("nibble");
                          setTimer(
                            setTimeout(() => {
                              setFloatState("rest");
                              setTimer(
                                setTimeout(() => {
                                  setFloatState("missed");
                                }, (waitDuration / 2) * 1000)
                              );
                            }, nibbleDuration * 1000)
                          );
                        }, teaseDuration * 1000)
                      );
                    }, fakeMoveTwoExtraWait * 1000)
                  );
                }, fakeMoveTwoDuration * 1000)
              );
            }, waitDuration * 1000)
          );
        } else {
          // If neither fakeMove nor fakeMoveTwo is present, proceed directly to tease and nibble
          setTimer(
            setTimeout(() => {
              if (teaseDuration !== 0) setFloatState("tease");
              setTimer(
                setTimeout(() => {
                  if (nibbleDuration !== 0) setFloatState("nibble");
                  setTimer(
                    setTimeout(() => {
                      setFloatState("rest");
                      setTimer(
                        setTimeout(() => {
                          setFloatState("missed");
                        }, (waitDuration / 2) * 1000)
                      );
                    }, nibbleDuration * 1000)
                  );
                }, teaseDuration * 1000)
              );
            }, waitDuration * 1000)
          );
        }
      }, waitDuration * 1000)
    );
  };

  const stopTimer = () => {
    if (timer) {
      console.log("Stop timer on " + floatState);
      clearTimeout(timer); // Stop the timer
      setTimer(null); // Reset the timer state
    }
    if (floatState === "nibble") {
      console.log("Caught " + nibblingFish.name);
      showNotification("CATCH", true);
      setCaughtFish(nibblingFish);
      setCaughtFishSize(nibblingFishWeight);
      endHook(nibblingFish);
    } else {
      showNotification("missed", false);
      setCaughtFish(null);
      endHook();
    }
    setFloatState("rest");
  };

  const resetScene = () => {
    setFloatState("rest");
    setNibblingFishWeight(0);
    if (timer) {
      clearTimeout(timer); // Stop any ongoing timer
      setTimer(null); // Reset the timer state
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

  // Phrases for different float states
  const floatPhrases = {
    rest: [
      "The float is still.",
      "Nothing seems to be happening.",
      "The water is calm.",
      "It's quiet... too quiet.",
      "Nothing going on...",
      "Bobbing",
      "No bites yet",
    ],
    fake: [
      "Did you see that? Something's out there.",
      "A little twitch.",
      "Is that a nibble?",
      "Something seems to be playing with the bait.",
      "You notice a slight ripple around the float.",
      "The float bobs.",
      "Go on... take it",
      "Something's interested",
      "Was that a...?",
      "The float wobbles slightly.",
      "Is that a bite?",
      "The float is teasing the surface.",
      "Something's testing the bait.",
      "A cautious nibble.",
      "Something is definitely playing with the bait.",
      "A little nibble...",
      "The float jiggles slightly.",
      "Is it going to bite?",
      "It seems interested.",
    ],
    tease: [
      "Did you see that? Something's out there.",
      "A little twitch.",
      "Is that a nibble?",
      "Something seems to be playing with the bait.",
      "You notice a slight ripple around the float.",
      "The float bobs.",
      "Go on... take it",
      "Something's interested",
      "Was that a...?",
      "The float wobbles slightly.",
      "Is that a bite?",
      "The float is teasing the surface.",
      "Something's testing the bait.",
      "A cautious nibble.",
      "Something is definitely playing with the bait.",
      "A little nibble...",
      "The float jiggles slightly.",
      "Is it going to bite?",
      "It seems interested.",
    ],
    nibble: [
      "It's a bite!",
      "The float is going wild!",
      "You've got a bite!",
      "Something is on the line!",
      "Fish on!",
      "Strike it!",
    ],
    missed: [""],
  };

  // Function to get a random phrase based on the current float state
  const getFloatPhrase = (state) => {
    const phrases = floatPhrases[state];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const FloatStateDisplay = ({ floatState }) => {
    return <h2>{getFloatPhrase(floatState)}</h2>;
  };

  useEffect(() => {
    if (floatState === "missed") {
      console.log("Missed reached");
      setCaughtFish(null);
      endHook();
    }
  }, [floatState]);

  const handleRestClick = () => {
    setRodRested(true);
    generateNibble();
  };

  return (
    <div className="hook-float">
      <div className="hook-float-container">
        <div className="hook-float-container-display">
          {rodRested ? (
            <Display state={floatState} size={nibblingFishWeight} />
          ) : (
            <p>The float is settling</p>
          )}
        </div>
        <div className="hook-float-container-buttons">
          <div>
          {rodRested ? (
            <FloatStateDisplay floatState={floatState} />
          ) : (
            <p>The float is settling</p>
          )}
            
          </div>
          <div className="hook-float-container-buttons-container">
            {rodRested ? (
              <button className="panel-button" onClick={stopTimer}>
                Strike!
              </button>
            ) : (
              <button className="panel-button" onClick={handleRestClick}>
                Rest Rod
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Float;
