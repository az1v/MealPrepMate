const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const cors = require('cors');
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',  // Allow frontend to access backend
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}));


// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Only save sessions when something is stored
  cookie: {
    httpOnly: true,
    secure: false, // set to true if using HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  }
}));

app.use(require('./routes/recipes'));
app.use(require('./routes/auth'));


app.get('/recipes', async (req, res) => {
  

  const pluralize = require('pluralize');
// Utility functions
function toSingular(word) {
  return pluralize.singular(word);
}

function toPlural(word) {
  return pluralize.plural(word);
}

  const { ingredients } = req.query;

  if (!ingredients) {
    return res.status(400).json({ error: 'No ingredients provided' });
  }

  const ingredientsList = ingredients
    .split(',')
    .map((i) => i.trim().toLowerCase())
    .filter(Boolean); // remove empty strings

  if (ingredientsList.length === 0) {
    return res.status(400).json({ error: 'No valid ingredients provided' });
  }

  try {
    const allResults = [];

    for (const ingredient of ingredientsList) {
      const variations = Array.from(new Set([
        ingredient,
        toSingular(ingredient),
        toPlural(ingredient)
      ]));

      const resultsForThisIngredient = [];

      for (const variant of variations) {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${variant}`);
        const data = await response.json();

        if (data.meals) {
          resultsForThisIngredient.push(...data.meals);
        }
      }

      if (resultsForThisIngredient.length === 0) {
        return res.json([]); // No matches for this ingredient
      }

      allResults.push(resultsForThisIngredient);
    }

    // Intersect by meal ID
    const commonMealIds = allResults
      .map(meals => new Set(meals.map(meal => meal.idMeal)))
      .reduce((acc, set) => {
        return new Set([...acc].filter(id => set.has(id)));
      });

    const finalMeals = allResults
      .flat()
      .filter((meal, index, self) =>
        commonMealIds.has(meal.idMeal) &&
        index === self.findIndex(m => m.idMeal === meal.idMeal)
      );

    res.json(finalMeals);
  } catch (error) {
    console.error('Error fetching from TheMealDB:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});


const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
let usersCollection;

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    usersCollection = client.db('prepmealmate').collection('users');
  })
  .catch((err) => console.log('MongoDB connection error:', err));

// SIGN UP Route (with password)
app.post('/signup', async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: 'Email, name, and password are required' });
  }

  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = { email, name, password: hashedPassword };
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// SIGN IN Route (with password)
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  console.log("Sign-in attempt:", email);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await usersCollection.findOne({ email });

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    req.session.user = { email: user.email };

    res.status(200).json({ message: 'User logged in successfully' });

  } catch (err) {
    console.error('Sign-in error:', err); // 🔥 This should now print the real issue
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
app.get('/session', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});
// SIGN OUT Route
app.post("/signout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid"); // clear cookie
    res.status(200).json({ message: "Logged out" });
  });
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'You must be logged in to perform this action' });
  }
  next();
};

// Example of a protected route (Favorites)
app.post('/favorites', isAuthenticated, async (req, res) => {
  const { email } = req.session.user; // Get email from session
  const { recipeId } = req.body;

  if (!recipeId) {
    return res.status(400).json({ message: 'Recipe ID is required' });
  }

  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favorites) user.favorites = [];
    if (!user.favorites.includes(recipeId)) {
      user.favorites.push(recipeId);
      await usersCollection.updateOne({ email }, { $set: { favorites: user.favorites } });
      return res.status(200).json({ message: 'Recipe added to favorites' });
    }

    res.status(400).json({ message: 'Recipe already in favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to favorites' });
  }
});

// Server initialization
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});