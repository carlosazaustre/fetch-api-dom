const pokemonList = document.getElementById("pokemon-list");
const searchInput = document.getElementById("search");
const loader = document.getElementById("loader");

searchInput.addEventListener("input", handleSearch);

async function fetchDataFromURL(url) {
  try {
    loader.style.display = "block";
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error al obtener los datos: ", error);
  } finally {
    loader.style.display = "none";
  }
}

async function fetchPokemons() {
  try {
    const pokemons = await fetchDataFromURL(
      "https://pokeapi.co/api/v2/pokemon?limit=20"
    );
    renderPokemons(pokemons);
  } catch (error) {
    console.log("Error al obtener los Pokemons", error);
  }
}

async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    alert(`Nombre: ${data.name}\nAltura: ${data.height}\nPeso: ${data.weight}`);
  } catch (error) {
    console.error("Error al obtener detalles: ", error);
  }
}

async function handleSearch(event) {
  const query = event.target.value.toLowerCase();

  try {
    const pokemons = await fetchDataFromURL(
      "https://pokeapi.co/api/v2/pokemon?limit=200"
    );
    const filtered = pokemons.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(query);
    });

    renderPokemons(filtered);
  } catch (error) {
    console.log("Error al hacer la búsqueda", error);
  }
}

function renderPokemons(pokemons) {
  pokemonList.innerHTML = "";
  pokemons.forEach((pokemon) => {
    const div = document.createElement("div");
    div.className = "pokemon";
    div.textContent = pokemon.name;
    div.addEventListener("click", () => fetchPokemonDetails(pokemon.url));
    pokemonList.appendChild(div);
  });
}

fetchPokemons().then(() => {
  console.log("Init App!");
});
