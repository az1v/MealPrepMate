const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const bcrypt = require("bcryptjs");
dotenv.config();

// MongoDB client
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Sign-up logic (No encryption or hashing)
const signUp = async (req, res) => {
  const { email, password, name } = req.body;
  const client = new MongoClient(process.env.MONGO_URI);
  if (!email || !name || !password) {
    return res.status(400).json({
        status: 400,
        message: "Email, name and password are required."
    });
}
  try {
    await client.connect();
    const db = client.db("MealPrepMate");
    const usersCollection = db.collection('users');

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user object (storing password in plain text)
    const newUser = {
      email,
      password,
      name,
      favorites: []
    };
console.log("hello")
    // Insert new user into the database
    
    const result = await usersCollection.insertOne(newUser);
    if (!result.acknowledged) {
        return res.status(500).json({
            status: 500,
            message: "Failed to create user."
        });
    }
console.log("hi")
    res.status(201).json({ message: 'User created successfully', user: { name: newUser.name, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error during sign-up', error });
  } finally {
    await client.close();
  }
};

// Login logic
const signIn = async (req, res) => {
  const { email, password } = req.body;
  const client = new MongoClient(process.env.MONGO_URI);
  if (!email) {
    return res.status(400).json({
        status: 400,
        message: "Email is required."
    });
}
  try {
    await client.connect();
    const db = client.db("MealPrepMate");
    const usersCollection = db.collection('users');

    // Find the user by email
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check if the password matches the saved password (plain text)
    if (user.password !== password) return res.status(400).json({ message: 'Invalid password' });

    res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Error during login', error });
  } finally {
    await client.close();
  }
};

module.exports = { signUp, signIn };