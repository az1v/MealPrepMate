import React, { useState } from 'react';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState('');

  const fetchRecipes = async () => {
    if (!ingredients.trim()) return; // Prevent empty search
    try {
      const response = await fetch(`/search?ingredients=${ingredients}`);
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
      <div>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div key={recipe.id}>
              <h3>{recipe.name}</h3>
              <img src={recipe.image} alt={recipe.name} />
              <p>{recipe.description}</p>
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeList;