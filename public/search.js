const myLibrary = document.getElementById('song-library');

function addButtonEvent(watchListButton, film_id, artistRowId, songRowId) {
    watchListButton.addEventListener('click', (event) => {
        event.preventDefault();
        addWatchList(film_id, artistRowId, songRowId);
    })
}


function addArtistRow(artist, artistIndex) {
    let artistRow = document.createElement('details');
    let artistRowId = `artist-row${artistIndex}`;
    artistRow.setAttribute('class', 'artist-level')
    artistRow.setAttribute('id', artistRowId);

    const artistName = document.createElement('summary');
    artistName.textContent = artist.name;
    artistRow.appendChild(artistName);

    myLibrary.appendChild(artistRow);

    return artistRow;
}

function addSongRow(artist, songIndex, artistRow) {
    const songRow = document.createElement('details');
    const songRowId = `song-row${songIndex}`;
    songRow.setAttribute('class', 'song-level');
    songRow.setAttribute('id', songRowId);
    
    const songName = document.createElement('summary');
    songName.textContent = artist.song;
    songRow.appendChild(songName);

    artistRow.appendChild(songRow);

    return songRow
}

function generateWatchList(data) {
    const artistMap = new Map(); 
    const songMap = new Map();
    let artistIndex = 0;
    let songIndex = 0;

    data.rows.forEach(artist => {
        let artistRow;
        if (!artistMap.has(artist.name)) {
            artistRow = addArtistRow(artist, artistIndex);
            artistMap.set(artist.name, artistRow);
            artistIndex++;
        } else {
            artistRow = artistMap.get(artist.name);
        }

        let songRow;
        if (!songMap.has(artist.song)) {
            songRow = addSongRow(artist, songIndex, artistRow);
            songMap.set(artist.song, songRow);
            songIndex++;
        } else {
            songRow = songMap.get(artist.song);
        }

        // movie row
        const movieRow = document.createElement('p');
        movieRow.setAttribute('class', 'movie-level');
        movieRow.setAttribute('id', `movie-${artist.film_id}`);
        movieRow.innerText =
        `Title: ${artist.title} Year: ${artist.year} Genre: ${artist.genre} Director: ${artist.director}`

        //movie row button
        const watchListButton = document.createElement('button');
        watchListButton.textContent = 'Add to Watchlist';
        addButtonEvent(watchListButton, artist.film_id, artistRow.id, songRow.id);

        // Add movies to the page
        songRow.appendChild(movieRow);
        movieRow.appendChild(watchListButton);
        })
}


fetch('http://localhost:8000/view-library')
.then(response => response.json())
.then(data => {
    generateWatchList(data)});

function addWatchList(filmId, artistRowId, songRowId) {
    fetch('http://localhost:8000/add-movie',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {film_id : filmId} )
    })
    .then(response => response.json())
    .then(data => {
        alert(data);
        console.log(artistRowId);
        console.log(songRowId);
        const songSearch = document.getElementById(songRowId);
        songSearch.open = false;
        const artistSearch = document.getElementById(artistRowId);
        artistSearch.open = false;
    });
}