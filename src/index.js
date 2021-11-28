import './css/styles.css';
import Notiflix from 'notiflix';
import fetrchImages from './fetchImages';
const galleryContainer = document.querySelector('.gallery');
let currentPage = 1;
const searchInput = document.querySelector('input[name="searchQuery"]');
const searchForm = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', event => {
  event.preventDefault();

  if (searchInput.value.length <= 0) {
    Notiflix.Notify.failure('You need to fill search query!');
    return;
  }
  currentPage = 1;
  galleryContainer.innerHTML = '';
  fetrchImages(searchInput.value.trim(), currentPage);
});

loadMoreBtn.addEventListener('click', event => {
  currentPage = currentPage + 1;
  fetrchImages(searchInput.value.trim(), currentPage);
});
