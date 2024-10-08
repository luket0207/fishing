import { useState } from "react";
import "./Start.scss";
import { useGame } from "../../GameContext";
import useRandomName from "../../gamesetup/MapGeneration/RandomName";

const staticHex = "#ffffff"; 

///////////////////////////////MAP GENERATION///////////////////////////////////////
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

const MAX_BIOME_COVERAGE = {
  1: 40,
  2: 40,
  3: 50,
  4: 50,
  5: 60,
  6: 60,
};

const MIN_BIOME_COVERAGE = {
  1: 10,
  2: 10,
  3: 10,
  4: 20,
  5: 20,
  6: 30,
};

const MAX_BIOME_COUNT = {
  1: 1,
  2: 2,
  3: 2,
  4: 3,
  5: 3,
  6: 5,
};

const MIN_BIOME_COUNT = {
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 3,
  6: 4,
};

// Helper function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const generateBiomes = (row) => {
  const maxCoverage = MAX_BIOME_COVERAGE[row];
  const minCoverage = MIN_BIOME_COVERAGE[row];
  const maxBiomeCount = MAX_BIOME_COUNT[row];
  const minBiomeCount = MIN_BIOME_COUNT[row];

  if (!maxCoverage || !minCoverage || !maxBiomeCount || !minBiomeCount) {
    throw new Error(`Unknown row: ${row}`);
  }

  const biomes = ["shallow", "reeds", "deep", "swamp", "land"];
  const availableBiomes = biomes.slice(0, row);
  let biomePercentages = Array(biomes.length).fill(0);

  let totalCoverage =
    Math.floor(Math.random() * (maxCoverage - minCoverage + 1)) + minCoverage;
  let remainingCoverage = totalCoverage;

  // Ensure the number of biomes with a value is within the min and max range
  let selectedBiomes = Array(availableBiomes.length)
    .fill(0)
    .map((_, index) => index);
  selectedBiomes = shuffleArray(selectedBiomes);

  // Ensure we have at least minBiomeCount biomes
  let minSelectedBiomes = selectedBiomes.slice(0, minBiomeCount);
  let remainingSelectedBiomes = selectedBiomes.slice(
    minBiomeCount,
    maxBiomeCount
  );
  selectedBiomes = minSelectedBiomes.concat(
    shuffleArray(remainingSelectedBiomes).slice(
      0,
      maxBiomeCount - minBiomeCount
    )
  );

  let initialPercentages = Array(availableBiomes.length).fill(0);

  // Assign a minimum of 5% to each selected biome and adjust remaining coverage
  for (let i = 0; i < selectedBiomes.length; i++) {
    initialPercentages[selectedBiomes[i]] = 5;
    remainingCoverage -= 5;
  }

  // Distribute the remaining coverage randomly among the selected biomes
  while (remainingCoverage > 0) {
    const i = selectedBiomes[Math.floor(Math.random() * selectedBiomes.length)];
    const maxAdditionalCoverage = remainingCoverage; // Max we can allocate without exceeding remaining coverage
    const additionalCoverage = Math.min(
      Math.floor(Math.random() * (maxAdditionalCoverage + 1)),
      remainingCoverage
    );
    initialPercentages[i] += additionalCoverage;
    remainingCoverage -= additionalCoverage;
  }

  // Place the values into the final biomePercentages array
  for (let i = 0; i < availableBiomes.length; i++) {
    biomePercentages[i] = initialPercentages[i];
  }

  return biomePercentages;
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

///////////////////////////////FISH GENERATION///////////////////////////////////////

