import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="lg:hidden mr-2 text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <button className="relative p-2 text-gray-600 hover:text-primary rounded-full hover:bg-gray-100">
                <Bell size={20} />
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>

            {user && (
              <div className="ml-4 flex items-center">
                <div className="text-right hidden sm:block mr-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                  <User size={18} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;