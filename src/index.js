//libs
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { requestFunc, searchParams } from './js/request';
//variables
const form = document.querySelector('#search-form');
const galleryList = document.querySelector('.gallery');
const watchman = document.querySelector('#watchman');
let page = 1;

// css
const input = form.firstElementChild.classList.add('input');
const button = form.lastElementChild.classList.add('button');

//lightbox and notify options

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionClass: 'captions',
  showCounter: false,
});

Notify.init({ distance: '100px' });

// main event

form.addEventListener('submit', onSubmitEvent);

function onSubmitEvent(e) {
  e.preventDefault();
  clearFunc();

  const inputValue = form.firstElementChild.value;

  searchParams.set('q', inputValue);

  requestFunc()
    .then(data => {
      renderFunc(data);
      page += 1;
    })
    .catch(error => console.log(error));
}

//   render html

function renderFunc(data) {
  let markup = ``;
  data.forEach(elem => {
    markup += `<div class="photo-card"><a href="${elem.largeImageURL}">
    <img src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes: ${elem.likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${elem.views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${elem.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${elem.downloads}</b>
      </p>
    </div>
    </a>
  </div>`;
  });

  galleryList.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

// clear before new submit event

function clearFunc() {
  galleryList.innerHTML = '';
  page = 1;
  searchParams.set('page', page);
}

// infinity skroll

const onEntry = entries => {
  entries.forEach(entry => {
    if (
      entry.isIntersecting &&
      form.firstElementChild.value !== '' &&
      page > 1
    ) {
      searchParams.set('page', page);
      requestFunc()
        .then(data => {
          renderFunc(data);
          page += 1;
        })
        .catch(error => console.log(error));
    }
  });
};
const options = {
  rootMargin: '200px',
};
const observer = new IntersectionObserver(onEntry, options);
observer.observe(watchman);
