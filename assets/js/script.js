let imdbKey = 'k_1qu3iir5';

let TMDBkey = 'ff34d6186c22970218f2e172d486df84';

// search results for input search
async function getFromIMDbApi(querySearch) {
    let response = (await (await fetch(`https://imdb-api.com/en/API/Search/${imdbKey}/${querySearch}`)).json());
    return response;
}

async function getPopularFromTmdbApi() {
    let popular = (await (await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDBkey}&language=en-US&page=1`)).json());
    return popular.results
}

const getSearchTMDB = async (query) => {
    let searchResults = (await (await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDBkey}&language=en-US&query=${query}&page=1&include_adult=false`)).json());
    return searchResults
}


/**
 * 
 * @param {string} releaseDate Movie's date of release to cinemas
 * @param {string} name Name of Movie
 * @param {string} coverPhoto Url link for coverphoto
 * @returns {HTMLElement} A newly generated html element that contains the following information
 * 
 */
const generatePopularMovies = async () => {
    // me getting popular data from tmdb api
   let myPopular = await getPopularFromTmdbApi();
   createRowContent('#popular', myPopular)
}

const createRowContent = (rowName, contentArray) => {

    // creating variables for future use
    let backdrop = '';
    let movieName = '';
    let movieDescription = '';
    let releaseDate = '';
    let voteScore = 0;
    contentArray.forEach(movie => {
        // set variables to pass into function, to generate html card elements
        backdrop = movie.poster_path;
        movieName = movie.original_title;
        releaseDate = movie.release_date;
        movieDescription = movie.overview;
        voteScore = movie.vote_average;

        
        createMovieCard(rowName, movieName, releaseDate, backdrop, voteScore, movieDescription);
   })
   return contentArray;
}

const openModal = async (event) => {
    let name = '';
    let movieLength = 0;
    let movieOverview = '';
    let release_date = '';
    let cardPlaceHolders = $(event.target).parents('article');
    let currentCard = cardPlaceHolders[0];
    let cardDataSet = currentCard.dataset;


    name = cardDataSet.name;
    let res = await getFromIMDbApi(name);
    let trailerId = res.results[0].id;

    let trailerSrc = await getVideoTrailerById(trailerId)
    $('#modal-trailer').attr('src', trailerSrc);

    // console.log('name generated from imdb request: ', res);
    movieOverview = cardDataSet.description
    release_date = cardDataSet.release_date
    $('#modal-name').text(name);
    $('#modal-release').text(`Release: ${release_date}`)
    $('#modal-overview').text(`Description: \n${movieOverview}`);

    $('#modal-content').dialog({
        width: '60vw',
    });
}

let rows = $('.display-row');
rows.on('click', '.display-card', openModal)


const generateTopRated = async () => {
    let myRes = await getTopRated();
    createRowContent('#top-rated', myRes.results);
    // console.log(document.getElementById('top-rated').children);
}
const createMovieCard = (rowId, name, releaseDate, coverPhoto, vote_score, overview) => {
    let cardContainer = document.createElement('article');
    cardContainer.setAttribute('class', 'display-card');
    cardContainer.setAttribute('id', '');

    cardContainer.setAttribute('data-name', name);
    cardContainer.setAttribute('data-release_date', releaseDate);
    cardContainer.setAttribute('data-cover-photo', coverPhoto);
    cardContainer.setAttribute('data-vote-score', vote_score);
    cardContainer.setAttribute('data-description', overview);



    // movie poster photo
    let coverImg = document.createElement('img');
    coverImg.setAttribute('src', `https://image.tmdb.org/t/p/w500/${coverPhoto}` );
    coverImg.setAttribute('alt', name);

    let vote_score_container = document.createElement('span');
    let textContainer = document.createElement('div');


    vote_score_container.textContent = vote_score;
    let textColor = '';

    if (vote_score >= 8) {
        textColor = 'green';
    } else if (vote_score >= 7 && vote_score < 8) {
        textColor = 'orange';
    } else {
        textColor = 'red';
    }
    vote_score_container.style.color = textColor;

    let movieTitle = document.createElement('h3');
    movieTitle.textContent = name;


    let movieRelease = document.createElement('p');
    movieRelease.textContent = releaseDate;

    textContainer.append(movieTitle, movieRelease);
    cardContainer.append(coverImg, vote_score_container, textContainer);

    let parent = document.querySelector(`${rowId}`);

    if (parent) {
        parent.append(cardContainer);

    }
}

