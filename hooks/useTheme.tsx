import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return {
    colors: context.theme.colors,
    isDark: context.isDark,
    setThemeMode: context.setThemeMode,
    themeMode: context.themeMode,
  };
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return children;
};