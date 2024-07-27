// useGenerateMapRow.js
import { useMemo } from 'react';
import useRandomName from './RandomName';
import useGenerateFishArray from './GenerateFishArray';

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
}

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
}

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
}

const generateBiomeArray = (row) => {

}

const rowSize = (row) => {
  if (row === 1 || row === 5) {
    return 3;
  } else if (row === 6) {
    return 1;
  } else {
    return 6;
  }
}

// Custom Hook
const useGenerateMapRow = (row) => {
  const randomName = useRandomName();
  const generateFishArray = useGenerateFishArray();

  const createLocation = (i) => ({
    id: i,
    name: randomName(),
    fishArray: generateFishArray(row),
    cost: generateCost(row),
    size: generateSize(row),
    biomes: generateBiomes(row),
    biomeArray: generateBiomeArray(row)
  });

  const locations = useMemo(() => Array.from({ length: rowSize(row) }, (_, i) => createLocation(i)), [randomName]);

  return locations;
};

export default useGenerateMapRow;
