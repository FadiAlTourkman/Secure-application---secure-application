 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const dbPath = path.resolve(__dirname, 'db/wallet.sqlite');
const db = new sqlite3.Database(dbPath);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize database
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            balance INTEGER DEFAULT 0
        )
    `, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log("Database and table created successfully!");
        }
    });
});

// Endpoint: Register User
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    db.run('INSERT INTO users (username, password, balance) VALUES (?, ?, ?)', [username, password, 0], (err) => {
        if (err) {
            if (err.message.includes("UNIQUE constraint failed")) {
                console.error("Error registering user: Username already exists.");
                return res.status(409).json({ error: "Username already exists. Please choose a different one." });
            }

            console.error("Error registering user:", err.message);
            return res.status(500).json({ error: "Failed to register user due to a server error." });
        }

        res.json({ success: true, message: "User registered successfully!" });
    });
});

// Endpoint: Login User
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) {
            console.error("Error logging in user:", err.message);
            return res.status(500).json({ error: "Failed to log in." });
        }

        if (!row) {
            return res.status(404).json({ error: "Invalid username or password." });
        }

        res.json({ success: true, balance: row.balance, message: "Login successful!" });
    });
});

// Endpoint: Add Funds (Overwrites balance with new amount)
app.post('/add-funds', (req, res) => {
    const { amount } = req.body;
    const username = 'testuser'; // Replace with session or token-based logic

    if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount. Please enter a positive number." });
    }

    // Overwrite the balance with the new amount
    db.run('UPDATE users SET balance = ? WHERE username = ?', [amount, username], function (err) {
        if (err) {
            console.error("Database error while updating balance:", err.message);
            return res.status(500).json({ error: "Failed to update balance." });
        }

        db.get('SELECT balance FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                console.error("Error retrieving updated balance:", err.message);
                return res.status(500).json({ error: "Failed to retrieve updated balance." });
            }

            if (!row) {
                return res.status(404).json({ error: "User not found." });
            }

            res.json({ newBalance: row.balance });
        });
    });
});

// Start the server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


