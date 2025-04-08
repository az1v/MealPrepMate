import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const Wrapper = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #666;
`;

const RecipeCard = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  background-color: whitesmoke;
`;

const RecipeLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  h3 {
    margin: 0;
    font-size: 1.4rem;
    color: #333;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  max-width: 250px;
  height: auto;
  border-radius: 8px;
  margin-top: 0.8rem;
`;

const RemoveButton = styled.button`
  align-self: flex-start;
  background-color: #ff3366;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  margin-top: 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #cc2952;
  }
`;

const FavoritesList = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  const removeFavorite = (idMeal) => {
    const updated = favorites.filter((recipe) => recipe.idMeal !== idMeal);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <Wrapper>
      <Heading>Your Favorite Recipes</Heading>
      {favorites.length === 0 ? (
        <Message>You haven't added any favorites yet.</Message>
      ) : (
        favorites.map((recipe) => (
          <RecipeCard key={recipe.idMeal}>
            <RecipeLink to={`/recipes/${recipe.idMeal}`}>
              <h3>{recipe.strMeal}</h3>
            </RecipeLink>
            <Thumbnail src={recipe.strMealThumb} alt={recipe.strMeal} />
            <RemoveButton onClick={() => removeFavorite(recipe.idMeal)}>
               Remove
            </RemoveButton>
          </RecipeCard>
        ))
      )}
    </Wrapper>
  );
};

export default FavoritesList;