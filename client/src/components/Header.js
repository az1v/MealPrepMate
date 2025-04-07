import { NavLink, Link} from "react-router-dom"
import { useContext, useState } from "react"
import { UserContext } from "../../src/components/Contexts/UserContext"

const Header = () => {

    const { currentUser, logOut} = useContext(UserContext);

    return (
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
           
           
    
            
              {!currentUser ? (
                <>
                  <li><Link to="/signin">Sign In</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
                </>

                
              ) : (
                <><li>Hello, {currentUser.name}</li><li><Link to="/recipes">Recipes</Link></li><li><Link to="/favorites">Favorites</Link></li><li><Link to="/grocery-list">Grocery List</Link></li></>
              )}
            
          </ul>
        </nav>
      );
    };
export default Header;