// Helper function to generate a random name for the fish
function randomFishName() {
  const adjectives = [
    "Shadowed",
    "Misty",
    "Thunderous",
    "Serene",
    "Mystic",
    "Ancient",
    "Fierce",
    "Ethereal",
    "Silent",
    "Swift",
    "Elder",
    "Vengeful",
    "Radiant",
    "Stormy",
    "Luminous",
    "Spectral",
    "Majestic",
    "Celestial",
    "Savage",
    "Arcane",
    "Golden",
    "Frozen",
    "Vivid",
    "Eldritch",
    "Wild",
    "Eclipsed",
    "Primeval",
    "Blazing",
    "Enchanted",
    "Glimmering",
    "Nebulous",
    "Whispering",
    "Grand",
  ];

  const nouns = [
    "Zephyrfin",
    "Draketail",
    "Moonfang",
    "Starwhisker",
    "Stormscale",
    "Riftgill",
    "Wyrmclaw",
    "Tidebreaker",
    "Deepfin",
    "Shalewing",
    "Sableclaw",
    "Windgill",
    "Seawhisper",
    "Waveguard",
    "Seaspark",
    "Voidfin",
    "Tempesttail",
    "Skyfin",
    "Eclipsefang",
    "Duskglow",
    "Ironcrest",
    "Frostscale",
    "Emberwing",
    "Shadowspike",
    "Thunderclaw",
    "Glacialfin",
    "Astralflame",
    "Ravenclaw",
    "Wraithshadow",
    "Blightfang",
    "Stormwhisper",
    "Gloomtail",
  ];

  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
    nouns[Math.floor(Math.random() * nouns.length)]
  }`;
}

function randomHex() {
  
  // HSV to RGB conversion
  function hsvToRgb(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const mod = i % 6;
    
    if (mod === 0) { r = v; g = t; b = p; }
    else if (mod === 1) { r = q; g = v; b = p; }
    else if (mod === 2) { r = p; g = v; b = t; }
    else if (mod === 3) { r = p; g = q; b = v; }
    else if (mod === 4) { r = t; g = p; b = v; }
    else if (mod === 5) { r = v; g = p; b = q; }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // Generate a vibrant color
  const hue = Math.random(); // Random hue
  const saturation = Math.random() * 0.5 + 0.5; // High saturation (50% to 100%)
  const value = Math.random() * 0.5 + 0.5; // High value (50% to 100%)
  const [r, g, b] = hsvToRgb(hue, saturation, value);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function luminance(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function contrastRatio(hex1, hex2) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const lum1 = luminance(r1, g1, b1) + 0.05;
  const lum2 = luminance(r2, g2, b2) + 0.05;
  return lum1 > lum2 ? lum1 / lum2 : lum2 / lum1;
}

function generateReadableHex(staticHex) {
  let hex;
  const minContrastRatio = 4.5; // Ensure good contrast
  const maxAttempts = 100; // Limit the number of attempts to prevent infinite loop

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    hex = randomHex();
    if (contrastRatio(staticHex, hex) >= minContrastRatio) {
      return hex;
    }
  }
  
  // Fallback in case no suitable color is found
  return randomHex();
}


// Helper function to select a random element from an array
function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to generate a random float number with specified decimal places
function getRandomFloat(min, max, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.floor((Math.random() * (max - min) + min) * factor) / factor;
}

// Helper function to generate a random integer
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFishSpecies() {
  const rarities = [
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary",
    "mythical",
  ];
  const fishSpecies = [];
  const numSpecies = {
    common: 30,
    uncommon: 30,
    rare: 30,
    epic: 30,
    legendary: 20,
    mythical: 20,
  };

  const baits = ["worm", "bread", "sweetcorn", "maggot", "shrimp"];
  const weathers = ["sunny", "clear", "cloudy", "rain", "thunder"];
  const biomes = ["normal", "shallow", "reeds", "deep", "swamp"];
  const patterns = [
    "plain",
    "dots",
    "verticalStripes",
    "horizontalStripes",
    "diagonalStripes",
    "twoTone",
  ];
  const shapes = ["normal", "round", "thin"];
  const breedTypes = [
    "couple",
    "solo couple",
    "group",
    "alphaMale",
    "alphaFemale",
  ];
  const breedFoods = ["flake", "bloodworm", "pellet", "brine", "wafers"];
  const breedPlants = [
    "none",
    "any",
    "Aquaplanta",
    "Hydroflora",
    "Submarina",
    "Leafaria",
    "Flowery",
    "Waterleaf",
  ];
  const breedRocks = [
    "none",
    "any",
    "Aquarock",
    "Deepstone",
    "Watershard",
    "Aquagem",
    "Rivershard",
    "Streamrock",
  ];

  let idCounter = 1;

  const usedNames = new Set(); // Set to keep track of used names

  // Define max size limits for each rarity
  const maxSizeLimits = {
    common: { min: 10, max: 20 },
    uncommon: { min: 10, max: 30 },
    rare: { min: 10, max: 35 },
    epic: { min: 15, max: 40 },
    legendary: { min: 20, max: 45 },
    mythical: { min: 45, max: 50 },
  };

  rarities.forEach((rarity) => {
    for (let i = 0; i < numSpecies[rarity]; i++) {
      // Generate maxSize based on rarity
      const { min: minSize, max: maxSize } = maxSizeLimits[rarity];
      const size = getRandomFloat(minSize, maxSize, 2); // Generate size with two decimal places

      // Adjust recordCatch, hardiness, and growthRate based on new size values
      const recordCatch = getRandomFloat(size * 0.75, size * 0.9, 2);
      const hardiness = getRandomInt(1, 5);
      const growthRate = getRandomInt(2, 8);
      const likesBait = getRandomElement(baits);
      const likesWeather = getRandomElement(weathers);
      const likesBiome = getRandomElement(biomes);

      // Generate a unique name
      let name;
      do {
        name = randomFishName();
      } while (usedNames.has(name)); // Ensure the name is unique
      usedNames.add(name); // Add the new name to the set

      // Create the fish object with updated size limits
      const fish = {
        id: idCounter++,
        name,
        rarity,
        minSize: (size / 2).toFixed(2), // Divide size by 2 for minSize
        maxSize: size.toFixed(2),
        likesBait,
        likesWeather,
        likesBiome,
        dislikesBait: null,
        dislikesWeather: null,
        dislikesBiome: null,
        recordCatch: recordCatch.toFixed(2),
        personalCatch: 0,
        colourOne: generateReadableHex(staticHex),
        colourTwo: generateReadableHex(staticHex),
        pattern: getRandomElement(patterns),
        shape: getRandomElement(shapes),
        breedSchool: getRandomElement(breedTypes),
        breedChance: getRandomInt(20, 80),
        breedDuration: getRandomInt(14, 28),
        breedPlant: getRandomElement(breedPlants),
        breedRock: getRandomElement(breedRocks),
        breedFood: getRandomElement(breedFoods),
        hardiness,
        growthRate,
        unlockLikesBait: false,
        unlockLikesWeather: false,
        unlockLikesBiome: false,
        unlockDislikesBait: false,
        unlockDislikesWeather: false,
        unlockDislikesBiome: false,
        unlockBreedSchool: false,
        unlockBreedChance: false,
        unlockBreedDuration: false,
        unlockBreedPlant: false,
        unlockBreedRock: false,
        unlockBreedFood: false,
      };

      // Assign the dislikes properties after the fish object has been defined
      fish.dislikesBait = getRandomElement(
        baits.filter((b) => b !== fish.likesBait)
      );
      fish.dislikesWeather = getRandomElement(
        weathers.filter((w) => w !== fish.likesWeather)
      );
      fish.dislikesBiome = getRandomElement(
        biomes.filter((b) => b !== fish.likesBiome)
      );

      fishSpecies.push(fish);
    }
  });

  return fishSpecies;
}

const FISH_RARITY = {
  1: [0, 0, 1], // 2 common, 1 uncommon
  2: [0, 1, 2], // 1 common, 1 uncommon, 1 rare
  3: [0, 1, 2, 3], // 1 common, 1 uncommon, 1 rare, 1 epic
  4: [1, 2, 3, 4], // 1 uncommon, 1 rare, 1 epic, 1 legendary
  5: [1, 2, 3, 4, 5], // 1 uncommon, 1 rare, 1 epic, 1 legendary, 1 mythical
  6: [3, 4, 5], // 1 epic, 1 legendary, 1 mythical
};

const rarityIndices = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  mythical: 5,
};

const usedFishIds = new Set(); // Global set to track used fish IDs

const generateFishArray = (row, fishSpecies) => {
  const rarities = FISH_RARITY[row];
  if (!rarities) {
    throw new Error(`Unknown row: ${row}`);
  }

  const selectedFish = [];
  const fishByRarity = {
    common: [],
    uncommon: [],
    rare: [],
    epic: [],
    legendary: [],
    mythical: [],
  };

  // Group fish species by rarity and filter out already used fish
  fishSpecies.forEach((fish) => {
    if (!usedFishIds.has(fish.id)) {
      fishByRarity[fish.rarity].push(fish);
    }
  });

  // Select fish based on the required rarities
  rarities.forEach((rarityIndex) => {
    const rarityList = Object.keys(rarityIndices);
    const rarity = rarityList[rarityIndex];
    const availableFish = fishByRarity[rarity];
    if (availableFish.length > 0) {
      // Pick a random fish from the available ones in the current rarity
      const selectedIndex = Math.floor(Math.random() * availableFish.length);
      const selected = availableFish.splice(selectedIndex, 1)[0];
      selectedFish.push(selected);
      usedFishIds.add(selected.id); // Mark fish as used
    }
  });

  return selectedFish;
};

const resetFishTracking = () => {
  usedFishIds.clear();
};

const Start = ({ setMainScene }) => {
  const [loading, setLoading] = useState(false);
  const { dispatch } = useGame();

  const randomName = useRandomName();

  const generateMapRow = (row, fishSpecies) => {
    const size = generateSize(row);

    const generateLockedStatus = (row) => {
      if (row === 1) {
        return false
      } else {
        return true
      }
    }

    // Grid generation logic moved here
    const generateGrid = (size, biomeArray) => {
      const data = [];
      const gridWidth = size;
      const gridTotal = size * size;
      const [
        shallowPercentage,
        reedsPercentage,
        deepPercentage,
        swampPercentage,
        landPercentage,
      ] = biomeArray;

      // Initialize grid with normal biome
      for (let i = 0; i < gridTotal; i++) {
        data.push({
          Id: i,
          Biome: "normal",
        });
      }

      // Helper function to get neighboring indices
      const getNeighbors = (index) => {
        const neighbors = [];
        const row = Math.floor(index / gridWidth);
        const col = index % gridWidth;

        if (row > 0) neighbors.push(index - gridWidth); // Above
        if (row < gridWidth - 1) neighbors.push(index + gridWidth); // Below
        if (col > 0) neighbors.push(index - 1); // Left
        if (col < gridWidth - 1) neighbors.push(index + 1); // Right

        return neighbors;
      };

      // Function to place multiple smaller biome clusters
      const placeBiomeClusters = (
        biome,
        totalCells,
        minClusterSize,
        maxClusterSize
      ) => {
        let placed = 0;
        while (placed < totalCells) {
          // Determine the size of the next cluster
          const clusterSize = Math.min(
            Math.floor(Math.random() * (maxClusterSize - minClusterSize + 1)) +
              minClusterSize,
            totalCells - placed
          );

          // Randomly pick a starting point
          const startIndex = Math.floor(Math.random() * gridTotal);
          if (data[startIndex].Biome !== "normal") continue;

          const queue = [startIndex];
          const visited = new Set();
          let clusterPlaced = 0;

          while (queue.length > 0 && clusterPlaced < clusterSize) {
            const currentIndex = queue.shift();

            if (data[currentIndex].Biome === "normal") {
              data[currentIndex].Biome = biome;
              placed++;
              clusterPlaced++;
            }

            const neighbors = getNeighbors(currentIndex);
            neighbors.forEach((neighbor) => {
              if (data[neighbor].Biome === "normal" && !visited.has(neighbor)) {
                queue.push(neighbor);
                visited.add(neighbor);
              }
            });
          }
        }
      };

      // Determine the number of cells for each biome based on the percentage variables
      const deepCells = Math.floor(gridTotal * (deepPercentage / 100));
      const landCells = Math.floor(gridTotal * (landPercentage / 100));
      const shallowCells = Math.floor(gridTotal * (shallowPercentage / 100));
      const reedsCells = Math.floor(gridTotal * (reedsPercentage / 100));
      const swampCells = Math.floor(gridTotal * (swampPercentage / 100));

      // Place multiple smaller clusters for each biome
      placeBiomeClusters("deep", deepCells, 5, 20);
      placeBiomeClusters("land", landCells, 5, 20);
      placeBiomeClusters("shallow", shallowCells, 5, 20);
      placeBiomeClusters("reeds", reedsCells, 5, 20);
      placeBiomeClusters("swamp", swampCells, 5, 20);

      return data;
    };

    const createLocation = (i) => {
      const biomes = generateBiomes(row);
      const fish = generateFishArray(row, fishSpecies);
      return {
        id: i,
        name: randomName(),
        fishArray: fish,
        cost: generateCost(row),
        size: size,
        biomeArray: biomes,
        grid: generateGrid(size, biomes),
        locked: generateLockedStatus(row),
      };
    };

    const locations = Array.from({ length: rowSize(row) }, (_, i) =>
      createLocation(i)
    );
    return locations;
  };

  const startGame = () => {
    setLoading(true);
    resetFishTracking();
    const fishSpecies = generateFishSpecies();
    console.log(fishSpecies);
    dispatch({ type: `SET_FISH_SPECIES`, payload: fishSpecies });
    for (let i = 1; i <= 6; i++) {
      dispatch({
        type: `SET_MAP_ROW_${i}`,
        payload: generateMapRow(i, fishSpecies),
      });
    }
    setLoading(false);
    setMainScene("map");
  };

  return (
    <div className="start">
      {!loading && (
        <>
          <button onClick={startGame}>Start Game</button>
        </>
      )}
      {loading && <p>Loading</p>}
    </div>
  );
};

export default Start;
