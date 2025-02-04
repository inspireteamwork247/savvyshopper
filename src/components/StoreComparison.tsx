import { Store, DollarSign, MapPin } from 'lucide-react';

interface StorePrice {
  storeName: string;
  price: number;
  distance: string;
}

interface StorePricesProps {
  itemName: string;
  stores: StorePrice[];
}

export const StoreComparison = ({ itemName, stores }: StorePricesProps) => {
  const sortedStores = [...stores].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedStores[0]?.price;

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Store className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Price Comparison</h2>
      </div>
      
      <h3 className="text-lg font-medium mb-3">{itemName}</h3>
      
      <div className="space-y-3">
        {sortedStores.map((store, index) => (
          <div
            key={store.storeName}
            className="p-3 rounded-lg border border-gray-200 hover:border-primary transition-colors animate-slideIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{store.storeName}</span>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className={store.price === lowestPrice ? "text-primary font-bold" : ""}>
                  ${store.price.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{store.distance}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};