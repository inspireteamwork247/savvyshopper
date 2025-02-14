
interface PriceRecord {
  itemId: string;
  price: number;
  store: string;
  date: string;
}

const PRICE_HISTORY_KEY = 'price_history';
const FAVORITES_KEY = 'favorite_items';

export const savePriceRecord = (record: PriceRecord) => {
  const history = getPriceHistory();
  history.push(record);
  localStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(history));
};

export const getPriceHistory = (itemId?: string): PriceRecord[] => {
  const history = JSON.parse(localStorage.getItem(PRICE_HISTORY_KEY) || '[]');
  if (itemId) {
    return history.filter((record: PriceRecord) => record.itemId === itemId);
  }
  return history;
};

export const toggleFavorite = (itemId: string, itemName: string, currentPrice: number, store: string) => {
  const favorites = getFavorites();
  const existingIndex = favorites.findIndex(fav => fav.id === itemId);
  
  if (existingIndex >= 0) {
    favorites.splice(existingIndex, 1);
  } else {
    favorites.push({
      id: itemId,
      name: itemName,
      currentPrice,
      store,
      lastUpdated: new Date().toLocaleDateString(),
      priceHistory: getPriceHistory(itemId),
      lowestPrice: currentPrice,
      highestPrice: currentPrice
    });
  }
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return favorites;
};

export const getFavorites = () => {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
};

export const isFavorite = (itemId: string) => {
  const favorites = getFavorites();
  return favorites.some((fav: { id: string }) => fav.id === itemId);
};
