const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const util = require('util');
dotenv.config({ path: './.env' });

const app = express();

const port = 5000;

const dbConfig = {
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    port: "5000",
    database: process.env.DATABASE,
}
const connection = mysql.createConnection(dbConfig);

let conn;
function handleDisconnect() {
    conn = mysql.createConnection(dbConfig); // Recreate the connection, since
    // the old one cannot be reused.

    conn.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    conn.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually                       // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

const db1 = connection;
const query = util.promisify(db1.query).bind(db1);
// Code for database connection : 
async function connectMySql(n, e, p, a) {
    connection.connect(async function (err, client) {
        if (err) {
            handleDisconnect();
            console.error('error connecting: ' + err);
            return;
        }
        let myquery1 = "INSERT INTO information(id, name, email, password, age) VALUES('1','" + n + "','" + e + "','" + p + "','" + a + "')";
        var newRecords = [];
        newRecords = await query(myquery1)
            .catch(err => {
                handleDisconnect();
                console.log(err);
            });
        console.log(newRecords);
    });
};

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
    // var sql = "INSERT INTO information(id, name, email, password, age) VALUES('1','" + name + "','" + email + "','" + password + "','" + age + "')";
    // connection.connect(function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         console.log("Connected");
    //         connection.query(sql, (err, data) => {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             else {
    //                 res.send("Form data inserted successfully." + data);
    //             }
    //         })
    //     }
    // });
    // db.connect((err) => {
    //     if (err) {
    //         console.log(err);
    //     }
    //     else {
    //         db.query(sql, (err, result) => {
    //             if (err) {
    //                 console.log(err);
    //             }
    //             res.send("Form data inserted successfully." + result);
    //         })
    //     }
    // })
    connectMySql(name, email, password, age);
})

app.listen(port, () => {
    console.log(`The server has been started at port ${process.env.PORT}`);
});

console.log("Hello world ! How are you ? I am going to complete this project and get a five star rating and get my buyer full marks");
