export { requestFunc, searchParams };
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const axios = require('axios');

const KEY = '30083242-aef3007963a7f6878e8dbc6e6';
const searchParams = new URLSearchParams({
  key: KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
});

async function requestFunc() {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?${searchParams}`
    );
    if (!response.data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );

      return;
    }
    Notify.success(`Hooray! We found ${response.data.totalHits} images`);

    return response.data.hits;
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
    return;
  }
}
