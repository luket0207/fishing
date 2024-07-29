import { useState } from 'react';
import './Start.scss';
import { useGame } from '../../GameContext';
import useRandomName from '../../gamesetup/MapGeneration/RandomName';


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
  1: 50,
  2: 50,
  3: 50,
  4: 60,
  5: 60,
  6: 80,
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
  6: 4,
};

const MIN_BIOME_COUNT = {
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
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

  let totalCoverage = Math.floor(Math.random() * (maxCoverage - minCoverage + 1)) + minCoverage;
  let remainingCoverage = totalCoverage;

  // Ensure the number of biomes with a value is within the min and max range
  let selectedBiomes = Array(availableBiomes.length).fill(0).map((_, index) => index);
  selectedBiomes = shuffleArray(selectedBiomes);

  // Ensure we have at least minBiomeCount biomes
  let minSelectedBiomes = selectedBiomes.slice(0, minBiomeCount);
  let remainingSelectedBiomes = selectedBiomes.slice(minBiomeCount, maxBiomeCount);
  selectedBiomes = minSelectedBiomes.concat(shuffleArray(remainingSelectedBiomes).slice(0, maxBiomeCount - minBiomeCount));

  let initialPercentages = Array(availableBiomes.length).fill(0);

  for (let i = 0; i < selectedBiomes.length; i++) {
    if (remainingCoverage === 0) break;
    const percentage = Math.floor(Math.random() * (remainingCoverage + 1));
    initialPercentages[selectedBiomes[i]] = percentage;
    remainingCoverage -= percentage;
  }

  // Distribute any remaining coverage randomly among the selected biomes
  while (remainingCoverage > 0) {
    const i = selectedBiomes[Math.floor(Math.random() * selectedBiomes.length)];
    const additionalCoverage = Math.floor(Math.random() * (remainingCoverage + 1));
    initialPercentages[i] += additionalCoverage;
    remainingCoverage -= additionalCoverage;
  }

  // Shuffle the initial percentages
  initialPercentages = shuffleArray(initialPercentages);

  // Place the shuffled values back into the final array
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
    "Shadowed", "Misty", "Thunderous", "Serene", "Mystic", "Ancient", "Fierce",
    "Ethereal", "Silent", "Swift", "Elder", "Vengeful", "Radiant", "Stormy", 
    "Luminous", "Spectral", "Majestic", "Celestial", "Savage", "Arcane"
  ];
  
  const nouns = [
    "Zephyrfin", "Draketail", "Moonfang", "Starwhisker", "Stormscale", "Riftgill", "Wyrmclaw",
    "Tidebreaker", "Deepfin", "Shalewing", "Sableclaw", "Windgill", "Seawhisper", "Waveguard",
    "Seaspark", "Voidfin", "Tempesttail", "Skyfin", "Eclipsefang", "Duskglow"
  ];
  
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

// Helper function to generate a random hex color code
function randomHex() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
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

// Helper function to adjust a value based on the rarity of the fish
function getRarityBasedValue(rarity, base, variance) {
  const rarityMultipliers = {
    common: 1,
    uncommon: 1.2,
    rare: 1.5,
    epic: 2,
    legendary: 2.5,
    mythical: 3,
  };
  return Math.round(base * rarityMultipliers[rarity] + Math.random() * variance);
}

