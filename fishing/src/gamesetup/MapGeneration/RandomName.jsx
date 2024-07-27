import { useCallback } from 'react';

const firstNames = [
  "Sunny", "Green", "Golden", "Crystal", "Silver",
  "Mystic", "Bright", "Eternal", "River", "Snow"
];

const secondNames = [
  " Cove", "dale", "ridge", "wood", "field",
  "brook", "bay", "point", "cliff", "haven"
];

// Custom Hook for generating random names
const useRandomName = () => {
  const randomName = useCallback(() => {
    // Randomly select an element from each array
    const firstPart = firstNames[Math.floor(Math.random() * firstNames.length)];
    const secondPart = secondNames[Math.floor(Math.random() * secondNames.length)];
    return `${firstPart}${secondPart}`;
  }, []);

  return randomName;
};

export default useRandomName;
