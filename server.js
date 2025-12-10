const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "movies"
});

db.connect(err => {
    if (err) {
        console.error("Errore connessione:", err);
        return;
    }
    console.log("MySQL connesso");
});

app.listen(PORT, () =>
    console.log(`Server attivo su http://localhost:${PORT}`)
);
