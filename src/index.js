import debounce from 'lodash.debounce';
import { alert } from '@pnotify/core';
import './sass/index.scss';


import fetchCountries from './js/fetchCountries.js';

import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const input = document.querySelector('#search');
const result = document.querySelector('#result');

function renderCountryList(countries) {
  return `
    <ul>
      ${countries.map(country => `<li>${country.name}</li>`).join('')}
    </ul>
  `;
}

function renderCountryDetails(country) {
  return `
    <h2>${country.name}</h2>
    <p><b>Столиця:</b> ${country.capital}</p>
    <p><b>Населення:</b> ${country.population.toLocaleString()}</p>
    <p><b>Мова:</b> ${country.languages.map(l => l.name).join(', ')}</p>
    <img src="${country.flag}" alt="${country.name}">
  `;
}

function handleCountries(countries) {
  result.innerHTML = '';

  if (countries.length > 10) {
    alert({
      text: 'Занадто багато результатів. Уточніть запит.',
      delay: 2000,
    });
    return;
  }

  if (countries.length >= 2) {
    result.innerHTML = renderCountryList(countries);
    return;
  }

  result.innerHTML = renderCountryDetails(countries[0]);
}

const onSearch = debounce(event => {
  const query = event.target.value.trim();

  if (!query) {
    result.innerHTML = '';
    return;
  }

  fetchCountries(query)
    .then(handleCountries)
    .catch(() => {
      result.innerHTML = '';
      alert({
        text: 'Країну не знайдено',
        delay: 2000,
      });
    });
}, 500);

input.addEventListener('input', onSearch);
