import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  plan: 'free' | 'pro' | 'enterprise';
  invoicesCount: number;
  status: string;
  joinDate: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => { success: boolean; user?: User; error?: string };
  signup: (userData: any) => { success: boolean; user?: User; error?: string };
  logout: () => void;
  switchUser: (userId: number) => { success: boolean; user?: User; error?: string };
  updateUser: (user: User) => void;
  addUser: (userData: any) => User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize with demo users and load from localStorage
  useEffect(() => {
    const demoUsers: User[] = [
      {
        id: 1,
        name: 'Abirami Muthiah',
        email: 'abirami@cloudbasha.com',
        role: 'Admin',
        status: 'Active',
        plan: 'pro',
        invoicesCount: 8,
        joinDate: '2023-06-01',
        company: 'CloudBasha'
      },
      {
        id: 2,
        name: 'John Doe',
        email: 'john@company.com',
        role: 'User',
        status: 'Active',
        plan: 'free',
        invoicesCount: 3,
        joinDate: '2023-08-15',
        company: 'Tech Corp'
      },
      {
        id: 3,
        name: 'Sarah Wilson',
        email: 'sarah@company.com',
        role: 'Manager',
        status: 'Active',
        plan: 'pro',
        invoicesCount: 12,
        joinDate: '2023-07-20',
        company: 'Business Solutions'
      }
    ];
    
    try {
      const savedUsers = localStorage.getItem('elmvoice_users');
      const currentUser = localStorage.getItem('elmvoice_current_user');
      
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        setUsers(demoUsers);
        localStorage.setItem('elmvoice_users', JSON.stringify(demoUsers));
      }
      
      if (currentUser) {
        setUser(JSON.parse(currentUser));
        setIsAuthenticated(true);
      } else {
        // Auto-login demo user for development
        setUser(demoUsers[0]);
        setIsAuthenticated(true);
        localStorage.setItem('elmvoice_current_user', JSON.stringify(demoUsers[0]));
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
      setUsers(demoUsers);
      setUser(demoUsers[0]);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    // For demo purposes, accept any password for existing users
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('elmvoice_current_user', JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (userData: any) => {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, error: 'User already exists with this email' };
    }
    
    const newUser: User = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      company: userData.company,
      role: 'User',
      status: 'Active',
      plan: 'free',
      invoicesCount: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('elmvoice_users', JSON.stringify(updatedUsers));
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('elmvoice_current_user', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('elmvoice_current_user');
  };

  const switchUser = (userId: number) => {
    const foundUser = users.find(u => u.id === userId);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('elmvoice_current_user', JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    }
    return { success: false, error: 'User not found' };
  };

  const updateUser = (updatedUser: User) => {
    const updatedUsers = users.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('elmvoice_users', JSON.stringify(updatedUsers));
    
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
      localStorage.setItem('elmvoice_current_user', JSON.stringify(updatedUser));
    }
  };

  const addUser = (userData: any) => {
    const newUser: User = {
      id: Date.now(),
      ...userData,
      plan: userData.plan || 'free',
      invoicesCount: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('elmvoice_users', JSON.stringify(updatedUsers));
    return newUser;
  };

  const value: AuthContextType = {
    user,
    users,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    switchUser,
    updateUser,
    addUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
