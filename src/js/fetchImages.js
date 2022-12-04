export { fetchImages };
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

async function fetchImages({ searchQuery, page }) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: '31677603-5140c7199bf175a8ce775458a',
      q: `${searchQuery}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page: `${page}`,
    },
  });
  return response;
}
