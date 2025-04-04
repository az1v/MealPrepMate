import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../../Contexts/UserContext';

// Function to fetch favorite meals for a user
const fetchFavorites = async (email) => {
    const response = await fetch(`/favorites?email=${email}`);
    const data = await response.json();
    return data;
};

// Function to remove a meal from favorites
const removeFromFavorites = async (email, mealId) => {
    await fetch(`/favorites/${mealId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
};

const FavoriteList = () => {
    const { currentUser } = useContext(UserContext);
    const [favorites, setFavorites] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        const getFavorites = async () => {
            try {
                const data = await fetchFavorites(currentUser.email);
                setFavorites(data);
            } catch (err) {
                setError('Error fetching favorite meals');
            }
        };

        getFavorites();
    }, [currentUser]);

    const handleRemoveFavorite = async (mealId) => {
        try {
            await removeFromFavorites(currentUser.email, mealId);
            setFavorites(favorites.filter((meal) => meal.idMeal !== mealId)); // Update UI
        } catch (err) {
            setError('Error removing favorite meal');
        }
    };

    if (!currentUser) {
        return <p>Please log in to see your favorite meals.</p>;
    }

    return (
        <div>
            <h2>Your Favorite Meals</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {favorites.length > 0 ? (
                    favorites.map((meal) => (
                        <li key={meal.idMeal}>
                            <p>{meal.strMeal}</p>
                            <button onClick={() => handleRemoveFavorite(meal.idMeal)}>
                                Remove from Favorites
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No favorite meals found.</p>
                )}
            </ul>
        </div>
    );
};

export default FavoriteList;