import './FishingGrid.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faSpa, faWater } from '@fortawesome/free-solid-svg-icons';

const FishingGrid = ({ activeGrid, activeSquareId }) => {

  const gridSize = Math.sqrt(activeGrid.length);

  return (
    <div className="background grass">
      <div className="grid-container" style={{ gridTemplateColumns: `repeat(${gridSize}, 14px)` }}>
        {activeGrid.map((square) => (
          <div
            key={square.Id}
            id={square.Id}
            className={`grid-item ${square.Biome} ${square.Id === activeSquareId ? 'active' : ''}`}
          >
            {["shallow", "normal", "deep"].includes(square.Biome) && <FontAwesomeIcon icon={faWater} />}
            {square.Biome === "reeds" && <FontAwesomeIcon icon={faSeedling} />}
            {square.Biome === "swamp" && <FontAwesomeIcon icon={faSpa} />}

          </div>
        ))}
      </div>
    </div>
  );
};

export default FishingGrid;
