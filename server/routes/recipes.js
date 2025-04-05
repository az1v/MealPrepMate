const express = require('express');
const { getRecipesByIngredients, toggleFavorite } = require('../controllers/recipesController');

const router = express.Router();

// Fetch recipes based on ingredients
router.get('/search', getRecipesByIngredients);

  

// Toggle favorite status for a recipe (requires email)
router.post('/favorites', toggleFavorite);

module.exports = router;

