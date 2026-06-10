import { useState, useEffect } from 'react';

const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#705746',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD'
};

function App() {
    const [pokemonList, setPokemonList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [offset, setOffset] = useState(30);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
      const fetchPokemon = async (currentOffset = 0) => {
        try {
          const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=30&offset=${currentOffset}`
          );

          const data = await response.json();

          const detailPromises = data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            return await detailResponse.json();
          });

          return await Promise.all(detailPromises);
        } catch (error) {
          console.error("Fehler beim Laden:", error);
          return [];
        }
      };

      useEffect(() => {
        const loadInitialPokemon = async () => {
          const pokemon = await fetchPokemon(0);

          setPokemonList(pokemon);
        };

        loadInitialPokemon();
      }, []);

      const loadMorePokemon = async () => {
        const pokemon = await fetchPokemon(offset);

        setPokemonList((prev) => [...prev, ...pokemon]);

        setOffset((prev) => prev + 30);
      };

    return (
      <div className="container my-pokedex-container mt-5">
      
        <div className="text-center mb-5">
          <h1 className="display-4 text-danger"><strong>Pokedex</strong></h1>
          <div className="row justify-content-center mb-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control form-control-lg text-center"
                placeholder="Pokémon suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {pokemonList
            .filter((pokemon) => 
              pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((pokemon, index) => {
            const types = pokemon.types?.map(t => t.type.name) || ['normal'];
            const color1 = typeColors[types[0]] || typeColors.normal;
            const color2 = typeColors[types[1]] || color1;
            const cardBackground = `linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`;

            return (
              <div key={index} className="col-md-3 mb-3 d-flex justify-content-center">
              <div 
                className="card h-100 shadow-sm text-white pokemon-card-shining" 
                style={{ width: '18rem', background: cardBackground, cursor: 'pointer' }}
                onClick={() => setSelectedPokemon(pokemon)} 
              >
                <img 
                  src={pokemon.sprites?.other?.dream_world?.front_default} 
                  className="card-img-top" 
                  alt={pokemon.name} 
                /> 
                
                <div className="card-body">
                  <h3 className="card-title text-capitalize">{pokemon.name}</h3>
                  
                  <p className="card-text">
                      Type: {types.join(' / ').toUpperCase()} <br />
                      
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-4 mb-5">
          <button className="btn btn-danger btn-lg" onClick={loadMorePokemon}>
            load more
          </button>
        </div>
        
        {selectedPokemon && (() => {
          const modalTypes = selectedPokemon.types?.map(t => t.type.name) || ['normal'];
          const modalColor1 = typeColors[modalTypes[0]] || typeColors.normal;
          const modalColor2 = typeColors[modalTypes[1]] || modalColor1;
          const modalBg = `linear-gradient(135deg, ${modalColor1} 50%, ${modalColor2} 50%)`;

          const filteredPokemon = pokemonList.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
              );

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content text-dark">
          
          <div className="modal-header">
            <h2 className="modal-title text-capitalize">{selectedPokemon.name}</h2>
            <button 
              type="button" 
              className="btn-close bg-danger" 
              onClick={() => setSelectedPokemon(null)} 
              
            ></button>
          </div>

          <div 
            className="modal-body text-center text-white" 
            style={{ background: modalBg }}
          >
            <img 
              src={selectedPokemon.sprites?.other?.dream_world?.front_default || selectedPokemon.sprites?.front_default} 
              alt={selectedPokemon.name} 
              style={{ width: '150px' }} 
            />
            
            <p className="mt-3">
              <strong>Type:</strong> {modalTypes.join(' / ').toUpperCase()} <br />
              <strong>Gewicht:</strong> {selectedPokemon.weight} kg <br />
              <strong>Größe:</strong> {selectedPokemon.height / 10} m <br />
              <strong>HP:</strong> {selectedPokemon.stats?.[0]?.base_stat} <br />
              <strong>Attack:</strong> {selectedPokemon.stats?.[1]?.base_stat} <br />
              <strong>Defense:</strong> {selectedPokemon.stats?.[2]?.base_stat} <br />
              <strong>Special Attack:</strong> {selectedPokemon.stats?.[3]?.base_stat} <br />
              <strong>Special Defense:</strong> {selectedPokemon.stats?.[4]?.base_stat} <br />
              <strong>Speed:</strong> {selectedPokemon.stats?.[5]?.base_stat}
            </p>
          </div>

          <div className="modal-footer d-flex justify-content-between w-100">
            {(() => {
              const currentIndex = filteredPokemon.findIndex(p => p.id === selectedPokemon.id);

              const handlePrev = () => {
                if (currentIndex > 0) {
                  setSelectedPokemon(filteredPokemon[currentIndex - 1]);
                }
              };

              const handleNext = () => {
                if (currentIndex < filteredPokemon.length - 1) {
                  setSelectedPokemon(filteredPokemon[currentIndex + 1]);
                }
              };

              
              return (
                <>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                  >
                    ← 
                  </button>


                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleNext}
                    disabled={currentIndex === filteredPokemon.length - 1}
                  >
                     →
                  </button>
                </>
              );
            })()}
          </div>

        </div>
      </div>
    </div>
  );
})()}
      </div>
    );
}

export default App;