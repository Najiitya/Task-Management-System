const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());


app.get('/tasks', async (req, res) => {
    try {
        const results = await pool.query('SELECT current_database()');
        res.json({
            message: 'Connected to database successfully',
            database: results.rows[0].current_database
        });
    }
    catch(err) {
        console.error(err);
        res.status(500).json({error: 'Database connection failed'});
    }
});


app.post('/register', async (req, res) => {
  try {
    // 1. Get user data from the request body
    const { username, email, password } = req.body;

    // 2. Hash the password (encrypt it)
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 3. Insert the new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, bcryptPassword]
    );

    // 4. Send back the newly created user
    res.json(newUser.rows[0]);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error (Maybe user already exists?)" });
  }
});

app.post('/login', async (req, res) =>{
  try{
    const {email, password} = req.body;
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});