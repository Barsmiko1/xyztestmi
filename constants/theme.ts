export const COLORS = {
  // Primary Colors
  primary: {
    50: '#E6F3FF',
    100: '#CCE7FF',
    200: '#99CEFF',
    300: '#66B5FF',
    400: '#339DFF',
    500: '#0084FF', // Main primary color
    600: '#0069CC',
    700: '#004F99',
    800: '#003466',
    900: '#001A33',
  },

  // Secondary Colors
  secondary: {
    50: '#E6FFF9',
    100: '#CCFFF4',
    200: '#99FFE8',
    300: '#66FFDD',
    400: '#33FFD1',
    500: '#00FFC6', // Main secondary color
    600: '#00CC9E',
    700: '#009977',
    800: '#00664F',
    900: '#003328',
  },

  // Accent Colors
  accent: {
    50: '#FFF5E6',
    100: '#FFEBCC',
    200: '#FFD699',
    300: '#FFC266',
    400: '#FFAD33',
    500: '#FF9900', // Main accent color
    600: '#CC7A00',
    700: '#995C00',
    800: '#663D00',
    900: '#331F00',
  },

  // Success Colors
  success: {
    50: '#E6FFEC',
    100: '#CCFFD9',
    200: '#99FFB3',
    300: '#66FF8C',
    400: '#33FF66',
    500: '#00FF40', // Main success color
    600: '#00CC33',
    700: '#009926',
    800: '#00661A',
    900: '#00330D',
  },

  // Warning Colors
  warning: {
    50: '#FFFBE6',
    100: '#FFF7CC',
    200: '#FFEF99',
    300: '#FFE766',
    400: '#FFDF33',
    500: '#FFD700', // Main warning color
    600: '#CCAC00',
    700: '#998100',
    800: '#665600',
    900: '#332B00',
  },

  // Error Colors
  error: {
    50: '#FFE6E6',
    100: '#FFCCCC',
    200: '#FF9999',
    300: '#FF6666',
    400: '#FF3333',
    500: '#FF0000', // Main error color
    600: '#CC0000',
    700: '#990000',
    800: '#660000',
    900: '#330000',
  },

  // Neutral Colors
  gray: {
    50: '#F7F7F7',
    100: '#E6E6E6',
    200: '#CCCCCC',
    300: '#B3B3B3',
    400: '#999999',
    500: '#808080', // Main gray color
    600: '#666666',
    700: '#4D4D4D',
    800: '#333333',
    900: '#1A1A1A',
  },

  // Common Colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export type ThemeMode = 'light' | 'dark' | 'system';

export const lightTheme = {
  dark: false,
  colors: {
    primary: COLORS.primary[500],
    secondary: COLORS.secondary[500],
    accent: COLORS.accent[500],
    success: COLORS.success[500],
    warning: COLORS.warning[500],
    error: COLORS.error[500],
    background: '#F7F9FC',
    card: '#FFFFFF',
    text: COLORS.gray[900],
    textLight: COLORS.gray[500],
    border: COLORS.gray[200],
    shadow: '#000000',
    notification: COLORS.error[500],
    white: COLORS.white,
    black: COLORS.black,
    gray: COLORS.gray,
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: COLORS.primary[500],
    secondary: COLORS.secondary[500],
    accent: COLORS.accent[500],
    success: COLORS.success[500],
    warning: COLORS.warning[500],
    error: COLORS.error[500],
    background: '#121212',
    card: '#1E1E1E',
    text: COLORS.gray[100],
    textLight: COLORS.gray[400],
    border: COLORS.gray[700],
    shadow: '#000000',
    notification: COLORS.error[500],
    white: COLORS.white,
    black: COLORS.black,
    gray: COLORS.gray,
  },
};