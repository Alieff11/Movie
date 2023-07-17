// Get the form and watchlist container elements
const form = document.querySelector('.create-form');
const watchlistContainer = document.getElementById('watchlistContainer');

// Add event listener to the form's submit button
form.addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the form from submitting

  // Get the input values
  const titleInput = document.getElementById('titleInput');
  const genreInput = document.getElementById('genreInput');
  const title = titleInput.value;
  const genre = genreInput.value;

  // Create a new watchlist item element
  const watchlistItem = document.createElement('div');
  watchlistItem.classList.add('watchlist-item');

  // Create the title element
  const titleElement = document.createElement('h3');
  titleElement.textContent = title;

  // Create the genre element
  const genreElement = document.createElement('p');
  genreElement.textContent = genre;

  // Create the remove button
  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', function () {
    watchlistItem.remove(); // Remove the watchlist item from the container
  });

  // Append the elements to the watchlist item
  watchlistItem.appendChild(titleElement);
  watchlistItem.appendChild(genreElement);
  watchlistItem.appendChild(removeButton);

  // Append the watchlist item to the container
  watchlistContainer.appendChild(watchlistItem);

  // Clear the input values
  titleInput.value = '';
  genreInput.value = '';
});
