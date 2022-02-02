let imdbKey = 'k_1qu3iir5';

let TMDBkey = 'ff34d6186c22970218f2e172d486df84';

// search results for input search
async function getFromIMDbApi(querySearch) {
    let response = (await (await fetch(`https://imdb-api.com/en/API/Search/${imdbKey}/${querySearch}`)).json());
    return response;
}

async function getPopularFromTmdbApi() {
    let response = (await (await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=ff34d6186c22970218f2e172d486df84&language=en-US&page=1`)).json());
    return response.results
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

    // creating variables for future use
   let backdrop = '';
   let movieName = '';
   let movieDescription = '';
   let releaseDate = '';
   let voteScore = 0;

   /**
    * needed attributes:
    * .backdrop_path OR .poster_path
    * realse_date
    * original_title
    * vote_average
    * overview
    */
    // iterate through api array response 
   myPopular.forEach(movie => {
        // set variables to pass into function, to generate html card elements
       backdrop = movie.poster_path;
       movieName = movie.original_title;
       releaseDate = movie.release_date;
       movieDescription = movie.overview;
       voteScore = movie.vote_average;

       createMovieCard(movieName, releaseDate, backdrop, voteScore, movieDescription);
   })
   return myPopular;

//    let movieName = '';
//    let releaseDate = '';
//    let coverURL = ''; 
}

const createMovieCard = (name, releaseDate, coverPhoto, vote_score, overview) => {
    let cardContainer = document.createElement('article');
    cardContainer.setAttribute('class', 'display-card');


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

    document.querySelector('#popular').append(cardContainer);
}

// createMovieCard('Bemnet', '03/2/2020', 'https://pbs.twimg.com/media/D8Dp0c5WkAAkvME?format=jpg&name=900x900')

/**
 * 
 * @param {string} itemId Id value of item searched
 */
function getVideoTrailerById(itemId) {
    let apiRes= fetch(`https://imdb-api.com/en/API/Trailer/${imdbKey}/${itemId}`)
    .then(response => response.json())
    .then(res => res);

    console.log('my apires: ', apiRes);

}


async function test() {
    let res =  await generatePopularMovies();
    console.log(res);
}

test();
// getVideoTrailerById('tt5295990');
