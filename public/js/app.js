const getForecast = search => {
  const baseurl = 'http://localhost:3000/weather?search=';
  const searchText = search;
  const url = `${baseurl}${searchText}`;

  fetch(url).then(res => {
    res.json().then(data => {
      if (data.error) {
        // console.log(data.error);
        return (message1.textContent = data.error);
      }
      // console.log(data);
      // console.log('Here', data.location)
      message1.textContent = data.location;
      message2.textContent = data.summary;
    });
  });
};

const weatherForm = document.querySelector('form');
const searchTextBox = document.querySelector('#searchText');
let searchTextValue = '';

const message1 = document.querySelector('#message-1');
const message2 = document.querySelector('#message-2');

const clearMessage = () => {
  message1.textContent = ''
  message2.textContent = ''
};

const loadingMessage = () => {
  message1.textContent = 'Loading...'
}

clearMessage();

weatherForm.addEventListener('submit', e => {
  clearMessage();

  loadingMessage();

  e.preventDefault();
  searchTextValue = searchTextBox.value;

  getForecast(encodeURIComponent(searchTextValue));
});
