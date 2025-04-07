import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipesDetail = () => {
  const { id } = useParams(); // gets idMeal from route
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          setRecipe(data.meals[0]);
        }
      } catch (error) {
        console.error('Error fetching recipe detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetail();
  }, [id]);

  if (loading) return <p>Loading recipe...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{recipe.strMeal}</h2>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} style={{ maxWidth: '400px' }} />
      <p><strong>Category:</strong> {recipe.strCategory}</p>
      <p><strong>Area:</strong> {recipe.strArea}</p>
      <p><strong>Instructions:</strong></p>
      <p>{recipe.strInstructions}</p>

      <h3>Ingredients:</h3>
      <ul>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((i) => {
          const ingredient = recipe[`strIngredient${i}`];
          const measure = recipe[`strMeasure${i}`];
          return ingredient && ingredient.trim() ? (
            <li key={i}>{ingredient} - {measure}</li>
          ) : null;
        })}
      </ul>

      {recipe.strYoutube && (
        <div>
          <h3>Video</h3>
          <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer">
            Watch on YouTube
          </a>
        </div>
      )}
    </div>
  );
};

export default RecipesDetail;