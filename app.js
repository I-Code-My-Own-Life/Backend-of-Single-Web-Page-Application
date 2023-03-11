const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const util = require('util');


dotenv.config({ path: './.env' });

const app = express();

const port = 5000

const dbConfig = {
    host: process.env.HOST,
    user: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}

console.log(dbConfig)

const connection = mysql.createConnection(dbConfig);

const publicDirectory = path.join(__dirname, "./public");

app.use(express.static(publicDirectory));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "hbs");

app.get("/", (req, res) => {
    res.render("index");
})

app.post("/", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const age = req.body.age;
    console.log(name, email, password, age);
    connection.connect(()=>{
        console.log("The connection to the database was succesful. ");
        let sql = "INSERT INTO information(name, email, password, age) VALUES('" + name + "','" + email + "','" + password + "','" + age + "')";
        connection.query(sql,(err,data) => {
            if(err){
                console.log(err);
            }
            else{
                res.render("index");
            }
        })
    })
})


app.listen(port, () => {
    console.log(`The server has been started at port ${port}`);
});

