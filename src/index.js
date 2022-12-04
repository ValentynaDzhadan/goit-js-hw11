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
function searchOnClick(e) {
  e.preventDefault();
  searchQuery = e.target.elements.searchQuery.value.trim();

  fetchImages({ searchQuery, page })
    .then(response => {
      if (response.data.total === 0) {
        resetMarkup();
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderMarkup(response);
        // console.log(response.data.hits);
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
  refs.galleryEl.innerHTML = markupCards;
}

/// pagination

let page = 1;

let limit = 40;
const totalPages = totalHits / limit;

refs.loadMoreBtn.addEventListener('click', loadMoreOnClick);

function loadMoreOnClick(e) {}
