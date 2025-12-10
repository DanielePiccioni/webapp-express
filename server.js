const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;
const connection = require("./database/connection");

app.use(express.static(`public`))
app.use(express.json());

const moviesRouter = require("./routes/movies");
app.use("/movies", moviesRouter);

app.listen(PORT, () =>
    console.log(`Server attivo su http://localhost:${PORT}`)
);
app.get(`/`, (req, res) => {
    res.send(`Welcome to my blog`)
})