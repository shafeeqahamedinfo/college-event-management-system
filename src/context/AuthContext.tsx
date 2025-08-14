import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_ACCOUNTS = [
  { username: 'hod', password: '000', name: 'Head of Department', department: 'Administration' },
  { username: 'staff', password: '000', name: 'Staff Admin', department: 'Administration' }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuthState({ user, isAuthenticated: true });
    }
  }, []);

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    // Check admin accounts first
    const adminAccount = ADMIN_ACCOUNTS.find(
      admin => admin.username === emailOrUsername && admin.password === password
    );

    if (adminAccount) {
      const adminUser: User = {
        id: `admin-${adminAccount.username}`,
        name: adminAccount.name,
        email: `${adminAccount.username}@college.edu`,
        password: '',
        role: 'admin',
        department: adminAccount.department,
        createdAt: new Date().toISOString()
      };
      
      setAuthState({ user: adminUser, isAuthenticated: true });
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }

    // Check registered users
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
      (u.email === emailOrUsername || u.name === emailOrUsername) && u.password === password
    );

    if (user) {
      setAuthState({ user, isAuthenticated: true });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }

    return false;
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
    localStorage.removeItem('currentUser');
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: `${userData.role}-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};