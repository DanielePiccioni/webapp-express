const express = require("express");
const router = express.Router();
const db = require("../database/connection");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

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

router.post("/:id/reviews", upload.single("image"), (req, res) => {
    const movieId = req.params.id;
    const { name, text, vote } = req.body;
    const image = req.file ? "/uploads/" + req.file.filename : null;
    const sql = `
        INSERT INTO reviews (movie_id, name, text, vote, image)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [movieId, name, text, vote, image], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
            review: {
                id: result.insertId,
                movie_id: movieId,
                name,
                text,
                vote,
                image
            }
        });
    });
});


module.exports = router;
