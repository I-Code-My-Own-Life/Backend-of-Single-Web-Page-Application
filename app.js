const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const session = require('express-session');
const util = require('util');

const port = 5000;
const app = express();

// Configuring dotenv : 
dotenv.config({ path: './.env' });

const dbConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
}

const connection = mysql.createConnection(dbConfig);

const publicDirectory = path.join(__dirname, "./public");

app.use(express.static(publicDirectory));

// Adding the express-session middleware to the app : 
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Parse application/json
app.use(bodyParser.json());

app.set("view engine", "ejs");

// Main index page : 
app.get("/", (req, res) => {
    res.render("index", { name: req.session.username, email: req.session.email, password: req.session.password, age: req.session.age });
})

// Home page (Just for testing purposes) : 
app.get("/home", (req, res) => {
    if (!req.session.userId) {
        res.redirect('/');
    } else {
        res.status(200).send("You are on the home page." + req.session.username);
    }
})

// Logout page : 
app.get("/logout", (req, res) => {
    // Clear the session data and redirect to the home page
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
})

// Registering and logging in the user ( Main page ): 
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
    // If you are requesting to edit the account info : 
    else if (req.body['name-edit'] != undefined) {
        const age = req.body['age-edit'];
        const nameE = req.body['name-edit'];
        const emailE = req.body['email-edit'];
        const passwordE = req.body['password-edit'];
        // Hashing the password : 
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(passwordE, salt);
        const updateQuery = `UPDATE information SET password = '${hashedPassword}', name = '${nameE}', email = '${emailE}'  WHERE id = ${req.session.userId}`;
        connection.query(updateQuery, (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error registering user');
            }
            else {
                res.status(200).json({ status: 'success' });
                req.session.username = nameE;
                req.session.email = emailE;
                req.session.password = passwordE;
            }
        })
    }
    // If not then login the user (We will authenticate the user here ) : 
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
                            req.session.userId = results[0].id;
                            req.session.username = results[0].name;
                            req.session.email = results[0].email;
                            req.session.password = password;
                            req.session.age = results[0].age;
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
