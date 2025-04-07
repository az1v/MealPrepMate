import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled Components
const Wrapper = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;

  &:focus {
    border-color: #0077ff;
  }
`;

const AddButton = styled.button`
  background-color: #0077ff;
  color: white;
  border: none;
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #005bd1;
  }
`;

const List = styled.ul`
  margin-top: 1rem;
  padding-left: 1.2rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RemoveButton = styled.button`
  background-color: transparent;
  border: 1px solid #ff3366;
  color: #ff3366;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;

  &:hover {
    background-color: #ff3366;
    color: white;
  }
`;

const ClearButton = styled.button`
  margin-top: 1.5rem;
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #d32f2f;
  }
`;

const EmptyMessage = styled.p`
  color: #777;
  font-size: 1rem;
`;

const GroceryList = () => {
  const [groceryList, setGroceryList] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('groceryList')) || [];
    setGroceryList(stored);
  }, []);

  const updateStorage = (list) => {
    setGroceryList(list);
    localStorage.setItem('groceryList', JSON.stringify(list));
  };

  const removeItem = (itemToRemove) => {
    const updated = groceryList.filter((item) => item !== itemToRemove);
    updateStorage(updated);
  };

  const clearList = () => {
    if (window.confirm('Clear entire grocery list?')) {
      updateStorage([]);
    }
  };

  const handleAddItem = () => {
    const trimmed = newItem.trim();
    if (trimmed && !groceryList.includes(trimmed)) {
      updateStorage([...groceryList, trimmed]);
      setNewItem('');
    }
  };

  return (
    <Wrapper>
      <Title>🛒 Grocery List</Title>
      <InputRow>
        <Input
          type="text"
          placeholder="Add item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <AddButton onClick={handleAddItem}>➕ Add</AddButton>
      </InputRow>

      {groceryList.length === 0 ? (
        <EmptyMessage>No items in your grocery list.</EmptyMessage>
      ) : (
        <>
          <List>
            {groceryList.map((item, index) => (
              <ListItem key={index}>
                {item}
                <RemoveButton onClick={() => removeItem(item)}>❌ Remove</RemoveButton>
              </ListItem>
            ))}
          </List>
          <ClearButton onClick={clearList}>🧹 Clear List</ClearButton>
        </>
      )}
    </Wrapper>
  );
};

export default GroceryList;