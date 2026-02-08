const pool = require('../database');

const getArtists = (req, res) => {
    pool.query('SELECT * FROM artists;'), (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    }
};

module.exports = {
    getArtists,
};