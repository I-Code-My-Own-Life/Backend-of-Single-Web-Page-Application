const express = require("express");
const mysql = require("mysql");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const util = require('util');
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

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Parse application/json
app.use(bodyParser.json());

app.set("view engine", "hbs");

app.get("/", (req, res) => {
    res.render("index");
})

// app.post('/', async (req, res) => {
//     const { name, email, password, age } = req.body;

//     try {
//         const result = await connection.query(
//             'INSERT INTO information (name, email, password, age) VALUES (?, ?, ?, ?)',
//             [name, email, password, age]
//         );
//         res.json({ status: 'success' });
//     } catch (error) {
//         if (error.code === 'ER_DUP_ENTRY') {
//             res.json({ status: 'username_taken' });
//         } else {
//             console.error(error);
//             res.json({ status: 'error' });
//         }
//     }
// });

app.post("/", async (req, res) => {
    const { name, email, password, age } = req.body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if the username already exists in the database
    connection.query(
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
});


// app.post("/", async (req, res) => {
//     const { name, email, password, age } = req.body;

//     // Check if email already exists in the database
//     connection.query(
//         'SELECT COUNT(*) as count FROM information WHERE email = ?',
//         [email],
//         async (error, results) => {
//             if (error) {
//                 console.error(error);
//                 res.status(500).send('Error checking user information');
//             } else {
//                 const count = results[0].count;
//                 if (count > 0) {
//                     // Email already registered
//                     res.status(400).send('Email already registered');
//                 } else {
//                     // Hash the password
//                     const saltRounds = 10;
//                     const salt = await bcrypt.genSalt(saltRounds);
//                     const hashedPassword = await bcrypt.hash(password, salt);

//                     // Insert the user into the database
//                     connection.query(
//                         'INSERT INTO information (name, email, password, age) VALUES (?, ?, ?, ?)',
//                         [name, email, hashedPassword, age],
//                         (error, results) => {
//                             if (error) {
//                                 console.error(error);
//                                 res.status(500).json({ success: false });
//                             } else {
//                                 res.status(200).json({ success: true });
//                             }
//                         }
//                     );
//                 }
//             }
//         }
//     );
// });

// Login functionality :
//     const { username, password } = req.body;
//   // Check if the user exists in the database
//   connection.query(
//     'SELECT * FROM users WHERE username = ? OR email = ?',
//     [username, username],
//     async (error, results) => {
//       if (error) {
//         console.error(error);
//         res.status(500).send('Error logging in');
//       } else {
//         if (results.length > 0) {
//           // Compare the password with the hashed password in the database
//           const isMatch = await bcrypt.compare(password, results[0].password);
//           if (isMatch) {
//             res.status(200).send('Login successful');
//           } else {
//             res.status(401).send('Invalid credentials');
//           }
//         } else {
//           res.status(401).send('Invalid credentials');
//         }
//       }
//     }
//   );



app.listen(port, () => {
    console.log(`The server has been started at port ${port}`);
});




































// app.post("/", async (req, res) => {
//     const { name, email, password, age } = req.body;

//     try {
//         const saltRounds = 10;
//         const salt = await bcrypt.genSalt(saltRounds);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         connection.query(
//             'INSERT INTO information (name, email, password, age) VALUES (?, ?, ?, ?)',
//             [name, email, hashedPassword, age],
//             (error, results) => {
//                 if (error) {
//                     console.error(error);
//                     res.status(500).json({ success: false });
//                 } else {
//                     res.status(200).json({ success: true });
//                 }
//             }
//         );
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false });
//     }
// });