import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check if user is stored in localStorage
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    
    // Mock authentication - in production, replace with your backend API
    if (email && password) {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: {}
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      setLoading(false);
      return {};
    }
    
    setLoading(false);
    return { error: 'Invalid credentials' };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    
    // Mock registration - in production, replace with your backend API
    if (email && password) {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: {
          full_name: fullName
        }
      };
      
      setUser(mockUser);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      setLoading(false);
      return {};
    }
    
    setLoading(false);
    return { error: 'Registration failed' };
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};