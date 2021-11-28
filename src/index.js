import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import { debounce } from 'lodash';

/* const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`,
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
const debounce = require('lodash.debounce');
input.addEventListener(
  'input',
  debounce(event => {
    if (event.target.value.length <= 0) {
      return;
    }
    fetchCountries(event.target.value.trim())
      .then(response => {
        if (response.length > 10) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
          return;
        }
        renderCountryList(response);
      })
      .catch(error => console.log(error));
  }, DEBOUNCE_DELAY),
);

function renderCountryList(countries) {
  const countryList = document.querySelector('.country-list');
  const countryInfo = document.querySelector('.country-info');

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
 */

const galleryContainer = document.querySelector('.gallery');
let currentPage = 1;
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('input[name="searchQuery"]');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', event => {
  event.preventDefault();

  if (searchInput.value.length <= 0) {
    Notiflix.Notify.failure('You need to fill search query!');
    return;
  }
  currentPage = 1;
  galleryContainer.innerHTML = '';
  fetrchImages(searchInput.value.trim());
});

loadMoreBtn.addEventListener('click', event => {
  currentPage = currentPage + 1;
  fetrchImages(searchInput.value.trim());
});

function fetrchImages(searchValue) {
  if (searchValue.length === 0) {
    searchInput.value = '';
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure('Type something in search query');
    return;
  }
  axios
    .get('https://pixabay.com/api/', {
      params: {
        key: '24535757-abc4f300dd0fcb6daffb78eec',
        q: searchValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: currentPage,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      loadMoreBtn.style.display = 'none';
    })
    .then(function ({ hits, totalHits }) {
      console.log(hits, totalHits);
      if (hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
        return;
      } else if (totalHits < hits.length * currentPage) {
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        loadMoreBtn.style.display = 'none';
        return;
      } else {
        galleryContainer.insertAdjacentHTML('beforeend', renderGallery(hits));
        loadMoreBtn.style.display = 'block';
      }
    });
}

function renderGallery(galleryItems) {
  return galleryItems
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
              <div class="info">
                <p class="info-item">
                  <b>Likes</b>
                  <span>${likes}</span>
                </p>
                <p class="info-item">
                  <b>Views</b>
                  <span>${views}</span>
                </p>
                <p class="info-item">
                  <b>Comments</b>
                  <span>${comments}</span>
                </p>
                <p class="info-item">
                  <b>Downloads</b>
                  <span>${downloads}</span>
                </p>
              </div>
            </div>`;
    })
    .join('');
}