function generateFishSpecies() {
  const rarities = ["common", "uncommon", "rare", "epic", "legendary", "mythical"];
  const fishSpecies = [];
  const numSpecies = { common: 10, uncommon: 10, rare: 10, epic: 10, legendary: 10, mythical: 1 };

  const baits = ["worm", "bread", "sweetcorn", "maggot", "shrimp"];
  const weathers = ["sunny", "clear", "cloudy", "rain", "thunder"];
  const biomes = ["normal", "shallow", "reeds", "deep", "swamp"];
  const patterns = ["dots", "strips", "twoTone"];
  const breedTypes = ["couple", "solo couple", "group", "alphaMale", "alphaFemale"];
  const breedFoods = ["flake", "bloodworm", "pellet", "brine", "wafers"];
  const breedPlants = ["none", "any", "Aquaplanta", "Hydroflora", "Submarina", "Leafaria", "Flowery", "Waterleaf"];
  const breedRocks = ["none", "any", "Aquarock", "Deepstone", "Watershard", "Aquagem", "Rivershard", "Streamrock"];

  let idCounter = 1;

  rarities.forEach(rarity => {
    for (let i = 0; i < numSpecies[rarity]; i++) {
      const minSize = getRarityBasedValue(rarity, 1, 5);
      const maxSize = getRarityBasedValue(rarity, minSize + 5, 10);
      const recordCatch = getRandomFloat(minSize * 0.6, maxSize * 0.8, 2);
      const hardiness = getRandomInt(1, 5);
      const growthRate = getRandomInt(2, 8);
      const likesBait = getRandomElement(baits);
      const likesWeather = getRandomElement(weathers);
      const likesBiome = getRandomElement(biomes);

      // Create the fish object without dislikes properties first
      const fish = {
        id: idCounter++,
        name: randomFishName(),
        rarity,
        minSize: minSize.toFixed(2),
        maxSize: maxSize.toFixed(2),
        likesBait,
        likesWeather,
        likesBiome,
        // Placeholder dislikes, to be filled after the fish object is fully defined
        dislikesBait: null,
        dislikesWeather: null,
        dislikesBiome: null,
        recordCatch: recordCatch.toFixed(2),
        colourOne: randomHex(),
        colourTwo: randomHex(),
        pattern: getRandomElement(patterns),
        breedSchool: getRandomElement(breedTypes),
        breedChance: getRandomInt(20, 80),
        breedDuration: getRandomInt(14, 28),
        breedPlant: getRandomElement(breedPlants),
        breedRock: getRandomElement(breedRocks),
        breedFood: getRandomElement(breedFoods),
        hardiness,
        growthRate,
      };

      // Assign the dislikes properties after the fish object has been defined
      fish.dislikesBait = getRandomElement(baits.filter(b => b !== fish.likesBait));
      fish.dislikesWeather = getRandomElement(weathers.filter(w => w !== fish.likesWeather));
      fish.dislikesBiome = getRandomElement(biomes.filter(b => b !== fish.likesBiome));

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
  6: [3, 4, 5] // 1 epic, 1 legendary, 1 mythical
};

const rarityIndices = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  mythical: 5
};

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
    mythical: []
  };

  // Group fish species by rarity
  fishSpecies.forEach(fish => {
    const rarityList = Object.keys(rarityIndices);
    const rarity = rarityList.find(r => rarityIndices[r] === rarityIndices[fish.rarity]);
    if (rarity) {
      fishByRarity[rarity].push(fish);
    }
  });

  // Select fish based on the required rarities
  rarities.forEach(rarityIndex => {
    const rarityList = Object.keys(rarityIndices);
    const rarity = rarityList[rarityIndex];
    const availableFish = fishByRarity[rarity];
    if (availableFish.length > 0) {
      // Pick a random fish from the available ones in the current rarity
      const selected = availableFish.splice(Math.floor(Math.random() * availableFish.length), 1)[0];
      selectedFish.push(selected);
    }
  });

  return selectedFish;
};


const Start = ({ setMainScene }) => {
    const [loading, setLoading] = useState(false);
    const { dispatch } = useGame();
    
    const randomName = useRandomName();

    const generateMapRow = (row, fishSpiecies) => {

        const size = generateSize(row);

        // Grid generation logic moved here
        const generateGrid = (size, biomeArray) => {
            const data = [];
            const gridWidth = size;
            const gridTotal = size * size;
            const [shallowPercentage, reedsPercentage, deepPercentage, swampPercentage, landPercentage] = biomeArray;

            // Initialize grid with normal biome
            for (let i = 0; i < gridTotal; i++) {
                data.push({
                    Id: i,
                    Biome: "normal",
                    Chance: 0
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
            const placeBiomeClusters = (biome, totalCells, minClusterSize, maxClusterSize) => {
                let placed = 0;
                while (placed < totalCells) {
                    // Determine the size of the next cluster
                    const clusterSize = Math.min(Math.floor(Math.random() * (maxClusterSize - minClusterSize + 1)) + minClusterSize, totalCells - placed);

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
                        neighbors.forEach(neighbor => {
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
          const fish = generateFishArray(row, fishSpiecies);
          return {
              id: i,
              name: randomName(),
              fishArray: fish,
              cost: generateCost(row),
              size: size,
              biomeArray: biomes,
              grid: generateGrid(size, biomes),
          };
      };

        const locations = Array.from({ length: rowSize(row) }, (_, i) => createLocation(i));
        return locations;
    };

    const startGame = () => {
        setLoading(true);

        const fishSpiecies = generateFishSpecies();
        console.log(fishSpiecies);
        dispatch({ type: `SET_FISH_SPIECIES`, payload: fishSpiecies });
        for (let i = 1; i <= 6; i++) {
            dispatch({ type: `SET_MAP_ROW_${i}`, payload: generateMapRow(i, fishSpiecies) });
          }     
        setLoading(false);
        setMainScene('map');
    };

    const handleGenerateFish = () => {
      generateFishSpecies();
    }

    return (
        <div className="start">
            {!loading && <><button onClick={startGame}>Start Game</button><button onClick={handleGenerateFish()}>Fish</button></>}
            {loading && <p>Loading</p>}
        </div>
    );
};

export default Start;
