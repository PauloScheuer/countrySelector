let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favCountries = [];

let countCountries = 0;
let countFavorites = 0;

let popCountries = 0;
let popFavorites = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector("#tabCountries");
  tabFavorites = document.querySelector("#tabFavorites");
  countCountries = document.querySelector("#countCountries");
  countFavorites = document.querySelector("#countFavorites");

  popCountries = document.querySelector("#totalPopulationList");
  popFavorites = document.querySelector("#totalPopulationFavorites");

  numberFormat = Intl.NumberFormat('pt-BR');

  if (localStorage.getItem('all') == null && localStorage.getItem('fav') == null) {
    fetchCountries();
  } else {
    allCountries = JSON.parse(localStorage.getItem('all'));
    favCountries = JSON.parse(localStorage.getItem('fav'));
    render();
  }

});

async function fetchCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();
  allCountries = json.map(country => {
    const { numericCode, translations, population, flag } = country;
    return {
      id: numericCode,
      name: translations.pt,
      population: population,
      formattedPop: formatNumber(population),
      flag: flag
    }
  });
  render();
}

function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();
  handleButtons();
}

function renderCountryList() {
  let countriesHTML = "<div>";
  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  allCountries.forEach(country => {
    const { name, flag, id, formattedPop } = country;

    const countryHTML = `
    <div class='country'>
      <div>
        <a id='${id}' class='waves-effect waves-light btn'>+</a>
      </div>
      <div>
        <img src='${flag}' alt='${name}'>
      </div>
      <div>
        <ul>
        <li>${name}</li>
        <li>${formattedPop}</li>
        </ul>
      </div>
    </div>`;
    countriesHTML += countryHTML;
  });
  countriesHTML += "</div>";
  tabCountries.innerHTML = countriesHTML;
}
function renderFavorites() {
  let favoritesHTML = '<div>';
  favCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  favCountries.forEach(country => {
    const { name, flag, id, formattedPop } = country;

    const favoriteHTML = `
    <div class='country'>
      <div>
        <a id='${id}' class='waves-effect waves-light btn red darken-4'>x</a>
      </div>
      <div>
        <img src='${flag}' alt='${name}'>
      </div>
      <div>
        <ul>
        <li>${name}</li>
        <li>${formattedPop}</li>
        </ul>
      </div>
    </div>`;
    favoritesHTML += favoriteHTML;
  });

  favoritesHTML += '</div>';
  tabFavorites.innerHTML = favoritesHTML;
}

function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favCountries.length;

  const totalPop = allCountries.reduce((acc, cur) => {
    return acc + cur.population;
  }, 0);
  const favPop = favCountries.reduce((acc, cur) => {
    return acc + cur.population;
  }, 0);

  popCountries.textContent = formatNumber(totalPop);
  popFavorites.textContent = formatNumber(favPop);
}

function handleButtons() {
  const countrybtns = Array.from(tabCountries.querySelectorAll('.btn'));
  const favbtns = Array.from(tabFavorites.querySelectorAll('.btn'));

  countrybtns.forEach(button => {
    button.addEventListener('click', () => addToFav(button.id));
  });
  favbtns.forEach(button => {
    button.addEventListener('click', () => removeFromFav(button.id));
  });



}
function addToFav(id) {
  const countryToAdd = allCountries.find(country => country.id === id);

  favCountries = [...favCountries, countryToAdd];
  favCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  allCountries = allCountries.filter(country => country.id !== id);


  localStorage.setItem('all', JSON.stringify(allCountries));
  localStorage.setItem('fav', JSON.stringify(favCountries));

  render();
}
function removeFromFav(id) {
  const countryToRemove = favCountries.find(country => country.id === id);

  allCountries = [...allCountries, countryToRemove];
  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  favCountries = favCountries.filter(country => country.id !== id);

  localStorage.setItem('all', JSON.stringify(allCountries));
  localStorage.setItem('fav', JSON.stringify(favCountries));

  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}