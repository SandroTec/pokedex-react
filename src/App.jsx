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

    useEffect(() => {
      // to fetch pokemon from pokeAPI
      const fetchPokemon = async () => {
        try {
          // load 30 pkmn
          const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=30');
          const data = await response.json();

          // fetch all Pkmn details
          const detailPromises = data.results.map(async (pokemon) => {
            const detailResponse = await fetch(pokemon.url);
            return await detailResponse.json(); // transform to json
          });

          // wait till all promises completet
          const detailedPokemonResults = await Promise.all(detailPromises);

          // save detailed Pkmn in state
          setPokemonList(detailedPokemonResults);
        } catch (error) {
          console.error("Fehler beim Laden:", error);
        }
      };

      fetchPokemon();
    }, []); // empty array used to only load ones

    return (
      <div className="container my-pokedex-container mt-5">
      
        <div className="text-center mb-5">
          <h1 className="display-4 text-danger">Pokedex</h1>
        </div>

        <div className="row justify-content-center">
          {pokemonList.map((pokemon, index) => {
            // 1. mapping the types
            const types = pokemon.types?.map(t => t.type.name) || ['normal'];
            
            // 2. first color
            const color1 = typeColors[types[0]] || typeColors.normal;
            
            // 3. second color or first one again
            const color2 = typeColors[types[1]] || color1;

            // 4. css bg with 135 deg.
            const cardBackground = `linear-gradient(135deg, ${color1} 50%, ${color2} 50%)`;

            return (
              <div key={index} className="col-md-3 mb-3 d-flex justify-content-center">
              <div 
                className="card h-100 shadow-sm text-white pokemon-card-shining" 
                style={{ width: '18rem', background: cardBackground }}
              >
                <img 
                  src={pokemon.sprites?.front_default} 
                  className="card-img-top" 
                  alt={pokemon.name} 
                /> 
                
                <div className="card-body">
                  <h5 className="card-title text-capitalize">{pokemon.name}</h5>
                  
                  <p className="card-text">
                      Type: {types.join(' / ').toUpperCase()} <br />
                      HP: {pokemon.stats?.[0]?.base_stat} <br />
                      Attack: {pokemon.stats?.[1]?.base_stat} <br />
                      Defense: {pokemon.stats?.[2]?.base_stat} <br />
                      Special Att.: {pokemon.stats?.[3]?.base_stat} <br />
                      Special Def.: {pokemon.stats?.[4]?.base_stat} <br />
                      Speed: {pokemon.stats?.[5]?.base_stat} <br />
                      Weight: {pokemon.weight}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default App;