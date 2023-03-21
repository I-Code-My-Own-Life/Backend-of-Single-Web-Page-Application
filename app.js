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
}

const dbConfig2 = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD
}

// Connecting to the tasks database : 
let connection = mysql.createConnection(dbConfig2);

// Query to create the usertasks database and the table in it : 
connection.query('CREATE DATABASE IF NOT EXISTS `usertasks`', (error, results) => {
    if (error) {
        console.log(error);
    }
    else {
        // console.log("Database was created");
        connection.query('CREATE TABLE IF NOT EXISTS `taskinformation` ( `taskid` INT NOT NULL AUTO_INCREMENT , `taskDescription` VARCHAR(100) NOT NULL , `taskDone` BOOLEAN NOT NULL , `type` VARCHAR(20) NOT NULL , PRIMARY KEY (`taskid`)) ENGINE = InnoDB', (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                // console.log("The table in the usertasks databaes was created");
            }
        })
    }
});

connection.end();

// Adding the database in the dbConfig to use : 
dbConfig2['database'] = process.env.DATABASE2;
// Again creating the connection :
connection = mysql.createConnection(dbConfig2);

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

// Loading the single html page : 
app.get("/", (req, res) => {
    // Now fetching the records from the database and sending them to the frontend so that they can be displayed in their respective columns :
    const fetchSql = "SELECT * FROM taskinformation";
    connection.query(fetchSql, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error searching tasks');
        } else {
            res.render("index", { name: req.session.username, email: req.session.email, password: req.session.password, age: req.session.age, tasks: results });
        }
    });
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
    // Connecting to the database : 
    let connection = mysql.createConnection(dbConfig);
    // Query to make table in the usertask database : 
    connection.query('CREATE DATABASE IF NOT EXISTS `login-reg`', (error, results) => {
        if (error) {
            console.log(error);
        }
        else {
            connection.query('CREATE TABLE IF NOT EXISTS `information` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(30) NOT NULL , `email` VARCHAR(30) NOT NULL , `password` VARCHAR(255) NOT NULL , `age` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB', (err, result) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    });
    connection.end();
    // Again creating the connetion to the database : 
    dbConfig['database'] = process.env.DATABASE;
    connection = mysql.createConnection(dbConfig);
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
                res.status(200).json({ status: 'error' });
            }
            else {
                res.status(200).json({ status: 'success' });
                req.session.username = nameE;
                req.session.email = emailE;
                req.session.password = passwordE;
            }
        })
    }
    // If you want to add a task :
    else if (req.body.hasOwnProperty("taskDescription")) {
        connection = mysql.createConnection(dbConfig2);
        // Checking to see if the connection was successful : 
        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL database: ' + err.stack);
            }
            // console.log('Connected to MySQL database with threadId: ' + connection.threadId);
        });
        let taskDescription = req.body['taskDescription']
        let taskDone = 'false';
        let type = req.body['type'];
        // Inserting the task description and some more things in the database :
        connection.query('INSERT INTO taskinformation (taskDescription, taskDone, type) VALUES (?, ?, ?)', [taskDescription, taskDone, type],
            (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).send('Error registering user');
                } else {
                    res.status(200).json({ status: "success" });
                }
            }
        );
    }
    // Means if you want to save if you work is done or not : 
    else if (req.body.hasOwnProperty("taskDoneArr")) {
        connection.end();
        connection = mysql.createConnection(dbConfig2);
        let arr = req.body['taskDoneArr'];
        // Looping through the array and running this update query to update all records : 
        for (let i = 0; i < arr.length; i++) {
            let currRecord = arr[i];
            const updateQuery = `UPDATE taskinformation SET taskDone = ${currRecord.checked} WHERE taskid = ${currRecord.id}`;
            connection.query(updateQuery, (err, results) => {
                if (err) {
                    // res.status(500).send("Error saving data !");
                    console.log(err);
                }
                else {
                    // console.log("Records being updated.");
                }
            })
        }
        res.json({ status: "success" });
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
