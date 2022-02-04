// console.log('hello');


// // let results = mySearchRes.results;

let resultsContainer = document.getElementById('searchResults');
// let results = userSearchResults.results;

let mediaType = '';

const displaySearchResults = async () => {
    let userSearch = localStorage.getItem('universal-search-query');

    let mySearchRes = await getSearchTMDB(userSearch);


    let results = mySearchRes.results;

    let movieName = '';
    let releaseDate = '';
    let mediaType = '';
    let posterPath = '';
    let overview = '';


    results.forEach(mediaItem => {
        movieName = mediaItem.original_title
        releaseDate = mediaItem.release_date;
        mediaType = mediaItem.media_type;
        posterPath = mediaItem.poster_path;
        overview = mediaItem.overview;
        if (movieName !== undefined) {
            let generatedItem = generateSearchResultCol(movieName, releaseDate, mediaType, posterPath, overview);
            resultsContainer.appendChild(generatedItem);
        }
    })

    document.getElementById('search-for').textContent = `${userSearch}`

}

displaySearchResults();




