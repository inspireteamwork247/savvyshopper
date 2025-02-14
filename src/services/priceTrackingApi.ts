import { toast } from 'sonner';

interface PriceRecord {
  itemId: string;
  price: number;
  store: string;
  date: string;
}

interface PriceAlert {
  itemId: string;
  targetPrice: number;
  email: string;
  active: boolean;
  created: string;
}

const PRICE_HISTORY_KEY = 'price_history';
const FAVORITES_KEY = 'favorite_items';
const PRICE_ALERTS_KEY = 'price_alerts';

export const savePriceRecord = (record: PriceRecord) => {
  const history = getPriceHistory();
  history.push(record);
  localStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(history));
  checkPriceAlerts(record);
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

export const subscribeToPriceAlert = (itemId: string, targetPrice: number, email: string) => {
  const alerts = getPriceAlerts();
  const newAlert: PriceAlert = {
    itemId,
    targetPrice,
    email,
    active: true,
    created: new Date().toISOString()
  };
  
  alerts.push(newAlert);
  localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(alerts));
  toast.success('Price alert subscription created successfully');
  return alerts;
};

export const getPriceAlerts = (itemId?: string): PriceAlert[] => {
  const alerts = JSON.parse(localStorage.getItem(PRICE_ALERTS_KEY) || '[]');
  if (itemId) {
    return alerts.filter((alert: PriceAlert) => alert.itemId === itemId);
  }
  return alerts;
};

export const unsubscribeFromPriceAlert = (itemId: string, email: string) => {
  const alerts = getPriceAlerts();
  const updatedAlerts = alerts.filter(
    alert => !(alert.itemId === itemId && alert.email === email)
  );
  localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(updatedAlerts));
  toast.success('Price alert subscription removed');
  return updatedAlerts;
};

const checkPriceAlerts = (priceRecord: PriceRecord) => {
  const alerts = getPriceAlerts(priceRecord.itemId);
  alerts.forEach(alert => {
    if (alert.active && priceRecord.price <= alert.targetPrice) {
      // In a real application, this would send an email
      console.log(`Price alert triggered for item ${priceRecord.itemId}! Current price: ${priceRecord.price}`);
      toast.info(`Price alert: Target price reached for item - ${priceRecord.price}`);
      
      // Deactivate the alert after it's triggered
      const allAlerts = getPriceAlerts();
      const updatedAlerts = allAlerts.map(a => 
        a.itemId === alert.itemId && a.email === alert.email
          ? { ...a, active: false }
          : a
      );
      localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(updatedAlerts));
    }
  });
};
