import axios from 'axios';
import Notiflix from 'notiflix';

export default function fetrchImages(searchValue, currentPage) {
  const loadMoreBtn = document.querySelector('.load-more');
  const galleryContainer = document.querySelector('.gallery');

  if (searchValue.length === 0) {
    searchValue = '';
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
      if (hits.length === 0) {
        loadMoreBtn.style.display = 'none';
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
}
