import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Header({ onLogout, user }) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl">🚚</span>
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                Moving Leads Generator
              </h1>
            </div>
            <nav className="ml-6 flex space-x-1">
              <NavLink 
                to="/dashboard"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/leads"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                Leads
              </NavLink>
              <NavLink 
                to="/settings"
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                Settings
              </NavLink>
            </nav>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 text-sm text-gray-700">
              Welcome, <span className="font-semibold">{user?.name || 'User'}</span>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}