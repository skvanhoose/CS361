const express = require('express');
const app = express();
const path = require('path');
const routes = require('./src/routes')
const pool = require('./database');
const { error } = require('console');
const PORT = 8000;

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json()); 

async function getArtists(title, artist) {
    const client = await pool.connect();
    const data = await client.query(
        `SELECT film_id, title, year, genre, director 
        FROM films WHERE film_id 
        IN (SELECT film_id FROM soundtrack
        WHERE song_id 
        IN (SELECT song_id FROM songs
        WHERE LOWER(title)=LOWER($1) AND artist_id 
        IN (SELECT artist_id
        FROM artists
        WHERE LOWER(name)=LOWER($2))));`,
    [title,artist]
    );
    client.release();
    return data; 
}

async function addFilm(id) {
    const client = await pool.connect();
    const data = await client.query(
        `INSERT INTO watchlist (user_id, film_id) 
        VALUES(1, ($1));`,
    [id]
    );
    client.release();
    return data;
}

async function getFilm(id) {
    const client = await pool.connect();
    const data = await client.query(
        `SELECT title FROM films WHERE film_id=($1)`,
        [id]
    );
    client.release();
    return data;
}

async function getWatchlist() {
    const client = await pool.connect();
    const data = await client.query(
        `SELECT * FROM films 
            WHERE film_id 
  	            IN (SELECT film_id FROM watchlist
                    WHERE user_id = 1) 
                    ORDER BY title ASC;`,
    );
    client.release();
    return data;
}

async function deleteMovie(id) {
    const client = await pool.connect();
    const data = await client.query(
        `DELETE FROM watchlist
        WHERE film_id=($1) and user_id=1;`,
        [id]
    );
    client.release();
    return data;
}

async function getLibrary() {
    const client = await pool.connect();
    const data = await client.query(
        `SELECT
            a.name, 
            s.title AS song, 
            f.film_id,
            f.title, 
            f.year,
            f.genre,
            f.director
        FROM
	        artists AS a
        INNER JOIN
	        songs AS s ON s.artist_id = a.artist_id
        INNER JOIN
	        soundtrack AS st ON s.song_id = st.song_id
        INNER JOIN 
	        films as f ON st.film_id = f.film_id
        ORDER by a.name ASC;`
    );
    client.release();
    return data;
}

app.post('/get-movie', async (req,res) => {
    const search = req.body;
    const title = search.title;
    const artist = search.artist;
    try {
        const data = await getArtists(title, artist);
        res.json(data.rows);
    } catch (e) {
        res.json('An error occurred retrieving your movie information');
    }
});

app.post('/add-movie', async (req,res) => {
    const idRequest = req.body.film_id;
    try {
        const data = await addFilm(idRequest);
        if (data) {
            const addedFilm = await getFilm(idRequest);
            const addedTitle = addedFilm.rows[0].title;
            const filmMessage = { message: `${addedTitle} has been added to your watchlist`};
            res.json(filmMessage.message);  
        }
    } catch (e) {
        const data = { message: 'This movie already exists in your watchlist' }
        res.json(data.message);
    }
});

app.get('/view-watchlist', async (req,res) => {
    try {
        const data = await getWatchlist();
        res.json(data);
    } catch (e) {
        res.json('An error occurred retrieving your watchlist')
    }
});

app.get('/view-library', async (req,res) => {
    try {
        const data = await getLibrary();
        //console.log(data);
        res.json(data);
    } catch (e) {
        res.json('An error occurred retrieving your library')
    }
})

app.delete('/delete-movie/:id', async (req,res) => {
    try {
        const { id } = req.params;
        await deleteMovie(id);
        res.status(200).send('ok');
    } catch (e) {
        res.json('An error occurred retrieving your watchlist')
    }
});



const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });

server.on('error', err => {
  console.error('Server error:', err);
});


