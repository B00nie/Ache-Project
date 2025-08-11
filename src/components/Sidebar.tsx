import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  LogOut, 
  Settings, 
  Calendar, 
  Users, 
  FileText,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  
  const navItems = [
    { icon: LayoutDashboard, text: 'Dashboard', path: '/dashboard' },
    { icon: Package, text: 'Análise de Embalagens', path: '/analise-embalagens' },
    { icon: Calendar, text: 'Calendário', path: '/calendario' },
    { icon: FileText, text: 'Relatórios', path: '/relatorios' },
    { icon: Users, text: 'Equipe', path: '/equipe' },
    { icon: Settings, text: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity z-20 lg:hidden ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-md transition-all duration-300 z-30 
                  ${isOpen ? 'w-64' : 'w-0 lg:w-20'} lg:relative`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            {isOpen ? (
              <div className="flex items-center">
                <div className="bg-primary rounded-md p-2 text-white mr-2">
                  <LayoutDashboard size={20} />
                </div>
                <h2 className="font-bold text-gray-800 text-lg">Cronograma</h2>
              </div>
            ) : (
              <div className="mx-auto bg-primary rounded-md p-2 text-white">
                <LayoutDashboard size={20} />
              </div>
            )}
            
            <button
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center py-3 px-4 ${
                        isActive
                          ? 'bg-primary bg-opacity-10 text-primary border-r-4 border-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                      } transition-colors ${!isOpen ? 'justify-center' : ''}`
                    }
                  >
                    <item.icon size={20} className={`${!isOpen ? 'mx-auto' : 'mr-3'}`} />
                    {isOpen && <span>{item.text}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {isOpen && user && (
            <div className="border-t p-4">
              <div className="flex items-center mb-2">
                <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            <button
              onClick={logout}
              className={`flex items-center text-gray-700 hover:text-primary ${
                !isOpen ? 'justify-center w-full' : ''
              }`}
            >
              <LogOut size={20} className={`${!isOpen ? 'mx-auto' : 'mr-3'}`} />
              {isOpen && <span>Sair</span>}
            </button>
          </div>
        </div>
      </aside>
      
      {/* Toggle button for larger screens */}
      <button
        className="hidden lg:flex fixed bottom-6 left-6 z-30 rounded-full bg-primary text-white p-2 shadow-lg hover:bg-primary-light"
        onClick={toggleSidebar}
      >
        <ChevronRight
          size={20}
          className={`transform transition-transform ${!isOpen ? 'rotate-180' : ''}`}
        />
      </button>
    </>
  );
};

export default Sidebar;