// POKEDEX - GLOBAL CONTROLLERS
let controller;
let signal; // get signal
let changeGen = false;
let clicked = false;


// POKEDEX - TAGS SECTION START 
const buttons = document.querySelector(".header__tags").children;
const items = document.querySelector(".cards__container").children;

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    for (let j = 0; j < buttons.length; j++) {
      buttons[j].classList.remove("active");
    }
    this.classList.add("active");

    const target = this.getAttribute("data-target");

    for (let k = 0; k < items.length; k++) {
      items[k].style.display = "none";
      if (items[k].getAttribute("data-id") == target) {
        items[k].style.display = "grid";
      }
      if (target == "all") {
        items[k].style.display = "grid";
      }
    }
  });
}

// POKEDEX - TAGS SECTION START 

async function fetchPokemon(x, y) {
  const endpoint = `https://pokeapi.co/api/v2/pokemon/?offset=${x}&limit=${y - x}`;
  await fetch(endpoint, { signal })
    .then(function (response) {
      // The API call was successful!
      return response.json();
    })
    .then(async function (data) {
      await data.results.map(async (url) => {
        await fetch(url.url, { signal })
          .then(async function (response) {
            // The API call was successful!
            return response.json();
          })
          .then(async function (data) {
            let poke = data;
            const pokemon = {
              name: poke.name,
              stats: poke.stats.map((stat) => stat.base_stat),
              hp: poke.stats[5].base_stat,
              def: poke.stats[1].base_stat,
              atk: poke.stats[2].base_stat,
              id: poke.id,
              image: poke.sprites["front_default"],
              types: poke.types.map((type) => type.type.name),

              mainType: (() => {
                if (poke.types.length === 1) {
                  return poke.types[0].type.name;
                } else {
                  return poke.types[1].type.name;
                }
              })(),
            };

            await displayPokemon(pokemon);
          });
      });
    })
    .catch(function (err) {
      // There was an error
      console.warn("Something went wrong.", err);
    });
}


async function displayPokemon(pokemon) {
  const html = `
  <div class="cards__card fadeIn" data-id="${pokemon.mainType}" data-num="${pokemon.id}">
      <div class="cards__image">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png">
      </div>
      <div class="cards__text">
          <span class="cards__text-hp"> <img src="https://img.icons8.com/ios-filled/50/000000/pixel-heart.png" class="cards__text-icon"> ${pokemon.hp}HP <span>
          <span class="cards__text-ad"> <img src="https://img.icons8.com/metro/26/000000/minecraft-sword.png"class="cards__text-icon"> ${pokemon.atk}ATK</span>
          <span class="cards__text-def"><img src="https://img.icons8.com/dotty/80/000000/shield.png" class="cards__text-icon"> ${pokemon.def}DEF</span>
          <h2 class="cards__text-name">${pokemon.name}</h2>
      </div>
      <p class="cards__id">#${pokemon.id}</p>
      <div class="cards__stats ${pokemon.mainType}">
          <p class="type">${pokemon.mainType}</p>
      </div>
      `;
  const items = document.querySelector(".cards__container");
  items.insertAdjacentHTML("beforeend", html);
  return true;
}

function removeAll() {
  let menu = document.querySelector(".cards__container");
  while (menu.firstChild) {
    menu.removeChild(menu.firstChild);
  }
}

/// PAGINATION BETWEEN POKE GENERATIONS 

function buttonClicked(val) {

  removeAll();
  changeGen = true;
  if (controller !== undefined) {
    // Cancel the previous request
    controller.abort();
  }

  // Feature detect
  if ("AbortController" in window) {
    controller = new AbortController();
    signal = controller.signal;
  }

  if (val === "gen1") {
    fetchPokemon(0, 151);
  } else if (val === "gen2") {
    fetchPokemon(151, 251);
  } else if (val === "gen3") {
    fetchPokemon(251, 386);
  } else if (val === "gen4") {
    fetchPokemon(386, 493);
  } else if (val === "gen5") {
    fetchPokemon(493, 649);
  } else if (val === "gen6") {
    fetchPokemon(649, 721);
  } else if (val === "gen7") {
    fetchPokemon(721, 809);
  } else if (val === "gen8") {
    fetchPokemon(809, 896);
  }
}

buttonClicked();

//// INITIAL CALL
fetchPokemon(0, 151);