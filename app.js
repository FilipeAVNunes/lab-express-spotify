require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (request, response) => {
  response.render('index');
});

app.get('/artist-search', (request, response) => {
  const term = request.query.term;
  console.log(term);
  spotifyApi
    .searchArtists(term)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);
      const loadedData = {
        artist: data.body.artists.items
      };
      response.render('artist-search-results', loadedData);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});
app.get('/albums/:artistId', (request, response, next) => {
  const artistId = request.params.artistId;
  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      console.log('Artist albums', data.body);
      const viewArtistAlbum = {
        albums: data.body.items
      };
      response.render('albums', viewArtistAlbum);
    })
    .catch(err => console.log('The error while searching albums occurred:', err));
});

app.get('/tracks/:tracks', (request, response, next) => {
  //const artistId = request.params.artistId;
  const tracks = request.params.tracks;
  spotifyApi
    .getAlbumTracks(tracks)
    .then(data => {
      console.log('Album tracks', data.body.items);
      const albumTracks = {
        tracks: data.body.items
      };
      response.render('tracks', albumTracks);
    })
    .catch(err => console.log('The error while searching tracks occurred:', err));
});
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
