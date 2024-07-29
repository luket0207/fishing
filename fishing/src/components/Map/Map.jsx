import { useGame } from '../../GameContext';
import './Map.scss';

const Map = ({ setMainScene, setActiveGrid }) => {
    const { state } = useGame(); 

    const handleLocationClick = (grid, fishArray) => {
        setActiveGrid(grid);
        setMainScene('fishingArea');
    }

    const getBiomes = (biomeArray) => {
        const biomeNames = ['shallow', 'reeds', 'deep', 'swamp', 'land'];
        return biomeArray
            .map((value, index) => value !== 0 ? biomeNames[index] : null)
            .filter(Boolean);
    }

    const rows = [1, 2, 3, 4, 5, 6];

    return (
      <div className='map'>
        {rows.map((row) => (
          <div key={row} className={`map-row${row}`}>
            {state[`mapRow${row}`].map((location) => (
              <div key={location.id} className={`map-row${row}-item`}>
                <h2>ID: {location.id}</h2>
                <p>Name: {location.name}</p>
                <p>Size: {location.size}</p>
                <p>Cost: {location.cost}</p>
                <p>Biomes: {getBiomes(location.biomeArray).join(', ') || 'None'}</p>
                <p>Fish Species:</p>
                <ul>
                  {location.fishArray.map((fish) => (
                    <li key={fish.id}>{fish.name}</li>
                  ))}
                </ul>
                <button onClick={() => handleLocationClick(location.grid, location.fishArray)}>Go</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
}

export default Map;
