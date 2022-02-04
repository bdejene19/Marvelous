// alternate key k_d60mvfgr
let imdbKey = 'k_d60mvfgr';

// alternate k_1qu3iir5
let TMDBkey = 'ff34d6186c22970218f2e172d486df84';

// search results for input search
/**
 * 
 * @param {string} querySearch User input string to fetch from Imdb API.
 * @returns Results from api fetch in array of JSONs from IMDb api
 */
async function getFromIMDbApi(querySearch) {
    let response = (await (await fetch(`https://imdb-api.com/en/API/Search/${imdbKey}/${querySearch}`)).json());
    return response;
}

/**
 * Fetches popular movies data from TMDb API 
 * @returns Popular movie array of JSON objects
 */
async function getPopularFromTmdbApi() {
    let popular = (await (await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDBkey}&language=en-US&page=1`)).json());
    return popular.results
}

/**
 * 
 * @param {string} query User input string to fetch from TMDb API.
 * @returns Results from api fetch in array of JSONs from TMDb api.
 */
const getSearchTMDB = async (query) => {
    let searchResults = (await (await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${TMDBkey}&language=en-US&query=${query}&page=1&include_adult=false`)).json());
    // console.log('my search results from page: ', searchResults)
    return searchResults
}



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


/**
 * Creates modal using jQuery dialog box. Box opens on event click. Load icon becomes visible and spins till data is fetched.
 * @param {click} event Click event triggers handling of dialog box
 */
const openModal = async (event) => {
    // target and make load spinner visible 
    let loadIcon = document.getElementById('loader');
    loadIcon.style.display = 'block';

    // initialize variables to be included in modal
    let name = '';
    let movieOverview = '';
    let release_date = '';    
    let cardPlaceHolders = null ;

    // check window path to handle card display on different pages (e.g. home vs search results)
    let path = window.location.pathname;

  console.log('my current path: ', path) 

    // if (path === '/index.html') {
    if (path.endsWith('/index.html') || path.endsWith('/')) {
    // if (path === '/MarvelousMoviesIndex/' || path === '/MarvelousMoviesIndex/index.html') {

 
        cardPlaceHolders = $(event.target).parents('article')
    } else {
        cardPlaceHolders = $(event.target).parents('article');
    }

    // retrieve dataset attributes from card
    let currentCard = cardPlaceHolders[0];
    let cardDataSet = currentCard.dataset;
    console.log('my card placeholder: ', cardPlaceHolders )

    // set name from card element data set to fetch from IMDb api
    name = cardDataSet.name;
    console.log('current name: ', name);
    let res = await getFromIMDbApi(name);
    console.log('my api res: ', res);
    // get trailer id from results
    
    console.log('res properties: ', res.results);
    let trailerId = res.results[0].id;
    console.log('current trailerID: ', trailerId);

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


// target rows of content on home page and add click event to elements (movie cards) that have a class of '.display-card'
let rows = $('.display-row');
rows.on('click', '.display-card', openModal)

/**
 * Populates top rated section on home. Fetches top rated movies from tmdb and creates row content
 */
const generateTopRated = async () => {
    let myRes = await getTopRated();
    createRowContent('#top-rated', myRes.results);
    // console.log(document.getElementById('top-rated').children);
}

/**
 * 
 * @param {string} rowId HTML row element id for insertion
 * @param {string} name Name of Movie
 * @param {string} releaseDate Movie's date of release to cinemas
 * @param {string} coverPhoto Url link for coverphoto   
 * @param {string} vote_score Average movie vote score
 * @param {string} overview Description of movie plot
 */
const createMovieCard = (rowId, name, releaseDate, coverPhoto, vote_score, overview) => {
    let cardContainer = document.createElement('article');
    cardContainer.setAttribute('class', 'display-card');
    cardContainer.setAttribute('id', '');

        // let reformatDate = moment(release_date).format('MMM Do yy');

    // set data attributes for modal display
    cardContainer.setAttribute('data-name', name);
    cardContainer.setAttribute('data-release_date', releaseDate);
    cardContainer.setAttribute('data-cover-photo', coverPhoto);
    cardContainer.setAttribute('data-vote-score', vote_score);
    cardContainer.setAttribute('data-description', overview);



    // movie poster photo
    let coverImg = document.createElement('img');
    coverImg.setAttribute('src', `https://image.tmdb.org/t/p/w500/${coverPhoto}` );
    coverImg.setAttribute('alt', name);

    // movie vote score
    let vote_score_container = document.createElement('span');
    vote_score_container.textContent = vote_score;


    let textContainer = document.createElement('div');
    let textColor = '';

    // conditional color of text => color of text dependent on movies averate vote score.
    if (vote_score >= 8) {
        textColor = 'green';
    } else if (vote_score >= 7 && vote_score < 8) {
        textColor = 'orange';
    } else {
        textColor = 'red';
    }
    vote_score_container.style.color = textColor;


    // create movie title and release date elements => set text of elements to respective parameters
    let movieTitle = document.createElement('h3');
    movieTitle.textContent = name;


    let movieRelease = document.createElement('p');
    movieRelease.textContent = releaseDate;

    // append items to text container, then append all items to cardContainer
    textContainer.append(movieTitle, movieRelease);
    cardContainer.append(coverImg, vote_score_container, textContainer);

    let parent = document.querySelector(`${rowId}`);

    // make sure row where data will be inserted exists, if so => apppend the card generated
    if (parent) {
        parent.append(cardContainer);

    }
}

/**
 * 
 * @param {string} itemId Id value of item searched.
 * @returns Trailer embedded link for specific id.
 */
async function getVideoTrailerById(itemId) {
    let apiRes = await (await fetch(`https://imdb-api.com/en/API/Trailer/${imdbKey}/${itemId}`)).json();
    return apiRes.linkEmbed
}

/**
 * Call to TMDb api to fetch top rated movies
 * @returns Popular movies array from fetch request
 */
const getTopRated = async () => { 
    let res = await (await (fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDBkey}&language=en-US&page=1`))).json();
    return res
}

/**
 * Populates home page with popular and top rated movies data.
 */
async function test() {
    generatePopularMovies();
    generateTopRated();
}

// run function to populate HTML with popular and top rated content
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
    if (media_type === 'movie') {
        mediaForm = '🎬';


    } else {
        mediaForm = '📺'
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
