const request = require('request');

const getCoordinates = (searchText, callback) => {
  const limit = '1';
  const mapboxToken =
    'pk.eyJ1IjoiZXltYXJkY20iLCJhIjoiY2p1cHhoZ3F0MHRnajN5cXBrYjdtdGRnZyJ9.4fmvT75_mOlCQ3zswMmznw';
  const searchTextEncoded = encodeURIComponent(searchText);
  const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTextEncoded}.json?access_token=${mapboxToken}&limit=${limit}`;

  request({ url: mapboxUrl, json: true }, (err, {body}) => {
    if (err) {
      callback('A connection error occurred.')
    } else if (body.message) {
      callback(`${body.message}.`);
    } else if (!body.features[0]) {
      callback(`Invalid search terms.`);
    } else {
      const long = body.features[0].center[0];
      const lat = body.features[0].center[1];
      const placeName = body.features[0].place_name;
      const coords = { place_name: placeName, coordinates: { long: long, lat: lat }};
      callback(null, coords);
    }
  });
};

const getWeather = (lat, long, callback) => {
  const darkskyKey = '777dafe7e7e2231a7c752def2a3dd16b';
  const url = `https://api.darksky.net/forecast/${darkskyKey}/${lat},${long}`;

  request({ uri: url, json: true }, (err, {body}) => {
    if (err) {
      callback(`An error occured`);
    } else if (body.code) {
      callback(
        `A ${body.code} error occured while retrieving the forecast.`
      );
    } else {
      const c = body.currently;

      const vw = {
        head: `**** WEATHER ADVISORY ****`,
        title: `${c.summary}`,
        temp: `${c.temperature} degrees`,
        precip() {
          const p = c.precipProbability;

          if (p == 100) {
            return { val: 0, caption: `It will precipitate!` };
          } else if (p == 0) {
            return { val: 1, caption: `It will not precipitate` };
          } else if (p <= 15) {
            return {
              val: 2,
              caption: `It will probably not precipitate.`
            };
          } else if (p >= 85) {
            return { val: 3, caption: `It will probably precipitate.` };
          } else {
            return { val: 4, caption: `It may precipitate` };
          }
        }
      };

      callback(null, vw);
    }
  });
};

module.exports = {
  getCoordinates: getCoordinates,
  getWeather: getWeather
};
