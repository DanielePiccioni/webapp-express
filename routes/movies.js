const express = require("express");
const router = express.Router();
const db = require("../database/connection");

router.get("/", (req, res) => {
    const sql = "SELECT * FROM movies";

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results);
    });
});

router.get("/:id", (req, res) => {
    const movieId = req.params.id;
    const movieSql = "SELECT * FROM movies WHERE id = ?";
    const reviewsSql = "SELECT * FROM reviews WHERE movie_id = ?";

    db.query(movieSql, [movieId], (err, movieResult) => {
        if (err) return res.status(500).json({ error: err.message });
        if (movieResult.length === 0)

            return res.status(404).json({ error: "Film non trovato" });

        db.query(reviewsSql, [movieId], (err, reviewsResult) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
                movie: movieResult[0],
                reviews: reviewsResult
            });
        });
    });
});

module.exports = router;