// createMovieCard('Bemnet', '03/2/2020', 'https://pbs.twimg.com/media/D8Dp0c5WkAAkvME?format=jpg&name=900x900')

/**
 * 
 * @param {string} itemId Id value of item searched
 */
async function getVideoTrailerById(itemId) {
    let apiRes = await (await fetch(`https://imdb-api.com/en/API/Trailer/${imdbKey}/${itemId}`)).json();
    console.log('trailer api request: ', apiRes.linkEmbed);
    return apiRes.linkEmbed
}

const getTopRated = async () => { 
    let res = await (await (fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDBkey}&language=en-US&page=1`))).json();
    return res
}
async function test() {
    generatePopularMovies();
    generateTopRated();
  
    // console.log(res);
}

test();
// getVideoTrailerById('tt5295990');


// add event listener for search btn
let searchBtn = $('#search');

const generateSearchResultCol = (name, release, media_type) => {
    // console.log('ran my generate function')
    

    let newContainer = document.createElement('article');
    newContainer.setAttribute('class', 'flex flex-row flex-wrap justify-center align-middle text-center');

    let mediaTextContainer = document.createElement('p');
    mediaTextContainer.setAttribute('class', 'w-24');
    mediaTextContainer.textContent = `${name} (${release})`;
    newContainer.append(mediaTextContainer);
    return newContainer;
    // newContainer.append(mediaTextContainer);
    // console.log(resultsContainer)
    // resultsContainer.append(newContainer);
    // console.log('my results container: ', resultsContainer);
    // let container = $('<article>');
    // $(container).attr('class', 'flex flex-row flex-wrap justify-center align-middle text-center');
    
    // let mediaTypeContainer = $('<p>');
    // $(mediaTypeContainer).attr('class', 'w-24')
    // $(mediaTypeContainer).text('hello ');
    // console.log('my media type container: ', mediaTypeContainer);
    // $(container).append(mediaTypeContainer);
    // console.log($(container).children());
    // $(resultsContainer).append(container);
    // // console.log(mediaTextContainer);
    // let mediaTextContainer = $('<div>');
    // mediaTextContainer.attr('class', 'flex-grow text-left');
    // console.log('my media text container: ', mediaTextContainer);
    // container.append(mediaTypeContainer, mediaTextContainer);

    
    
    // let mediaText = $('<p>');
    // mediaText.text(`${name} ${release}`);;
    // console.log('my media text:) ', mediaText)


    // mediaTextContainer.append(mediaText);
    // console.log(mediaTextContainer);
    // console.log('my media text container: ', mediaTextContainer);
    // container.append(mediaTypeContainer, mediaTextContainer);
    
    // console.log('my container elements to be added: ', container);

    // console.log('where I am targeting: ', resultsContainer);
    // resultsContainer.append(container);
    // console.log('my results container and end of generate function', resultsContainer);

    // console.log('target after append: ', resultsContainer);


}
const displaySearchResults = async () => {

    let userSearch = $('nav').children('input').val();
    let resultsContainer = document.getElementById('search-results-query');
    console.log('results container: ', resultsContainer);

    window.location = 'assets/pages/searchResults.html';
    console.log('my tmdb search stops for some reason: ');
    let userSearchResults = await getPopularFromTmdbApi();
    // let results = userSearchResults.results;

    let mediaType = '';
    // if (results !== null || results !== undefined) {
        userSearchResults.forEach(mediaItem => {
            movieName = mediaItem.original_title
            releaseDate = mediaItem.release_date;
            
    
            if (mediaItem.media_type === 'tv') {
                mediaType = '📺';
            } 
    
            if (mediaItem.media_type === 'movie') {
                mediaType = '🎬';
            }
            let generatedItem = generateSearchResultCol(movieName, releaseDate, mediaType);
            // console.log('my results container', generatedItem);
        })
    // } else {
    //     console.log('null result')
    // }
    
    // let validSearchReponses = await getFromIMDbApi(userSearch);
}
searchBtn.on('click', displaySearchResults);
