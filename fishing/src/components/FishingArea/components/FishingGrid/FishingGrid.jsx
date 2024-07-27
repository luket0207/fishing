import React, { useState, useEffect, useCallback } from 'react';
import './FishingGrid.scss';

const FishingGrid = ({ size, activeSquareId, biomeArray }) => {
  const [gridData, setGridData] = useState([]);

  const generateGrid = useCallback((size) => {
    const data = [];
    const gridSize = Math.sqrt(size);
    const [shallowPercentage, deepPercentage, reedsPercentage, swampPercentage, landPercentage] = biomeArray;

    // Initialize grid with normal biome
    for (let i = 0; i < size; i++) {
      data.push({
        Id: i,
        Biome: "normal",
        Chance: 0
      });
    }

    // Helper function to get neighboring indices
    const getNeighbors = (index) => {
      const neighbors = [];
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;

      if (row > 0) neighbors.push(index - gridSize); // Above
      if (row < gridSize - 1) neighbors.push(index + gridSize); // Below
      if (col > 0) neighbors.push(index - 1); // Left
      if (col < gridSize - 1) neighbors.push(index + 1); // Right

      return neighbors;
    };

    // Function to place multiple smaller biome clusters
    const placeBiomeClusters = (biome, totalCells, minClusterSize, maxClusterSize) => {
      let placed = 0;
      while (placed < totalCells) {
        // Determine the size of the next cluster
        const clusterSize = Math.min(Math.floor(Math.random() * (maxClusterSize - minClusterSize + 1)) + minClusterSize, totalCells - placed);

        // Randomly pick a starting point
        const startIndex = Math.floor(Math.random() * size);
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
    const deepCells = Math.floor(size * (deepPercentage / 100));
    const landCells = Math.floor(size * (landPercentage / 100));
    const shallowCells = Math.floor(size * (shallowPercentage / 100));
    const reedsCells = Math.floor(size * (reedsPercentage / 100));
    const swampCells = Math.floor(size * (swampPercentage / 100));

    // Place multiple smaller clusters for each biome
    placeBiomeClusters("deep", deepCells, 5, 20);
    placeBiomeClusters("land", landCells, 5, 20);
    placeBiomeClusters("shallow", shallowCells, 5, 20);
    placeBiomeClusters("reeds", reedsCells, 5, 20);
    placeBiomeClusters("swamp", swampCells, 5, 20);

    return data;
  }, [biomeArray]);

  const regenerateGrid = () => {
    setGridData(generateGrid(size));
  };

  useEffect(() => {
    regenerateGrid();
  }, [generateGrid, size]);

  const gridSize = Math.sqrt(gridData.length);

  return (
    <div>
      <button onClick={regenerateGrid}>Regenerate Grid</button>
      <div className="grid-container" style={{ gridTemplateColumns: `repeat(${gridSize}, 10px)` }}>
        {gridData.map((square) => (
          <div
            key={square.Id}
            className={`grid-item ${square.Biome} ${square.Id === activeSquareId ? 'active' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FishingGrid;
