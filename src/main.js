const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const moviesContainer = document.getElementById('moviesContainer');
const recommendedMoviesContainer = document.getElementById('recommendedMoviesContainer');
let watchlist = [];

// Retrieve watchlist from local storage if available
if (localStorage.getItem('watchlist')) {
  watchlist = JSON.parse(localStorage.getItem('watchlist'));
}

searchButton.addEventListener('click', searchMovies);
searchInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    searchMovies();
  }
});

function searchMovies() {
  const movieTitle = searchInput.value;
  const apiUrl = `https://www.omdbapi.com/?apikey=4e173eb2&s=${encodeURIComponent(movieTitle)}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Clear previous movies
      moviesContainer.innerHTML = '';

      data.Search.forEach(movie => {
        const movieElement = createMovieElement(movie);
        moviesContainer.appendChild(movieElement);
      });

      // Recommend movies based on ratings
      recommendMovies(data.Search);
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
    });
}

function recommendMovies(movies) {
  // Sort movies based on ratings (newer to older)
  const sortedMovies = movies.sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));

  // Clear previous recommended movies
  recommendedMoviesContainer.innerHTML = '';

  // Remove movies already shown in search results
  const uniqueMovies = sortedMovies.filter(movie => {
    return !moviesContainer.querySelector(`[data-imdbid="${movie.imdbID}"]`);
  });

  uniqueMovies.forEach(movie => {
    const movieElement = createMovieElement(movie);
    recommendedMoviesContainer.appendChild(movieElement);
  });
}

function createMovieElement(movie) {
  const movieElement = document.createElement('div');
  movieElement.className = 'movie';
  movieElement.setAttribute('data-imdbid', movie.imdbID);

  movieElement.innerHTML = `
    <h3>${movie.Title}</h3>
    <p>Year: ${movie.Year}</p>
    <p>IMDB ID: ${movie.imdbID}</p>
    <div class="poster">
      <img src="${movie.Poster}" alt="${movie.Title} Poster">
    </div>
    <div class="button-container">
      <button onclick="toggleMovieDetails(this)">View Details</button>
      <button onclick="addToWatchlist(this)">Add to Watchlist</button>
    </div>
    <div class="movieDetails" style="display: none;"></div>
  `;

  return movieElement;
}

function toggleMovieDetails(button) {
  const movieElement = button.parentNode.parentNode;
  const movieID = movieElement.getAttribute('data-imdbid');
  const movieDetailsContainer = movieElement.querySelector('.movieDetails');

  if (movieDetailsContainer.style.display === 'none') {
    // Hide details of other movies
    hideMovieDetails();

    // Fetch movie details
    fetchMovieDetails(movieID, movieDetailsContainer);

    // Show movie details
    movieDetailsContainer.style.display = 'block';
    button.textContent = 'Hide Details';
  } else {
    // Hide movie details
    movieDetailsContainer.style.display = 'none';
    button.textContent = 'View Details';
  }
}

function hideMovieDetails() {
  const movieDetailsContainers = document.querySelectorAll('.movieDetails');
  const buttons = document.querySelectorAll('.button-container button');

  movieDetailsContainers.forEach(container => {
    container.style.display = 'none';
  });

  buttons.forEach(button => {
    button.textContent = 'Add To Watchlist';
  });
}

function fetchMovieDetails(movieID, movieDetailsContainer) {
  const apiUrl = `https://www.omdbapi.com/?apikey=4e173eb2&i=${movieID}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(movie => {
      const movieDetails = `
        <h2>${movie.Title}</h2>
        <p>Synopsis: ${movie.Plot}</p>
        <p>Cast: ${movie.Actors}</p>
        <p>Release Date: ${movie.Released}</p>
        <p>Ratings: ${movie.imdbRating}</p>
      `;

      movieDetailsContainer.innerHTML = movieDetails;
    })
    .catch(error => {
      console.error('Error fetching movie details:', error);
    });
}

function addToWatchlist(button) {
  const movieElement = button.parentNode.parentNode;
  const movieID = movieElement.getAttribute('data-imdbid');
  const movieTitle = movieElement.querySelector('h3').textContent;
  const movieYear = movieElement.querySelector('p:nth-child(2)').textContent;

  // Check if the movie is already in the watchlist
  const existingMovie = watchlist.find(movie => movie.imdbID === movieID);
  if (existingMovie) {
    alert('Movie is already in the watchlist.');
    return;
  }

  const movieData = {
    imdbID: movieID,
    Title: movieTitle,
    Year: movieYear
  };

  watchlist.push(movieData);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  alert('Movie added to the watchlist!');
}
