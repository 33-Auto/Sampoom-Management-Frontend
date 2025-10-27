import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  active?: boolean;
}

interface NavigationTabsProps {
  navItems: NavItem[];
  moduleColor: string;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ navItems, moduleColor }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/factory' || path === '/warehouse' || path === '/production' || path === '/hrm') {
      return location.pathname.startsWith(path) && !location.pathname.includes('/dashboard');
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-6">
        <div className="flex space-x-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`px-4 py-3 text-sm font-medium rounded-t-lg transition-colors relative ${
                isActive(item.path)
                  ? `${moduleColor} text-white`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <i className={`${item.icon} mr-2`}></i>
              {item.label}
              {isActive(item.path) && (
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${moduleColor}`}></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationTabs;


