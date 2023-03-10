const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const util = require('util');
const passport = require('passport');
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;
const session = require('express-session');
dotenv.config({ path: './.env' });

const app = express();
const port = 5000
const dbConfig = {
    host: process.env.HOST,
    user: "root",
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
}
console.log(dbConfig)
const connection = mysql.createConnection(dbConfig);

const publicDirectory = path.join(__dirname, "./public");

app.use(express.static(publicDirectory));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure passport local strategy
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        // Check if the email is registered in the database
        connection.query(
            'SELECT * FROM information WHERE email = ?',
            [email],
            async (error, results) => {
                if (error) {
                    console.error(error);
                    return done(error);
                } else {
                    if (results.length > 0) {
                        // Compare the password with the hashed password in the database
                        const isMatch = await bcrypt.compare(password, results[0].password);
                        if (isMatch) {
                            return done(null, results[0]);
                        } else {
                            return done(null, false, { message: 'Incorrect password.' });
                        }
                    } else {
                        return done(null, false, { message: 'Email does not exist.' });
                    }
                }
            }
        );
    }
));


// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Parse application/json
app.use(bodyParser.json());

app.set("view engine", "hbs");

app.get("/", (req, res) => {
    res.render("index");
})

app.post("/", async (req, res) => {
    // Registering the user :
    const { name, email, password, age } = req.body;
    // If the third argument is given then register the user : 
    if (password != undefined) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Now running the sql query : 
        connection.query(
            // Check if the username already exists in the database
            'SELECT * FROM information WHERE email = ?',
            [email],
            (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Error registering user');
                } else {
                    if (results.length > 0) {
                        res.status(200).json({ status: 'username_taken' });
                    } else {
                        // Insert the user into the database
                        connection.query(
                            'INSERT INTO information (name, email, password, age) VALUES (?, ?, ?, ?)',
                            [name, email, hashedPassword, age],
                            (error, results) => {
                                if (error) {
                                    console.error(error);
                                    res.status(500).send('Error registering user');
                                } else {
                                    res.status(200).json({ status: 'success' });
                                }
                            }
                        );
                    }
                }
            }
        );
    }
    // If not then login the user : 
    else {
        const email = req.body.emailLogin;
        const password = req.body.passwordLogin;
        // Login functionality :
        connection.query(
            // Check if the email is registered in the database
            'SELECT * FROM information WHERE email = ?',
            [email],
            async (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Error logging in');
                } else {
                    if (results.length > 0) {
                        // Compare the password with the hashed password in the database
                        const isMatch = await bcrypt.compare(password, results[0].password);
                        if (isMatch) {
                            res.status(200).json({ status: "success" });
                        } else {
                            res.status(200).json({ status: "wrong_password" });
                        }
                    } else {
                        res.status(200).json({ status: "email_does_not_exist" });
                    }
                }
            }
        );
    }
});

app.listen(port, () => {
    console.log(`The server has been started at port ${port}`);
});

