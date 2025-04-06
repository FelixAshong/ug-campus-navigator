import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

// Storage keys
const USER_PROFILE_KEY = 'ug_campus_navigator_user_profile';
const APP_SETTINGS_KEY = 'ug_campus_navigator_app_settings';

// Type definitions
export type UserProfile = {
  name: string;
  email: string;
  studentId: string;
  program: string;
  year: string;
  avatar: string | null;
};

export type AppSettings = {
  darkMode: boolean;
  offlineMode: boolean;
  notificationsEnabled: boolean;
  language: string;
};

// Default values
const defaultUserProfile: UserProfile = {
  name: 'Student',
  email: 'student@ug.edu.gh',
  studentId: '10000000',
  program: 'Not Set',
  year: '1',
  avatar: null,
};

const defaultAppSettings: AppSettings = {
  darkMode: false,
  offlineMode: false,
  notificationsEnabled: true,
  language: 'en',
};

// Get user profile
export async function getUserProfile(): Promise<UserProfile> {
  try {
    const profileJson = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return profileJson ? JSON.parse(profileJson) : defaultUserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return defaultUserProfile;
  }
}

// Update user profile
export async function updateUserProfile(profile: Partial<UserProfile>): Promise<boolean> {
  try {
    const currentProfile = await getUserProfile();
    const updatedProfile = { ...currentProfile, ...profile };
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
}

// Get app settings
export async function getAppSettings(): Promise<AppSettings> {
  try {
    const settingsJson = await AsyncStorage.getItem(APP_SETTINGS_KEY);
    return settingsJson ? JSON.parse(settingsJson) : defaultAppSettings;
  } catch (error) {
    console.error('Error getting app settings:', error);
    return defaultAppSettings;
  }
}

// Update app settings
export async function updateAppSettings(settings: Partial<AppSettings>): Promise<boolean> {
  try {
    const currentSettings = await getAppSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(updatedSettings));
    return true;
  } catch (error) {
    console.error('Error updating app settings:', error);
    return false;
  }
}

// Reset user profile
export async function resetUserProfile(): Promise<boolean> {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(defaultUserProfile));
    return true;
  } catch (error) {
    console.error('Error resetting user profile:', error);
    return false;
  }
}

// Reset app settings
export async function resetAppSettings(): Promise<boolean> {
  try {
    await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(defaultAppSettings));
    return true;
  } catch (error) {
    console.error('Error resetting app settings:', error);
    return false;
  }
}

// Pick profile image
export async function pickProfileImage(): Promise<string | null> {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Permission to access media library denied');
      return null;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      
      // Update the user profile with the new avatar
      await updateUserProfile({ avatar: imageUri });
      
      return imageUri;
    }
    
    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
}

// Check if user is logged in
export async function isUserLoggedIn(): Promise<boolean> {
  try {
    const profile = await getUserProfile();
    // Consider a user logged in if they have set their student ID to something other than default
    return profile.studentId !== defaultUserProfile.studentId;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
}

// Clear all user data (for logout)
export async function clearUserData(): Promise<boolean> {
  try {
    await AsyncStorage.multiRemove([
      USER_PROFILE_KEY,
      'ug_campus_navigator_favorites',
      'ug_campus_navigator_history',
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing user data:', error);
    return false;
  }
} 