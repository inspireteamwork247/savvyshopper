
import { Home, Tag, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="max-w-6xl mx-auto">
        <nav className="flex justify-around items-center">
          <Link
            to="/"
            className={`flex flex-col items-center p-2 ${
              isActive("/") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to="/deals"
            className={`flex flex-col items-center p-2 ${
              isActive("/deals") ? "text-primary" : "text-gray-500"
            }`}
          >
            <Tag className="w-6 h-6" />
            <span className="text-xs mt-1">Deals</span>
          </Link>
          <Link
            to="/tasks"
            className={`flex flex-col items-center p-2 ${
              isActive("/tasks") ? "text-primary" : "text-gray-500"
            }`}
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="text-xs mt-1">List</span>
          </Link>
          <Link
            to="/profile"
            className={`flex flex-col items-center p-2 ${
              isActive("/profile") ? "text-primary" : "text-gray-500"
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;
