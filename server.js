const express = require('express');
const path = require('path');
let DNARecognizer = require('./DNARecognizer');
require('dotenv').config();
const port = process.env.PORT || 8080;
const app = express();

var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));

app.get('/stats', function (req, res) {
    con.query("SELECT * FROM stats", function (err, result) {
        if (err) throw err;
        return res.send(JSON.parse(JSON.stringify(result))[0]);
    });
});


app.post('/mutant', function (req, res) {
    try {
        let arr = req.body.dna;
        let dnaRecognizer = new DNARecognizer(arr);
        let isMutant = dnaRecognizer.isMutant();
        let sql = `INSERT INTO dna (dna, dna_type) VALUES ('${JSON.stringify(arr)}', '${isMutant ? 'M' : 'H'}')`;
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        return res.status(isMutant ? 200 : 403).send("");
    } catch (e) {
        return res.status(422).send({msg: e});
    }

});

app.listen(port);

var con = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "meli"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
