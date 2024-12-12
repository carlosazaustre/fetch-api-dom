const pokemonList = document.getElementById("pokemon-list");
const searchInput = document.getElementById("search");
const loader = document.getElementById("loader");

searchInput.addEventListener("input", handleSearch);

async function fetchAllPokemonDetails(pokemons) {
  try {
    loader.style.display = "block";
    console.log(pokemons);

    const promises = pokemons.map((pokemon) => {
      return fetch(pokemon.url).then((res) => res.json());
    });

    const data = await Promise.allSettled(promises);

    const details = data.map((p) => p.status === "fulfilled" && p.value);
    /*
    const details = data.map((p) => {
      if (p.status === "fulfilled") {
        return p.value
      }  
    }
    */

    renderPokemonsDetails(details);
  } catch (error) {
    console.error("Error al obtener detalles ", error);
  } finally {
    loader.style.display = "none";
  }
}

async function handleSearch(event) {
  const query = event.target.value.toLowerCase();

  try {
    loader.style.display = "block";

    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
    const data = await response.json();

    const filtered = data?.results?.filter((pokemon) => {
      return pokemon?.name?.toLowerCase().includes(query);
    });

    const promises = filtered.map((pokemon) => {
      return fetch(pokemon?.url).then((res) => res.json());
    });

    const details = await Promise.all(promises);

    renderPokemonsDetails(details);
  } catch (error) {
    console.log("Error al hacer la búsqueda", error);
  }
}

function renderPokemonsDetails(details) {
  pokemonList.innerHTML = "";
  details.forEach((pokemon) => {
    const div = document.createElement("div");
    div.className = "pokemon";
    div.innerHTML = `
      <h3>${pokemon.name}</h3>
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
      <p>Altura: ${pokemon.height}</p>
      <p>Peso: ${pokemon.weight}</p>
    `;
    pokemonList.appendChild(div);
  });
}

fetch("https://pokeapi.co/api/v2/pokemon?limit=10")
  .then((res) => res.json())
  .then((data) => fetchAllPokemonDetails(data.results));
