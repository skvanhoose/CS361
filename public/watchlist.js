const myWatchlist = document.getElementById('movielist');

function deleteFromWatchlist(id) {
    try{ 
        fetch(`http://localhost:8000/delete-movie/${id}`, {
            method: 'DELETE', // Specify the HTTP method
            headers: {
                'Content-Type': 'application/json'  // Example: specifying content type
            }})
            .then(response => response.ok)
            .then(data => {
                if (data) {
                    window.location.reload();
                }        
            })} catch (e) {
                alert('Cannot delete movie from watchlist at this time');
            }
}

function generateWatchList(data) {
    data.rows.forEach(film => {
        const filmRow = document.createElement('li');
        filmRow.setAttribute('class', 'film-row');
        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'delete');
        deleteButton.textContent = 'Delete';

        const popupBox = document.createElement('dialog');
        popupBox.setAttribute('class', 'delete-popup');
        popupBox.innerText = `Delete ${film.title} from watchlist?\n*This action cannot be undone\n`;

        const confirmDelete = document.createElement('button');
        confirmDelete.setAttribute('class', 'confirm');
        confirmDelete.textContent = 'Confirm';

        const cancelDelete = document.createElement('button');
        cancelDelete.setAttribute('class', 'cancel');
        cancelDelete.textContent = 'Cancel';

        filmRow.innerText =
            `Title: ${film.title} Year: ${film.year}  Genre: ${film.genre}    Director: ${film.director}`

        myWatchlist.appendChild(filmRow);
        filmRow.appendChild(deleteButton);

        filmRow.appendChild(popupBox);

        popupBox.appendChild(confirmDelete);
        popupBox.appendChild(cancelDelete);

        deleteButton.addEventListener('click', () => popupBox.showModal());
        confirmDelete.addEventListener('click', () => {
            deleteFromWatchlist(film.film_id);
        });
        cancelDelete.addEventListener('click', () => popupBox.close());
    })
}  

fetch('http://localhost:8000/view-watchlist')
.then(response => response.json())
.then(data => {
    generateWatchList(data);
})