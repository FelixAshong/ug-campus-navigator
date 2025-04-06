import { useColorScheme } from 'react-native';

// Define the theme colors
const lightTheme = {
  colors: {
    primary: '#3498db',  // Blue
    background: '#ffffff',
    card: '#f5f5f5',
    text: '#333333',
    border: '#e0e0e0',
    notification: '#ff3b30',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
  },
};

const darkTheme = {
  colors: {
    primary: '#3498db',  // Blue
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#2c2c2c',
    notification: '#ff453a',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
  },
};

// Hook to get the current theme
export function useTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkTheme : lightTheme;
} 