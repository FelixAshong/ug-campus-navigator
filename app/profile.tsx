import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TabBar from '../components/TabBar';
import { useTheme } from '../services/themeService';
import * as UserService from '../services/userService';
import { UserProfile, AppSettings } from '../services/userService';

const menuItems = [
  { id: 'personal', title: 'Personal Information', icon: 'person-outline' },
  { id: 'academic', title: 'Academic Records', icon: 'school-outline' },
  { id: 'settings', title: 'App Settings', icon: 'settings-outline' },
  { id: 'help', title: 'Help & Support', icon: 'help-circle-outline' },
  { id: 'feedback', title: 'Send Feedback', icon: 'chatbubble-outline' },
  { id: 'logout', title: 'Logout', icon: 'log-out-outline' },
];

export default function ProfileScreen() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user profile and app settings
    const loadData = async () => {
      setLoading(true);
      try {
        const profile = await UserService.getUserProfile();
        const settings = await UserService.getAppSettings();
        setUserProfile(profile);
        setAppSettings(settings);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle menu item clicks
  const handleMenuItemPress = async (id: string) => {
    switch (id) {
      case 'personal':
        // Navigate to personal info edit screen
        router.push('/edit-profile');
        break;
      case 'settings':
        handleSettingsPress();
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        Alert.alert(
          'Feature Coming Soon',
          `The ${id.replace('-', ' ')} feature will be available in the next update.`
        );
    }
  };

  const handleSettingsPress = () => {
    // Show settings options
    Alert.alert(
      'App Settings',
      'Choose an option',
      [
        {
          text: `${isDarkMode ? 'Light' : 'Dark'} Mode`,
          onPress: async () => {
            toggleTheme();
          },
        },
        {
          text: `${appSettings?.notificationsEnabled ? 'Disable' : 'Enable'} Notifications`,
          onPress: async () => {
            if (appSettings) {
              const updated = await UserService.updateAppSettings({
                notificationsEnabled: !appSettings.notificationsEnabled
              });
              if (updated) {
                setAppSettings({
                  ...appSettings, 
                  notificationsEnabled: !appSettings.notificationsEnabled
                });
              }
            }
          },
        },
        {
          text: `${appSettings?.offlineMode ? 'Disable' : 'Enable'} Offline Mode`,
          onPress: async () => {
            if (appSettings) {
              const updated = await UserService.updateAppSettings({
                offlineMode: !appSettings.offlineMode
              });
              if (updated) {
                setAppSettings({
                  ...appSettings, 
                  offlineMode: !appSettings.offlineMode
                });
              }
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await UserService.clearUserData();
            // Reset user profile to default
            const defaultProfile = await UserService.getUserProfile();
            setUserProfile(defaultProfile);
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          },
        },
      ]
    );
  };

  const handleChangeProfileImage = async () => {
    try {
      const imageUri = await UserService.pickProfileImage();
      if (imageUri && userProfile) {
        setUserProfile({
          ...userProfile,
          avatar: imageUri,
        });
      }
    } catch (error) {
      console.error('Error changing profile image:', error);
      Alert.alert('Error', 'Failed to update profile image. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
        </View>

        {userProfile && (
          <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
            <View style={styles.avatarContainer}>
              {userProfile.avatar ? (
                <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.avatarText, { color: theme.background }]}>
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
              )}
              <TouchableOpacity 
                style={[styles.editButton, { backgroundColor: theme.primary }]}
                onPress={handleChangeProfileImage}
              >
                <Ionicons name="camera" size={16} color={theme.background} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.userName, { color: theme.text }]}>
              {userProfile.name}
            </Text>
            <Text style={[styles.userEmail, { color: theme.text + 'CC' }]}>
              {userProfile.email}
            </Text>

            <View style={styles.infoContainer}>
              <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
                <Text style={[styles.infoLabel, { color: theme.text + '80' }]}>
                  Student ID
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {userProfile.studentId}
                </Text>
              </View>
              <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
                <Text style={[styles.infoLabel, { color: theme.text + '80' }]}>
                  Program
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {userProfile.program}
                </Text>
              </View>
              <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
                <Text style={[styles.infoLabel, { color: theme.text + '80' }]}>
                  Year
                </Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {userProfile.year}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { backgroundColor: theme.card }]}
              onPress={() => handleMenuItemPress(item.id)}
            >
              <Ionicons 
                name={item.icon as keyof typeof Ionicons.glyphMap} 
                size={24} 
                color={item.id === 'logout' ? theme.error : theme.primary} 
              />
              <Text 
                style={[
                  styles.menuTitle, 
                  { 
                    color: item.id === 'logout' ? theme.error : theme.text 
                  }
                ]}
              >
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.text + '80'} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <TabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 16,
  },
  infoContainer: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuContainer: {
    margin: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuTitle: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
  },
}); 