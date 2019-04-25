const path = require('path');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const hbs = require('hbs');

const publicDir = path.join(__dirname, '../public');
const viewsDir = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

const utils = require('./utils');

app.set('view engine', 'hbs');
app.set('views', viewsDir);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDir));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Chad Eymard'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    message: "I'm here to help!",
    name: 'Chad Eymard'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    message: 'Here is everything you ever wanted to know about me.',
    name: 'Chad Eymard'
  });
});

app.get('/weather', (req, res) => {
  const searchText = req.query.search;
  if (!searchText) {
    return res.send({
      error: 'You must provide searchText.'
    });
  }
  
  utils.getCoordinates(searchText, (error, coords) => {
    if (error) {
      return res.send({
        error: error
      });
    } else {
      const { long, lat } = coords.coordinates;
      const placeName = coords.place_name;

      utils.getWeather(lat, long, (error, { head, title, temp, precip } = {}) => {
        if (error) {
          return res.send({
            error: 'You must provide searchText.'
          });
        } else {
          const msg = {
            msgType: head,
            summary: title,
            location: placeName,
            temperture: temp,
            precipitation: precip().caption
          };
          return res.send(msg);
        }
      });
    }
  });
});

app.get('/help/*', (req, res) => {
  res.render('error', {
    title: 'Error page',
    message: 'Help article Not found',
    name: 'Chad Eymard'
  });
});

app.get('*', (req, res) => {
  res.render('error', {
    title: 'Error',
    message: '404 - Not found',
    name: 'Chad Eymard'
  });
});

app.listen(PORT, () => {
  console.log('Web server is listening on port ' + PORT);
});
