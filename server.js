require('dotenv').config();

const express = require('express');
const app = express();
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,        // Use values from the .env file
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306 // This is for MySQL connection
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});
app.get('/', (req, res)=>{
    res.send('welcome to my API!');
});

// ==================
// Question 1: Retrieve all patients
// ==================
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving patients:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// ==================
// Question 2: Retrieve all providers
// ==================
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error retrieving providers:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// ==================
// Question 3: Filter patients by First Name
// ==================
app.get('/patients/first_name/:first_name', (req, res) => {
  const firstName = req.params.first_name;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';

  connection.query(query, [firstName], (error, results) => {
    if (error) {
      console.error('Error retrieving patients:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// ==================
// Question 4: Retrieve providers by their specialty
// ==================
app.get('/providers/specialty/:specialty', (req, res) => {
  const specialty = req.params.specialty;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';

  connection.query(query, [specialty], (error, results) => {
    if (error) {
      console.error('Error retrieving providers:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
