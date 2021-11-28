import './css/styles.css';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const debounce = require('lodash.debounce');
input.addEventListener(
  'input',
  debounce(event => {
    if (event.target.value.trim().length <= 0) {
      return;
    }
    fetchCountries(event.target.value.trim())
      .then(response => {
        if (response.length > 10) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
          countryInfo.innerHTML = '';
          countryList.innerHTML = '';
          return;
        }
        renderCountryList(response);
      })
      .catch(error => console.log(error));
  }, DEBOUNCE_DELAY),
);

function renderCountryList(countries) {
  if (countries.length === 1) {
    let [item] = countries;
    const languages = Object.keys(item.languages)
      .map(function (k) {
        return item.languages[k];
      })
      .join(',');
    const markup = `
         <div class="country-info-title">
            <img src="${item.flags.svg}" alt="country-flag" />
            <h2>${item.name.official}</h2>
         </div>
         <p><b>Capital:</b> ${item.capital}</p>
         <p><b>Population:</b> ${item.population}</p>
         <p><b>Language:</b> ${languages}</p>
         `;
    countryInfo.innerHTML = markup;
    countryList.innerHTML = '';
  } else {
    const markup = countries
      .map(country => {
        return `<li>
               <img src="${country.flags.svg}" alt="country-flag" />
               <h2>${country.name.official}</h2>
         </li>`;
      })
      .join('');
    countryList.innerHTML = markup;
    countryInfo.innerHTML = '';
  }
}
