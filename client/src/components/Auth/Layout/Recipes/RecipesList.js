import React, { useState, useContext } from 'react';
import { UserContext } from '../../../Contexts/UserContext';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState('');
  const {currentUser} = useContext(UserContext)
  const fetchRecipes = async () => {
    const cleanedIngredients = encodeURIComponent(ingredients.trim());
  if (!cleanedIngredients) return;
    try {
      const response = await fetch(`/recipes?ingredients=${cleanedIngredients}`);
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setRecipes(data); // Assuming backend sends recipes
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  return (
    <div>
      <h2>Recipe List</h2>
      <input
        type="text"
        placeholder="Enter ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <button onClick={fetchRecipes}>Search</button>

      {ingredients && (
        <p>
          Searching for recipes with:{' '}
          <strong>{ingredients.split(',').map((ing) => ing.trim()).join(', ')}</strong>
        </p>
      )}

      <div>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.idMeal} style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
              <h3>{recipe.strMeal}</h3>
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                style={{ width: '200px', height: 'auto' }}
              />
            </div>
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </div>
    </div>
  );
};

export default RecipeList;