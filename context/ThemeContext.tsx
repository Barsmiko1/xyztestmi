import React, { createContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeMode, lightTheme, darkTheme } from '@/constants/theme';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: typeof lightTheme | typeof darkTheme;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  setThemeMode: () => {},
  theme: lightTheme,
  isDark: false,
});

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  // Determine if we should use dark theme
  const isDark = themeMode === 'system' 
    ? colorScheme === 'dark' 
    : themeMode === 'dark';

  // Use the appropriate theme based on dark mode
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, theme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};