const myLibrary = document.getElementById('song-library');

function generateWatchList(data) {
    artistTracker = [];
    data.rows.forEach(artist => {
        console.log(artist);
        if (artistTracker.includes(artist.name) === false) {
            // artist row
            const artistRow = document.createElement('details');
            artistRow.setAttribute('id', 'artist-level');

            const artistName = document.createElement('summary');
            artistName.textContent = artist.name;
            artistRow.appendChild(artistName);

            // song row
            const songRow = document.createElement('details');
            songRow.setAttribute('id', 'song-level');
            
            const songName = document.createElement('summary');
            songName.textContent = artist.song;

            // movie row
            const movieRow = document.createElement('p');

            myLibrary.appendChild(artistRow);
            artistRow.appendChild(songRow);
            songRow.appendChild(songName);

            // append process
            //artistName.appendChild(songRow);
            //const placeholder = document.createElement('p');
            //placeholder.textContent = 'test';
            //artistName.appendChild(placeholder);
            // const artistRow = document.createElement('details');
            myLibrary.appendChild(artistRow);
            artistTracker.push(artist.name);
        }
    })
}


fetch('http://localhost:8000/view-library')
.then(response => response.json())
.then(data => {
    generateWatchList(data)})