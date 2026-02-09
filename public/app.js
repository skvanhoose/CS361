const mySearch = document.getElementById('searchForm');
const outputArea = document.getElementById('output');


function populateData(data) {
    if (data.length === 0) {
        alert('Please enter a valid song title/artist');
        location.reload();
    }
    else {
        data.forEach(film => {
            addFilmRow(film);
        });
    }
}

function addFilmRow(film) {
    const filmDiv = document.createElement('div');
    filmDiv.setAttribute('id', `div-${film.film_id}`);
    const watchListButton = document.createElement('button');
    watchListButton.textContent = 'Add to Watchlist';

    filmDiv.innerText =
    `Title: ${film.title} Year: ${film.year} 
    Genre: ${film.genre} Director: ${film.director}`
    
    watchListButton.addEventListener('click', (event) => {
        event.preventDefault();
        addToWatchList(film.film_id);
    })

    outputArea.appendChild(filmDiv);
    filmDiv.appendChild(watchListButton);
}

function addToWatchList(filmId) {
    fetch('http://localhost:8000/add-movie',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {film_id : filmId} )
    })
    .then(response => response.json())
    .then(data => {
        alert(data);
        const elementToRemove = document.getElementById(`div-${filmId}`);
        outputArea.removeChild(elementToRemove);
        if (outputArea.childElementCount === 0) {
            mySearch.reset();
        }
    });
}

mySearch.addEventListener('submit', (event) => {
    event.preventDefault();
    const songSearch = { title: mySearch.stitle.value, artist: mySearch.aname.value }
    fetch('http://localhost:8000/get-movie',{
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(songSearch)
})
.then(response => response.json())
.then(data => populateData(data))
.catch((e) => {
    alert('There was an error processing your request');
    location.reload();
})});

