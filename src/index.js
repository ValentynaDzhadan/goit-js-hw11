import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';
import Notiflix from 'notiflix';
import { createMarkup } from './js/cardMarkup';
import { fetchImages } from './js/fetchImages';

const lightbox = new SimpleLightbox('.gallery a', {
  CaptionDelay: 250,
  captions: true,
  captionsData: 'alt',
});

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEl: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', searchOnClick);

let searchQuery;
let page = 0;
const perPage = 40;
refs.loadMoreBtn.classList.add('visually-hidden');

function searchOnClick(e) {
  e.preventDefault();
  searchQuery = e.target.elements.searchQuery.value.trim();
  page = 1;

  fetchImages({ searchQuery, page })
    .then(response => {
      if (response.data.total === 0) {
        resetMarkup();
        alertNoImage();
      } else {
        resetMarkup();
        renderMarkup(response);
        alertNumberOfImages(response.data.totalHits);
        // console.log(response.data);
        refs.loadMoreBtn.classList.remove('visually-hidden');
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function resetMarkup() {
  refs.galleryEl.innerHTML = '';
}

function renderMarkup(response) {
  const markupCards = createMarkup(response);
  refs.galleryEl.insertAdjacentHTML('beforeend', markupCards);
}
function alertNoImage() {
  refs.loadMoreBtn.classList.add('visually-hidden');
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertNumberOfImages(totalHits) {
  Notiflix.Notify.failure(`Hooray! We found ${totalHits} images.`);
}

/// pagination

refs.loadMoreBtn.addEventListener('click', loadMoreOnClick);
function loadMoreOnClick() {
  page += 1;

  fetchImages({ searchQuery, page })
    .then(response => {
      renderMarkup(response);
      console.log(response.data);

      const totalPages = Math.ceil(response.data.totalHits / perPage);
      console.log(totalPages);

      if (page > totalPages) {
        alertNoMoreImage();
        refs.loadMoreBtn.classList.add('visually-hidden');
      } else {
        console.log(response.data);
        let totalHits = response.data.totalHits - perPage * (page - 1);
        alertNumberOfImages(totalHits);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function alertNoMoreImage() {
  refs.loadMoreBtn.classList.add('visually-hidden');
  Notiflix.Notify.failure(
    "We're sorry, but you've reached the end of search results."
  );
}
