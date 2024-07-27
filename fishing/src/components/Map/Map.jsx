import { useGame } from '../../GameContext';
import './Map.scss';

const Map = () => {
    const { state } = useGame(); 

    return (
        <div className="map">
            <h1>Map</h1>
            <div className="map-rowOne">
                {state.mapRowOne.map((location) => (
                    <div key={location.id} className="map-rowOne-item">
                        <h2>ID: {location.id}</h2>
                        <p>Name: {location.name}</p>
                        <p>Size: {location.size}</p>
                        <p>Cost: {location.cost}</p>
                        <p>Biomes: {location.biomes.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Map;
