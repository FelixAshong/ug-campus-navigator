import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../services/themeService';
import * as UserService from '../services/userService';
import { UserProfile } from '../services/userService';

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('');
  
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const userProfile = await UserService.getUserProfile();
        setProfile(userProfile);
        
        // Initialize form fields
        setName(userProfile.name);
        setEmail(userProfile.email);
        setStudentId(userProfile.studentId);
        setProgram(userProfile.program);
        setYear(userProfile.year);
      } catch (error) {
        console.error('Error loading profile:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, []);
  
  const handleSave = async () => {
    try {
      // Basic validation
      if (!name.trim() || !email.trim() || !studentId.trim()) {
        Alert.alert('Error', 'Name, email and student ID are required');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
      
      // Save profile updates
      const updatedProfile = {
        name,
        email,
        studentId,
        program,
        year,
      };
      
      const success = await UserService.updateUserProfile(updatedProfile);
      
      if (success) {
        Alert.alert('Success', 'Profile updated successfully', [
          {
            text: 'OK',
            onPress: () => router.back(),
          }
        ]);
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An unexpected error occurred');
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Edit Profile</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Name</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={theme.gray}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={theme.gray}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Student ID</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
            value={studentId}
            onChangeText={setStudentId}
            placeholder="Enter your student ID"
            placeholderTextColor={theme.gray}
            keyboardType="number-pad"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Program</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
            value={program}
            onChangeText={setProgram}
            placeholder="Enter your program"
            placeholderTextColor={theme.gray}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.text }]}>Year</Text>
          <TextInput
            style={[styles.input, { color: theme.text, backgroundColor: theme.card, borderColor: theme.border }]}
            value={year}
            onChangeText={setYear}
            placeholder="Enter your year"
            placeholderTextColor={theme.gray}
            keyboardType="number-pad"
          />
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.cancelButton, { backgroundColor: theme.lightGray }]}
          onPress={() => router.back()}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSave}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 32,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 