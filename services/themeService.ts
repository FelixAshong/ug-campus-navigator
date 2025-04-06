import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

// Storage key
const THEME_STORAGE_KEY = 'ug_campus_navigator_theme';

// Theme types
export type ThemeType = 'light' | 'dark' | 'system';
export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  accent: string;
  error: string;
  success: string;
  gray: string;
  lightGray: string;
};

// Define theme colors
export const lightTheme: ThemeColors = {
  primary: '#0056D2',    // Primary blue color for UG
  secondary: '#FFC72C',  // Secondary gold color for UG
  background: '#F9F9F9', 
  card: '#FFFFFF',
  text: '#333333',
  border: '#E0E0E0',
  notification: '#FF3B30',
  accent: '#007AFF',
  error: '#FF3B30',
  success: '#34C759',
  gray: '#8E8E93',
  lightGray: '#F2F2F7',
};

export const darkTheme: ThemeColors = {
  primary: '#1E88E5',    // Lighter blue for dark mode
  secondary: '#FFD54F',  // Lighter gold for dark mode
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#383838',
  notification: '#FF453A',
  accent: '#0A84FF',
  error: '#FF453A',
  success: '#30D158',
  gray: '#8E8E93',
  lightGray: '#2C2C2C',
};

// Save theme preference to storage
export async function saveThemePreference(theme: ThemeType): Promise<boolean> {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch (error) {
    console.error('Error saving theme preference:', error);
    return false;
  }
}

// Get theme preference from storage
export async function getThemePreference(): Promise<ThemeType> {
  try {
    const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme as ThemeType) || 'system';
  } catch (error) {
    console.error('Error getting theme preference:', error);
    return 'system';
  }
}

// Hook to get and manage theme
export function useTheme() {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = useState<ThemeType>('system');
  const [theme, setTheme] = useState<ThemeColors>(
    systemColorScheme === 'dark' ? darkTheme : lightTheme
  );
  
  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      const savedPreference = await getThemePreference();
      setThemePreference(savedPreference);
    };
    
    loadThemePreference();
  }, []);
  
  // Update theme based on preference
  useEffect(() => {
    const determineTheme = () => {
      switch (themePreference) {
        case 'light':
          setTheme(lightTheme);
          break;
        case 'dark':
          setTheme(darkTheme);
          break;
        case 'system':
        default:
          setTheme(systemColorScheme === 'dark' ? darkTheme : lightTheme);
          break;
      }
    };
    
    determineTheme();
  }, [themePreference, systemColorScheme]);
  
  // Function to toggle between light and dark
  const toggleTheme = async () => {
    const newPreference = theme === lightTheme ? 'dark' : 'light';
    await saveThemePreference(newPreference);
    setThemePreference(newPreference);
  };
  
  // Function to set a specific theme
  const setThemeMode = async (newTheme: ThemeType) => {
    await saveThemePreference(newTheme);
    setThemePreference(newTheme);
  };
  
  return {
    theme,
    isDarkMode: theme === darkTheme,
    themePreference,
    toggleTheme,
    setThemeMode,
  };
} 