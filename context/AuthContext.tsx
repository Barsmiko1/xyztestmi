import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { api } from '@/lib/api';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  referralCode: string;
  virtualAccount?: {
    id: number;
    accountNumber: string;
    bankCode: string;
    bankName: string;
    accountName: string;
    currency: string;
    balance: number;
    active: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (usernameOrEmail: string, password: string) => Promise<boolean>;
  signUp: (userData: any) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Store key for secure storage
const TOKEN_KEY = 'auth-token';

// Create the context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => {},
  refreshUser: async () => {},
});

// Memory fallback for web (SecureStore is not available on web)
let memoryStorage: Record<string, string> = {};

// Helper function to handle storage across platforms
const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return memoryStorage[key] || null;
    }
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      memoryStorage[key] = value;
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      delete memoryStorage[key];
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is authenticated on initial load
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await secureStorage.getItem(TOKEN_KEY);
        
        if (storedToken) {
          setToken(storedToken);
          api.setAuthToken(storedToken);
          await fetchUserProfile();
        }
      } catch (error) {
        console.error('Failed to load authentication token', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  // Fetch user profile using the token
  const fetchUserProfile = async (): Promise<void> => {
    try {
      const response = await api.get('/api/users/me');
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        // If we can't get the profile, the token might be invalid
        await signOut();
      }
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      await signOut();
    }
  };

  // Sign in function
  const signIn = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', {
        usernameOrEmail,
        password,
      });

      if (response.success && response.data.accessToken) {
        const authToken = response.data.accessToken;
        await secureStorage.setItem(TOKEN_KEY, authToken);
        setToken(authToken);
        api.setAuthToken(authToken);
        await fetchUserProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (userData: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.success;
    } catch (error) {
      console.error('Registration failed', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await secureStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      api.clearAuthToken();
      router.replace('/(auth)');
    } catch (error) {
      console.error('Sign out failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh user profile
  const refreshUser = async (): Promise<void> => {
    if (token) {
      await fetchUserProfile();
    }
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};