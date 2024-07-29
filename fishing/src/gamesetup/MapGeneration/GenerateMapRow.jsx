import { useMemo, useRef } from 'react';
import useRandomName from './RandomName';
import useGenerateFishArray from './GenerateFishArray';
import useGenerateGrid from './GenerateGrid';

const generateCost = (row) => {
  switch (row) {
    case 1:
      return 100;
    case 2:
      return 500;
    case 3:
      return 1500;
    case 4:
      return 5000;
    case 5:
      return 15000;
    case 6:
      return 50000;
    default:
      throw new Error(`Unknown row: ${row}`);
  }
};

const generateSize = (row) => {
  switch (row) {
    case 1:
      return 19;
    case 2:
      return 23;
    case 3:
      return 25;
    case 4:
      return 29;
    case 5:
      return 33;
    case 6:
      return 35;
    default:
      throw new Error(`Unknown row: ${row}`);
  }
};

const generateBiomes = (row) => {
  switch (row) {
    case 1:
      return ["shallow"];
    case 2:
      return ["shallow", "reeds"];
    case 3:
      return ["shallow", "reeds", "deep"];
    case 4:
      return ["shallow", "reeds", "deep", "swamp"];
    case 5:
      return ["shallow", "reeds", "deep", "swamp", "land"];
    case 6:
      return ["shallow", "reeds", "deep", "swamp", "land"];
    default:
      throw new Error(`Unknown row: ${row}`);
  }
};

const rowSize = (row) => {
  if (row === 1 || row === 5) {
    return 3;
  } else if (row === 6) {
    return 1;
  } else {
    return 6;
  }
};

// Helper function to generate an array of 5 random numbers that sum up to 100
const generateRandomBiomeArray = () => {
  let total = 50;
  const array = [];
  for (let i = 0; i < 4; i++) {
    const value = Math.floor(Math.random() * (total - (4 - i))) + 1;
    array.push(value);
    total -= value;
  }
  array.push(total); // Add the remaining total to the last element
  return array;
};

// Custom Hook
const useGenerateMapRow = (row) => {
  console.log("UseGenerateMapRow");
  const randomName = useRandomName();
  const generateFishArray = useGenerateFishArray();

  // Generate the size and biomes for the row
  const size = generateSize(row);
  const biomes = generateRandomBiomeArray();

  // Always call useGenerateGrid unconditionally
  const generatedGrid = useGenerateGrid(size, biomes);

  // Use useRef to store the generated grid
  const generateGridRef = useRef(generatedGrid);
  const generateGrid = generateGridRef.current;

  const createLocation = (i) => ({
    id: i,
    name: randomName(),
    fishArray: generateFishArray(row),
    cost: generateCost(row),
    size: size,
    biomes: generateBiomes(row),
    grid: generateGrid,
  });

  const locations = useMemo(() => Array.from({ length: rowSize(row) }, (_, i) => createLocation(i)), [randomName, generateFishArray, size, generateGrid]);

  return locations;
};

export default useGenerateMapRow;
