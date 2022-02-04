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
    // console.log('my search results from page: ', searchResults)
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
    let loadIcon = document.getElementById('loader');
    loadIcon.style.display = 'block';


    let name = '';
    let movieLength = 0;
    let movieOverview = '';
    let release_date = '';    
    let cardPlaceHolders = null ;

    let path = window.location.pathname;

    if (path === '/index.html') {
        cardPlaceHolders = $(event.target).parents('article')
    } else {
        cardPlaceHolders = $(event.target);
    }
    let currentCard = cardPlaceHolders[0];
    let cardDataSet = currentCard.dataset;


    name = cardDataSet.name;
    let res = await getFromIMDbApi(name);
    let trailerId = res.results[0].id;

    let trailerSrc = await getVideoTrailerById(trailerId)
    // console.log('my trailer source: ', trailerSrc)
    if (trailerSrc) {
        loadIcon.style.display = 'none';
    }
    $('#modal-trailer').attr('src', trailerSrc);

    // console.log('name generated from imdb request: ', res);
    movieOverview = cardDataSet.description
    release_date = cardDataSet.release_date

    let reformatDate = moment(release_date).format('MMM Do yy');

    $('#modal-name').text(name);
    $('#modal-release').text(`Release: ${reformatDate}`)
    $('#modal-overview').text(`${movieOverview}`);

    let windowWidth = window.innerWidth ;
    let dialogWidth = 0;
    if (windowWidth > 1400) {
        dialogWidth = 60;
    } else if (windowWidth < 700) {
        dialogWidth = 88;
    }

    $('#modal-content').dialog({
        width: `${dialogWidth}vw`,        
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

        // let reformatDate = moment(release_date).format('MMM Do yy');

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
    return apiRes.linkEmbed
}

const getTopRated = async () => { 
    let res = await (await (fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDBkey}&language=en-US&page=1`))).json();
    return res
}
async function test() {
    generatePopularMovies();
    generateTopRated();
}

test();


// add event listener for search btn

let searchBtn = $('#search');

const generateSearchResultCol = (name, release, media_type, posterPath, movie_overview) => {
    // row container
    let newContainer = document.createElement('article');
    newContainer.setAttribute('class', 'flex flex-row flex-wrap justify-center p-0 align-middle text-center border-2 border-sky-300');
    newContainer.setAttribute('data-name', name);
    newContainer.setAttribute('data-release_date', release);
    newContainer.setAttribute('data-cover-photo', posterPath);
    newContainer.setAttribute('data-description', movie_overview);

    // media type container 
    let mediaTypeContainer = document.createElement('img');
    mediaTypeContainer.setAttribute('src',`https://image.tmdb.org/t/p/w500/${posterPath}`);
    mediaTypeContainer.setAttribute('alt', name);
    mediaTypeContainer.setAttribute('class', 'w-24')
    let mediaForm = '';
    if (media_type === 'tv') {
        mediaForm = '📺'

    } else {
        mediaForm = '🎬';
    }

    // movie title and release date container
    let movieSideContent = document.createElement('div');
    movieSideContent.setAttribute('class', 'flex-grow text-left');

    let mediaTitleContainer = document.createElement('p');
    mediaTitleContainer.style.fontWeight = '700'
    mediaTitleContainer.textContent = `${name} ${mediaForm}`;

    let mediaReleaseDateContainer = document.createElement('p');
    let reformatDate = moment(release).format('MMM Do yy');
    mediaReleaseDateContainer.textContent = `${reformatDate}`;
    mediaReleaseDateContainer.style.fontStyle = 'italic'


    movieSideContent.append(mediaTitleContainer, mediaReleaseDateContainer);

    newContainer.append(mediaTypeContainer, movieSideContent);
    return newContainer;
    
}

let storeKey = 'universal-search-query'
const navigatetoSearch = () => {
    // event.preventDefault();
    // target input el
    let userSearch = $('nav').children('form').children('input');
    // get value in text box (from user)
    let searchValue = $(userSearch).val();

    if (searchValue === '') {

        $(userSearch).css('border', 'solid red 3px')
        setTimeout(() => {
            $(userSearch).css('border', 'none');
        }, 2000)
    } else {
        // save search to local storage
        localStorage.setItem(storeKey, searchValue);

        let pathName = window.location.pathname;
        if (pathName === '/' || pathName === 'index.html') {
            window.location = './assets/pages/searchResults.html';

        } else {
            window.location = './assets/pages/searchResults.html'
        }
    }
}
searchBtn.on('click', navigatetoSearch);
