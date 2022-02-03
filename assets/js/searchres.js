// console.log('hello');


// // let results = mySearchRes.results;

let resultsContainer = document.getElementById('searchResults');
// let results = userSearchResults.results;

let mediaType = '';

const displaySearchResults = async () => {
    let userSearch = localStorage.getItem('universal-search-query');

    let mySearchRes = await getSearchTMDB(userSearch);
    let results = mySearchRes.results;

    results.forEach(mediaItem => {
        movieName = mediaItem.original_title
        releaseDate = mediaItem.release_date;
        
    
        // if (mediaItem.media_type === 'tv') {
        //     mediaType = '📺';
        // } 
    
        // if (mediaItem.media_type === 'movie') {
        //     mediaType = '🎬';
        // }
        let generatedItem = generateSearchResultCol(movieName, releaseDate, mediaType);
        resultsContainer.appendChild(generatedItem);

        // console.log('my results container', generatedItem);
    })
    console.log('my updated results container: ', resultsContainer);
}

displaySearchResults();
// if (results !== null || results !== undefined) {
// results.forEach(mediaItem => {
//     movieName = mediaItem.original_title
//     releaseDate = mediaItem.release_date;
    

//     if (mediaItem.media_type === 'tv') {
//         mediaType = '📺';
//     } 

//     if (mediaItem.media_type === 'movie') {
//         mediaType = '🎬';
//     }
//     let generatedItem = generateSearchResultCol(movieName, releaseDate, mediaType);
//     resultsContainer.appendChild(generatedItem)
//     // console.log('my results container', generatedItem);
// })


