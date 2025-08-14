import React from 'react';
import { LogOut, Calendar, Users, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'staff': return 'bg-blue-500';
      case 'student': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Settings className="w-4 h-4" />;
      case 'staff': return <Users className="w-4 h-4" />;
      case 'student': return <Calendar className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-purple-600 to-orange-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-white">College Events Portal</h1>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-white ${getRoleColor(user.role)}`}>
                  {getRoleIcon(user.role)}
                  <span className="text-sm font-medium capitalize">{user.role}</span>
                </div>
                <div className="text-white">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs opacity-75">{user.department}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}