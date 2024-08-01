import { useCallback } from 'react';

const firstNames = [
  "Sunny", "Green", "Golden", "Crystal", "Silver",
  "Mystic", "Bright", "Eternal", "River", "Snow",
  "Azure", "Ember", "Twilight", "Willow", "Lunar",
  "Jade", "Horizon", "Wild", "Celestial", "Frost",
  "Aurora", "Nebula", "Shadow", "Glacier", "Star",
  "Sunset", "Storm", "Echo", "Phoenix", "Solstice",
  "Drift", "Verdant", "Zephyr", "Coral", "Blaze",
  "Nimbus", "Echoing", "Serene", "Whisper", "Glimmer"
];


const secondNames = [
  "Cove", "Dale", "Ridge", "Wood", "Field",
  "Brook", "Bay", "Point", "Cliff", "Haven",
  "Vale", "Falls", "Grove", "Meadow", "Peak",
  "Crest", "Knoll", "Harbor", "Springs", "Heath",
  "Shore", "Hollow", "Thicket", "Glade", "Bluff",
  "Glen", "Pines", "Forest", "Hill", "Sands",
  "Vista", "Quarry", "Path", "Terrace", "Stream",
  "Bluff", "Inlet", "Isle", "Horizon", "Gully"
];

// Custom Hook for generating random names
const useRandomName = () => {
  const randomName = useCallback(() => {
    // Randomly select an element from each array
    const firstPart = firstNames[Math.floor(Math.random() * firstNames.length)];
    const secondPart = secondNames[Math.floor(Math.random() * secondNames.length)];
    return `${firstPart} ${secondPart}`;
  }, []);

  return randomName;
};

export default useRandomName;
