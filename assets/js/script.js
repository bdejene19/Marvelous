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
   let myPopular = await getPopularFromTmdbApi();
   let cardContainer = document.createElement('article');

//    let movieName = '';
//    let releaseDate = '';
//    let coverURL = '';   
    cardContainer.setAttribute('class', 'popular-movie');

}

const createMovieCard = (name, releaseDate, coverPhoto) => {
    let cardContainer = document.createElement('article');
    cardContainer.setAttribute('class', 'display-card');

    let coverImg = document.createElement('img');
    coverImg.setAttribute('src', coverPhoto);
    coverImg.setAttribute('alt', name);


    cardContainer.append(coverImg, name, releaseDate);

    document.querySelector('#search-results').append(cardContainer);
}

createMovieCard('Bemnet', '03/2/2020', 'https://pbs.twimg.com/media/D8Dp0c5WkAAkvME?format=jpg&name=900x900')

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
    let res = await getPopularFromTmdbApi();
    console.log(res);
}

test();
// getVideoTrailerById('tt5295990');
