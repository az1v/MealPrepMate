const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

// MongoDB client
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Fetch recipes based on ingredients
const getRecipesByIngredients = async (req, res) => {
  const { ingredients } = req.query;

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
    const data = await response.json();

    if (data.meals) {
      res.json(data.meals);
    } else {
      res.status(404).json({ message: 'No recipes found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
};

// Add or remove recipes from favorites
const toggleFavorite = async (req, res) => {
  const { email, recipeId } = req.body;

  try {
    const db = client.db();
    const usersCollection = db.collection('users');

    // Find the user by email
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const favorites = user.favorites || [];
    const index = favorites.indexOf(recipeId);

    if (index === -1) {
      // Add recipe to favorites
      favorites.push(recipeId);
    } else {
      // Remove recipe from favorites
      favorites.splice(index, 1);
    }

    // Update the user's favorites
    await usersCollection.updateOne(
      { email },
      { $set: { favorites } }
    );

    res.json({ message: 'Favorites updated', favorites });
  } catch (error) {
    res.status(500).json({ message: 'Error updating favorites', error });
  }
};

module.exports = { getRecipesByIngredients, toggleFavorite };