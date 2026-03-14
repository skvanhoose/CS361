const myWatchlist = document.getElementById('movie-table');

function deleteFromWatchlist(id) {
    try{ 
        fetch(`http://localhost:3000/delete-movie/${id}`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'  
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

        // Add row per film
        const filmRow = document.createElement('tr');
        filmRow.setAttribute('class', 'film-row');
        myWatchlist.appendChild(filmRow);

        // Add title per film
        const titleData = document.createElement('td');
        titleData.setAttribute('class', 'title-column');
        titleData.innerText = film.title;
        filmRow.appendChild(titleData);

        // Add year per film 
        const yearData = document.createElement('td');
        yearData.setAttribute('class', 'year-column');
        yearData.innerText = film.year;
        filmRow.appendChild(yearData);

        // Add genre per film 
        const genreData = document.createElement('td');
        genreData.setAttribute('class', 'genre-column');
        genreData.innerText = film.genre;
        filmRow.appendChild(genreData);

        // Add director per film
        const directorData = document.createElement('td');
        directorData.setAttribute('class', 'director-column');
        directorData.innerText = film.director;
        filmRow.appendChild(directorData);

        // Add delete button per film
        const deleteData = document.createElement('td');
        deleteData.setAttribute('class', 'delete-column')

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('class', 'delete');
        deleteButton.textContent = 'Delete';

        filmRow.appendChild(deleteData);
        deleteData.appendChild(deleteButton);
        
        // Add modal for handling delete operations
        const popupBox = document.createElement('dialog');
        popupBox.setAttribute('class', 'delete-popup');
        popupBox.innerText = `Delete ${film.title} from watchlist?\n*This action cannot be undone\n`;

        const confirmDelete = document.createElement('button');
        confirmDelete.setAttribute('class', 'confirm');
        confirmDelete.textContent = 'Confirm';

        const cancelDelete = document.createElement('button');
        cancelDelete.setAttribute('class', 'cancel');
        cancelDelete.textContent = 'Cancel';

        filmRow.appendChild(popupBox);

        popupBox.appendChild(confirmDelete);
        popupBox.appendChild(cancelDelete);

        // Add popup logic to delete button
        deleteButton.addEventListener('click', () => popupBox.showModal());

        // Add delete logic to confirm button
        confirmDelete.addEventListener('click', () => {
            deleteFromWatchlist(film.film_id);
        });

        // Add cancel logic to cancel button
        cancelDelete.addEventListener('click', () => popupBox.close()); 
    })
}  

fetch('http://localhost:3000/view-watchlist')
.then(response => response.json())
.then(data => {
    generateWatchList(data);
})