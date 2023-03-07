const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({path:'./.env'});

const app = express();

const port = 5000;

const db = mysql.createConnection({
    host: process.env.HOST,
    user:  process.env.USERNAME,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    database:process.env.DATABASE
});

const publicDirectory = path.join(__dirname,"./public");


db.connect((err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("The database is connected.");
    }
})

app.use(express.static(publicDirectory));

app.set("view engine","hbs");

app.get("/",(req,res) => {
    // res.sendFile(__dirname +"/index.html");
    // res.send("Home page");
    res.render("index");
})

app.listen(port,()=>{
    console.log(`The server has been started at port ${process.env.PORT}`);
});

console.log("Hello world ! How are you ? I am going to complete this project and get a five star rating and get my buyer full marks");




