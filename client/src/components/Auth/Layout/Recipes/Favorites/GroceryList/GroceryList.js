import React, { useState } from 'react';
import { UserContext } from '../../../../../Contexts/UserContext';
const GroceryList = () => {
    const [groceryList, setGroceryList] = useState([]);
    const [newItem, setNewItem] = useState('');

    // Add new item to grocery list
    const handleAddItem = () => {
        if (newItem.trim() !== '') {
            setGroceryList([...groceryList, newItem]);
            setNewItem(''); // Clear input field
        }
    };

    // Remove item from grocery list
    const handleRemoveItem = (item) => {
        setGroceryList(groceryList.filter((grocery) => grocery !== item));
    };

    return (
        <div>
            <h2>Grocery List</h2>
            <div>
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add an item"
                />
                <button onClick={handleAddItem}>Add</button>
            </div>
            <ul>
                {groceryList.length > 0 ? (
                    groceryList.map((item, index) => (
                        <li key={index}>
                            {item}{' '}
                            <button onClick={() => handleRemoveItem(item)}>Remove</button>
                        </li>
                    ))
                ) : (
                    <p>Your grocery list is empty.</p>
                )}
            </ul>
        </div>
    );
};

export default GroceryList;