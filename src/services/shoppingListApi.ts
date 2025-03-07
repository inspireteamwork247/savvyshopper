
import { apiRequest } from './apiClient';

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  labels: string[];
  brand?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  created: string;
  shared?: boolean;
  collaborators?: string[];
}

// Get all user's shopping lists
export const getUserShoppingLists = async (): Promise<ShoppingList[]> => {
  return await apiRequest<ShoppingList[]>('shopping-lists');
};

// Get a specific shopping list
export const getShoppingList = async (listId: string): Promise<ShoppingList> => {
  return await apiRequest<ShoppingList>(`shopping-lists/${listId}`);
};

// Create a new shopping list
export const createShoppingList = async (name: string): Promise<ShoppingList> => {
  return await apiRequest<ShoppingList>('shopping-lists', 'POST', { name });
};

// Update a shopping list
export const updateShoppingList = async (list: ShoppingList): Promise<ShoppingList> => {
  return await apiRequest<ShoppingList>(`shopping-lists/${list.id}`, 'PUT', list);
};

// Delete a shopping list
export const deleteShoppingList = async (listId: string): Promise<void> => {
  return await apiRequest<void>(`shopping-lists/${listId}`, 'DELETE');
};

// Share a shopping list with another user
export const shareShoppingList = async (listId: string, email: string): Promise<void> => {
  return await apiRequest<void>(`shopping-lists/${listId}/share`, 'POST', { email });
};

// Add an item to a shopping list
export const addItemToList = async (
  listId: string, 
  item: Omit<ShoppingListItem, 'id'>
): Promise<ShoppingListItem> => {
  return await apiRequest<ShoppingListItem>(`shopping-lists/${listId}/items`, 'POST', item);
};

// Remove an item from a shopping list
export const removeItemFromList = async (listId: string, itemId: string): Promise<void> => {
  return await apiRequest<void>(`shopping-lists/${listId}/items/${itemId}`, 'DELETE');
};
