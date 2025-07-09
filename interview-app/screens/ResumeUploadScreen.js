// screens/ResumeUploadScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../services/Zuststand';
import AnimatedBackground from '../components/AnimatedBackground';
import ResumeUpload from '../components/ResumeUpload';

export default function ResumeUploadScreen() {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuthStore();
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSuccess = (response) => {
    console.log('Resume upload successful:', response);
    setUploadSuccess(true);
    
    // Show success message
    Alert.alert(
      'Upload Successful! 🎉',
      `Your resume has been uploaded and is being processed.\n\nResume ID: ${response.resume_id}\n\nYou'll receive interview questions and job match analysis once processing is complete.`,
      [
        {
          text: 'View My Resumes',
          onPress: () => {
            // Navigate to resume list or profile
            navigation.navigate('Profile');
          }
        },
        {
          text: 'Upload Another',
          onPress: () => {
            setUploadSuccess(false);
          }
        }
      ]
    );
  };

  const handleUploadError = (error) => {
    console.error('Resume upload error:', error);
    Alert.alert(
      'Upload Failed',
      error.message || 'Failed to upload resume. Please try again.',
      [{ text: 'OK' }]
    );
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (!isAuthenticated()) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
        <AnimatedBackground intensity="medium" />
        <View style={styles.errorContainer}>
          <Ionicons name="lock-closed-outline" size={48} color="#ff0000" />
          <Text style={styles.errorText}>Please login to upload your resume.</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />
      <AnimatedBackground intensity="medium" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Ionicons name="arrow-back" size={24} color="#00ff00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Resume</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content Area */}
      <View style={styles.contentContainer}>
        {/* User Info */}
        {user && (
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoText}>
              Welcome back, {user.name || user.email}!
            </Text>
            <Text style={styles.userInfoSubtext}>
              Upload your resume to get personalized interview questions and job match analysis.
            </Text>
          </View>
        )}

        {/* Resume Upload Component */}
        <ResumeUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </View>

      {/* Success State */}
      {uploadSuccess && (
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={48} color="#00ff00" />
          <Text style={styles.successText}>Resume uploaded successfully!</Text>
          <Text style={styles.successSubtext}>
            Your resume is being processed. You'll receive interview questions and analysis soon.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingTop: 0,
    marginTop: -40, // Push entire container up
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 25, // Reduced padding to push header up
    paddingBottom: 10, // Reduced bottom padding
    backgroundColor: '#1A1A1A',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 255, 0, 0.2)',
  },
  backButton: {
    padding: 6, // Reduced padding
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 5, // Minimal top padding
  },
  userInfoContainer: {
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
    marginTop: 8, // Reduced margin
    marginBottom: 15, // Reduced margin
    padding: 12, // Reduced padding
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.3)',
  },
  userInfoText: {
    color: '#00ff00',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  userInfoSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#00ff00',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    color: '#00ff00',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  successSubtext: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
});