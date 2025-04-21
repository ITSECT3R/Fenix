const pokemonIdOrNameURL = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon';

const pokemonName = document.getElementById('pokemon-name');
const pokemonNumber = document.getElementById('pokemon-id');
const weightElement = document.getElementById('weight');
const heightElement = document.getElementById('height');
const types = document.getElementById('types');
const hp = document.getElementById('hp');
const attack = document.getElementById('attack');
const defense = document.getElementById('defense');
const specialAttack = document.getElementById('special-attack');
const specialDefense = document.getElementById('special-defense');
const speed = document.getElementById('speed');

const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const pokemonImage = document.getElementById('sprite');

const displayPokemonData = async (data) => {
  const { name, id, weight, height, types: pokemonTypes, stats, sprites } = data;

  pokemonName.textContent = name;
  pokemonNumber.textContent = `#${id}`;
  weightElement.textContent = `Weight: ${weight}`;
  heightElement.textContent = `Height: ${height}`;

  types.innerHTML = pokemonTypes.map((type) => {
    const typeValue = type.type.name.toUpperCase()
    const typeHTML = `<span class="pokemon-types ${typeValue}">${typeValue}</span>`;
    return typeHTML;

  }).join('');

  hp.textContent = stats[0].base_stat;
  attack.textContent = stats[1].base_stat;
  defense.textContent = stats[2].base_stat;
  specialAttack.textContent = stats[3].base_stat;
  specialDefense.textContent = stats[4].base_stat;
  speed.textContent = stats[5].base_stat;

  pokemonImage.src = sprites.front_default;
};

const getPokemonData = async (idOrName) => {
  try {
    const response = await fetch(`${pokemonIdOrNameURL}/${idOrName}`);
    const data = await response.json();

    return data;
  } catch (error) {
    alert('Pokémon not found');
    console.error(error);
  }
}



searchButton.addEventListener('click', async () => {
  const idOrName = searchInput.value.toLowerCase();
  const pokemonData = await getPokemonData(idOrName);

  displayPokemonData(pokemonData);
});
searchInput.addEventListener('keyup', async (event) => {
  if (event.key === 'Enter') {
    const idOrName = searchInput.value.toLowerCase();
    const pokemonData = await getPokemonData(idOrName);

    displayPokemonData(pokemonData);
  }
});

console.log(getPokemonData('22'));