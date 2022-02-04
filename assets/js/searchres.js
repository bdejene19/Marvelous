
// targeting search elements section to fill with api results
let resultsContainer = document.getElementById('searchResults');

/**
 * Function to display search results 
 */
const displaySearchResults = async () => {
    /**
     * get data stored from local storage => user's input
     */
    let userSearch = localStorage.getItem('universal-search-query');

    // get results from fetch request to TMDB multi API
    let mySearchRes = await getSearchTMDB(userSearch);

    // get results property
    let results = mySearchRes.results;

    // initialize variables to set values of
    let movieName = '';
    let releaseDate = '';
    let mediaType = '';
    let posterPath = '';
    let overview = '';

    // iterate through api results and set values of variables
    // override on each iteration
    // generates a movie card of result on each iteration
    results.forEach(mediaItem => {
        movieName = mediaItem.original_title
        releaseDate = mediaItem.release_date;
        mediaType = mediaItem.media_type;
        posterPath = mediaItem.poster_path;
        overview = mediaItem.overview;

        // make sure movie title exists
        if (movieName !== undefined) {
            // create new card element and append to update UI
            let generatedItem = generateSearchResultCol(movieName, releaseDate, mediaType, posterPath, overview);
            resultsContainer.appendChild(generatedItem);
        }
    })
    // update results page to display what the user searched for 
    document.getElementById('search-for').textContent = `${userSearch}`
}

// run function to get and display search results
displaySearchResults();
$(resultsContainer).on('click', 'article', openModal)



