import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import TabBar from '../components/TabBar';

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@ug.edu.gh',
  studentId: '10956789',
  program: 'BSc Computer Science',
  year: '3',
  avatar: null, // You can add a default avatar image here
};

const menuItems = [
  { id: 'personal', title: 'Personal Information', icon: 'person-outline' },
  { id: 'academic', title: 'Academic Records', icon: 'school-outline' },
  { id: 'settings', title: 'App Settings', icon: 'settings-outline' },
  { id: 'help', title: 'Help & Support', icon: 'help-circle-outline' },
  { id: 'feedback', title: 'Send Feedback', icon: 'chatbubble-outline' },
  { id: 'logout', title: 'Logout', icon: 'log-out-outline' },
];

export default function ProfileScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={styles.avatarContainer}>
            {userData.avatar ? (
              <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={[styles.avatarText, { color: colors.background }]}>
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
            )}
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="camera" size={16} color={colors.background} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>
            {userData.name}
          </Text>
          <Text style={[styles.userEmail, { color: colors.text + 'CC' }]}>
            {userData.email}
          </Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text + '80' }]}>
                Student ID
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {userData.studentId}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text + '80' }]}>
                Program
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {userData.program}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.text + '80' }]}>
                Year
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {userData.year}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { backgroundColor: colors.card }]}
            >
              <Ionicons 
                name={item.icon as keyof typeof Ionicons.glyphMap} 
                size={24} 
                color={item.id === 'logout' ? colors.error : colors.primary} 
              />
              <Text 
                style={[
                  styles.menuTitle, 
                  { 
                    color: item.id === 'logout' ? colors.error : colors.text 
                  }
                ]}
              >
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text + '80'} />
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
    borderBottomColor: 'rgba(0,0,0,0.1)',
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