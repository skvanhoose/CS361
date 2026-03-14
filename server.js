const express = require('express');
const app = express();
const path = require('path');
const pool = require('./database');
const { error } = require('console');
const cookieParser = require('cookie-parser');
const PORT = 3000;


app.use(cookieParser());
app.use(express.json());

// Display all public files freely
app.use(express.static(path.join(__dirname, 'public'), {
  extensions: ['html']
}));


// Check whether there is an active login session
async function isLoggedIn(req, res, next) {
    const access_token = req.cookies.access_token;

    const response = await fetch('http://localhost:8000/validate-token',
    {
        mode: 'cors',
        method: 'POST',
        headers: {
        "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({token: access_token})
    })
    // token is valid
    if (response.status === 200) next();
    // token got regenerated
    else if (response.status === 201) {
        const data = await response.json();
        // call login service directly from here
        const newCookie = await fetch('http://localhost:4000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, jti: data.jti, refresh: data.refresh })
        });
        const cookie = newCookie.headers.get('set-cookie');
        if (cookie) {
            res.set('Set-Cookie', cookie);
        }
        next();
    } else {
        // Initiate revocation and return to login page if some other response
        const tokenRevoke = await fetch('http://localhost:5001/revoke', {
            mode: 'cors',
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: my_token, reason: "logout" }),
        });
        res.clearCookie('access_token', {
        httpOnly: true,
        });
        return res.redirect('http://localhost:3000/');
    }};

const protectedPages = ['dashboard', 'help', 'search', 'watchlist']; 
const protectedAssets = ['dashboard.js', 'help.js', 'search.js', 'watchlist.js', 'logout.js', 'download.js']; 

protectedPages.forEach(page => {
    app.get(`/private/${page}`, isLoggedIn, (req, res) => {
        res.sendFile(path.join(__dirname, 'private', `${page}.html`));
    });
});

protectedAssets.forEach(asset => {
    app.get(`/private/${asset}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'private', asset));
    });
});


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

app.post('/post-comment', async (req,res) => {
    try {
        res.json('Request processed');
        return
    } catch (e) {
        res.json('An error occurred submitting feedback');
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });

server.on('error', err => {
  console.error('Server error:', err);
});


