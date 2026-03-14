const mySearch = document.getElementById('searchForm');
const outputTable = document.getElementById('movie-table');


function populateData(data) {
    if (data.length === 0) {
        alert('Please enter a valid song title/artist');
        location.reload();
    }
    else {
        data.forEach(film => {
            console.log(film);
            addFilmRow(film);
        });
        outputTable.hidden = false;
    }
}

function addFilmRow(film) {
    const filmTable = document.querySelector('table');
    const filmRow = document.createElement('tr');
    filmRow.setAttribute('id', `row-${film.film_id}`);
    filmTable.appendChild(filmRow);

    const filmTitle = document.createElement('td');
    filmTitle.innerText = film.title;
    filmRow.appendChild(filmTitle);

    const filmYear = document.createElement('td');
    filmYear.innerText = film.year;
    filmRow.appendChild(filmYear);

    const filmGenre = document.createElement('td');
    filmGenre.innerText = film.genre;
    filmRow.appendChild(filmGenre);

    const filmDirector = document.createElement('td');
    filmDirector.innerText = film.director;
    filmRow.appendChild(filmDirector);

    const watchListColumn = document.createElement('td');
    const watchListButton = document.createElement('button');
    watchListButton.textContent = 'Add to Watchlist';
    watchListColumn.appendChild(watchListButton);
    filmRow.appendChild(watchListColumn);
    
    watchListButton.addEventListener('click', (event) => {
        event.preventDefault();
        addToWatchList(film.film_id);
    })
}


function addToWatchList(filmId) {
    fetch('http://localhost:3000/add-movie',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {film_id : filmId} )
    })
    .then(response => response.json())
    .then(data => {
        alert(data);
        const elementToRemove = document.getElementById(`row-${filmId}`);
        outputArea.removeChild(elementToRemove);
        if (outputArea.childElementCount === 0) {
            mySearch.reset();
        }
    });
}


mySearch.addEventListener('submit', async (event) => {
    event.preventDefault();
    const songSearch = { title: mySearch.stitle.value, artist: mySearch.aname.value }
    await fetch('http://localhost:3000/get-movie',{
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

