import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from '../src/components/Auth/SignUp';
import SignIn from '../src/components/Auth/SignIn';
import Header from '../src/components/Header';
import RecipeList from '../src/components/Auth/Layout/Recipes/RecipesList';
import FavoritesList from '../src/components/Auth/Layout/Recipes/Favorites/FavoritesList';
import GroceryList from '../src/components/Auth/Layout/Recipes/Favorites/GroceryList/GroceryList';
import Home from "./components/Home";
import RecipesDetail from '../src/components/Auth/Layout/Recipes/RecipesDetail'; // Adjust path as needed
function App() {
  return (
    <Router>
         <Header />

      <div className="App">
        <Routes>
     
        <Route path="/" element={<Home/>} />
       <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp />} />
          <Route path="/recipes" element={<RecipeList/>} />
          <Route path="/recipes/:id" element={<RecipesDetail />} />
          <Route path="/favorites" element={<FavoritesList/>} />
          <Route path="/grocery-list" element={<GroceryList/>} />
          
      
      </Routes>
      </div>
    </Router>
  );
}

export default App;

