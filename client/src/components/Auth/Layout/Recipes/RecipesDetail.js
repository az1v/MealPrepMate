import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components
const Wrapper = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin: 0;
  flex: 1;
`;

const FavoriteButton = styled.button`
  background-color: transparent;
  border: 2px solid #ff3366;
  color: #ff3366;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;

  &:hover {
    background-color: #ff3366;
    color: white;
  }
`;

const Image = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  border-radius: 12px;
  margin: 1rem 0;
`;

const Info = styled.p`
  margin: 0.3rem 0;
  font-size: 1rem;
  color: #333;

  strong {
    color: #000;
  }
`;

const Instructions = styled.p`
  margin-top: 1rem;
  line-height: 1.6;
  white-space: pre-line;
`;

const IngredientList = styled.ul`
  margin-top: 1rem;
  padding-left: 1.2rem;
`;

const IngredientItem = styled.li`
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddButton = styled.button`
  background-color: #0077ff;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;

  &:hover {
    background-color: #005bd1;
  }
`;

const RecipesDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        setRecipe(data.meals[0]);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
      }
    };

    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);

    fetchRecipeDetail();
  }, [id]);

  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(`${measure} ${ingredient}`.trim());
      }
    }
    return ingredients;
  };

  const addToGroceryList = (item) => {
    const stored = JSON.parse(localStorage.getItem('groceryList')) || [];
    if (!stored.includes(item)) {
      const updated = [...stored, item];
      localStorage.setItem('groceryList', JSON.stringify(updated));
      alert(`Added "${item}" to your grocery list!`);
    } else {
      alert(`"${item}" is already in your grocery list.`);
    }
  };

  const isFavorited = () => {
    return favorites.some((fav) => fav.idMeal === recipe.idMeal);
  };

  const toggleFavorite = () => {
    let updatedFavorites;
    if (isFavorited()) {
      updatedFavorites = favorites.filter((fav) => fav.idMeal !== recipe.idMeal);
    } else {
      updatedFavorites = [...favorites, recipe];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (!recipe) return <Wrapper><p>Loading recipe...</p></Wrapper>;

  return (
    <Wrapper>
      <TitleRow>
        <Title>{recipe.strMeal}</Title>
        <FavoriteButton onClick={toggleFavorite}>
          {isFavorited() ? ' Remove from Favorites' : ' Add to Favorites'}
        </FavoriteButton>
      </TitleRow>
      <Image src={recipe.strMealThumb} alt={recipe.strMeal} />
      <Info><strong>Category:</strong> {recipe.strCategory}</Info>
      <Info><strong>Area:</strong> {recipe.strArea}</Info>
      <Instructions><strong>Instructions:</strong> {recipe.strInstructions}</Instructions>

      <h3>Ingredients:</h3>
      <IngredientList>
        {getIngredients().map((item, index) => (
          <IngredientItem key={index}>
            {item}
            <AddButton onClick={() => addToGroceryList(item)}>🛒 Add</AddButton>
          </IngredientItem>
        ))}
      </IngredientList>
    </Wrapper>
  );
};

export default RecipesDetail;