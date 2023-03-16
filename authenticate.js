const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require("cookie-parser");
const session = require('express-session');
const flash = require('connect-flash');
const util = require('util');

const port = 5000;
const app = express();

// Initialize and configure the session middleware : 
app.use(cookieParser());
app.use(session({
    secret: "averysecretkey",
    resave: false,
    saveUninitialized: false
}));

// Initializing the flash : 
app.use(flash());

// Initialize and configure the Passport middleware : 
app.use(passport.initialize());
app.use(passport.session());

// Our Passport strategy for local authentication : 
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return done(null, false, { status: 'email_does_not_exist' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { status: 'wrong_password' });
        }
        return done(null, user, { status: 'success' });
    } catch (err) {
        return done(err);
    }
}));

// Defining the user serializing and desializing methods : 
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

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

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Parse application/json
app.use(bodyParser.json());

app.set("view engine", "hbs");

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/home", (req, res) => {
    res.render("index");
})

// Registering and logging in the user : 

app.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/home',
    failureFlash: true
}), async (req, res) => {
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
});

// app.post("/", async (req, res) => {
//     // Registering the user :
//     const { name, email, password, age } = req.body;
//     // If the third argument is given then register the user : 
//     if (password != undefined) {
//         const saltRounds = 10;
//         const salt = await bcrypt.genSalt(saltRounds);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         // Now running the sql query : 
//         connection.query(
//             // Check if the username already exists in the database
//             'SELECT * FROM information WHERE email = ?',
//             [email],
//             (error, results) => {
//                 if (error) {
//                     console.error(error);
//                     res.status(500).send('Error registering user');
//                 } else {
//                     if (results.length > 0) {
//                         res.status(200).json({ status: 'username_taken' });
//                     } else {
//                         // Insert the user into the database
//                         connection.query(
//                             'INSERT INTO information (name, email, password, age) VALUES (?, ?, ?, ?)',
//                             [name, email, hashedPassword, age],
//                             (error, results) => {
//                                 if (error) {
//                                     console.error(error);
//                                     res.status(500).send('Error registering user');
//                                 } else {
//                                     res.status(200).json({ status: 'success' });
//                                 }
//                             }
//                         );
//                     }
//                 }
//             }
//         );
//     }
//     // If not then login the user (We will authenticate the user here ) : 
//     else {
//         const email = req.body.emailLogin;
//         const password = req.body.passwordLogin;
//         // Login functionality :
//         connection.query(
//             // Check if the email is registered in the database
//             'SELECT * FROM information WHERE email = ?',
//             [email],
//             async (error, results) => {
//                 if (error) {
//                     console.error(error);
//                     res.status(500).send('Error logging in');
//                 } else {
//                     if (results.length > 0) {
//                         // Compare the password with the hashed password in the database
//                         const isMatch = await bcrypt.compare(password, results[0].password);
//                         if (isMatch) {
//                             res.status(200).json({ status: "success" });
//                         } else {
//                             res.status(200).json({ status: "wrong_password" });
//                         }
//                     } else {
//                         res.status(200).json({ status: "email_does_not_exist" });
//                     }
//                 }
//             }
//         );
//     }
// });

app.listen(port, () => {
    console.log(`The server has been started at port ${port}`);
});
