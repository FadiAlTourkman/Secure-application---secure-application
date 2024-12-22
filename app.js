/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

// Handle user registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Success message
        } else {
            alert(data.error); // Error message
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred while registering. Please try again.");
    }
});

// Handle user login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Success message
            document.getElementById('auth').style.display = 'none';
            document.getElementById('wallet').style.display = 'block';
            document.getElementById('user').innerText = username;
            document.getElementById('balance').innerText = data.balance;
        } else {
            alert(data.error); // Error message
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred while logging in. Please try again.");
    }
});

// Handle adding funds
document.getElementById('add-funds-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = document.getElementById('amount').value;

    try {
        const response = await fetch('/add-funds', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Funds added successfully!");
            document.getElementById('balance').innerText = data.newBalance;
        } else {
            alert(data.error); // Error message
        }
    } catch (error) {
        console.error("Error adding funds:", error);
        alert("An error occurred while adding funds. Please try again.");
    }
});
