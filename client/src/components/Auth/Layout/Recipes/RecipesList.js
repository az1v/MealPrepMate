import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../Contexts/UserContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const Wrapper = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 1rem;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;

  input {
    flex: 1;
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  button {
    background-color: #0077ff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      background-color: #005bd1;
    }
  }
`;

const RecipeGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
`;

const RecipeCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  padding: 1rem;
  background-color: whitesmoke;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
`;

const RecipeTitle = styled.h3`
  margin: 0.5rem 0;
  font-size: 1.1rem;
`;

const ButtonBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
  }
`;

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState('');
  const [favorites, setFavorites] = useState([]);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(stored);
  }, []);

  const fetchRecipes = async () => {
    const cleanedIngredients = encodeURIComponent(ingredients.trim());
    if (!cleanedIngredients) return;

    try {
      const response = await fetch(`/recipes?ingredients=${cleanedIngredients}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  const isFavorited = (idMeal) => favorites.some((fav) => fav.idMeal === idMeal);

  const toggleFavorite = (recipe) => {
    const exists = isFavorited(recipe.idMeal);
    const updatedFavorites = exists
      ? favorites.filter((fav) => fav.idMeal !== recipe.idMeal)
      : [...favorites, recipe];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <Wrapper>
      <h1>Recipe List</h1>
      <SearchBar>
        <input
          type="text"
          placeholder="Enter ingredients (e.g. chicken, rice)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button onClick={fetchRecipes}>Search</button>
      </SearchBar>

      {ingredients && (
        <p>
          Showing results for: <strong>{ingredients.split(',').map((i) => i.trim()).join(', ')}</strong>
        </p>
      )}

      <RecipeGrid>
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.idMeal}>
              <Link to={`/recipes/${recipe.idMeal}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <RecipeImage src={recipe.strMealThumb} alt={recipe.strMeal} />
                <RecipeTitle>{recipe.strMeal}</RecipeTitle>
              </Link>
              <ButtonBar>
                <button onClick={() => toggleFavorite(recipe)}>
                  {isFavorited(recipe.idMeal) ? '❌' : '❤️'}
                </button>
              </ButtonBar>
            </RecipeCard>
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </RecipeGrid>
    </Wrapper>
  );
};

export default RecipeList;