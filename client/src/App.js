import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from '../src/components/Auth/SignUp';
import SignIn from '../src/components/Auth/SignIn';
import Navbar from '../src/components/Auth/Layout/Navbar';
import RecipeList from '../src/components/Auth/Layout/Recipes/RecipesList';
import FavoritesList from '../src/components/Auth/Layout/Recipes/Favorites/FavoritesList';
import GroceryList from '../src/components/Auth/Layout/Recipes/Favorites/GroceryList/GroceryList';

function App() {
  return (
    <Router>
         <Navbar />

      <div className="App">
        <Routes>
     
       <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp />} />
          
          <Route path="/recipes" element={<RecipeList/>} />
          <Route path="/favorites" element={<FavoritesList/>} />
          <Route path="/grocery-list" element={<GroceryList/>} />
          
      
      </Routes>
      </div>
    </Router>
  );
}

export default App;

