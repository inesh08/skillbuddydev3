// screens/SignupScreen.js (No JWT Token Verification)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../services/Zuststand';

export default function SignupScreen() {
  const navigation = useNavigation();
  const { signup, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    // Validate terms agreement
    if (!agreedToTerms) {
      Alert.alert('Terms Required', 'Please agree to the terms and conditions to continue.');
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    console.log('Starting signup process...');
    console.log('Email:', email.trim());
    console.log('Password length:', password.length);

    try {
      const result = await signup(email.trim(), password);
      console.log('Signup result:', result);
      
      if (result.success) {
        console.log('Signup successful, navigating to Step1...');
        // Navigate to onboarding after successful signup
        navigation.navigate('Step1');
      } else {
        console.log('Signup failed:', result.error);
        Alert.alert('Sign Up Failed', result.error || 'Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Sign Up Failed', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const isButtonEnabled = email.trim() && password.trim() && confirmPassword.trim() && agreedToTerms && !isLoading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.centeredContent}>
              {/* Header */}
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Create Account</Text>
                <Text style={styles.subHeaderText}>Join us today</Text>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    emailError ? styles.inputError : null
                  ]}
                  placeholder="Email"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) setEmailError('');
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessible={true}
                  accessibilityLabel="Email input"
                />
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      passwordError ? styles.inputError : null
                    ]}
                    placeholder="Password"
                    placeholderTextColor="#666"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError('');
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessible={true}
                    accessibilityLabel="Password input"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    accessible={true}
                    accessibilityLabel={showPassword ? "Hide password" : "Show password"}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      confirmPasswordError ? styles.inputError : null
                    ]}
                    placeholder="Confirm Password"
                    placeholderTextColor="#666"
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (confirmPasswordError) setConfirmPasswordError('');
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    accessible={true}
                    accessibilityLabel="Confirm password input"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    accessible={true}
                    accessibilityLabel={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : null}
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setAgreedToTerms(!agreedToTerms)}
                  accessible={true}
                  accessibilityLabel="Agree to terms and conditions"
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: agreedToTerms }}
                >
                  <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                    {agreedToTerms && (
                      <Ionicons name="checkmark" size={16} color="#000" />
                    )}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text style={styles.termsLink}>Terms & Conditions</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  !isButtonEnabled && styles.signUpButtonOutline,
                ]}
                onPress={handleSignUp}
                disabled={!isButtonEnabled}
                accessible={true}
                accessibilityLabel="Create your account"
                accessibilityRole="button"
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#000" />
                    <Text style={styles.signUpButtonText}>Creating Account...</Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.signUpButtonText,
                      !isButtonEnabled && styles.signUpButtonTextOutline,
                    ]}
                  >
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginPromptText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={handleLogin}
                  accessible={true}
                  accessibilityLabel="Login to existing account"
                  accessibilityRole="button"
                >
                  <Text style={styles.loginLinkText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    justifyContent: 'flex-start',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subHeaderText: {
    color: '#ccc',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#00ff00',
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#000',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff0000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#00ff00',
    borderWidth: 2,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#000',
    fontSize: 16,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  termsContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#00ff00',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00ff00',
  },
  termsText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: '#00ff00',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#00ff00',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 0,
    borderColor: '#00ff00',
  },
  signUpButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00ff00',
  },
  signUpButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signUpButtonTextOutline: {
    color: '#00ff00',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  loginPromptText: {
    color: '#fff',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#00ff00',
    fontSize: 14,
    fontWeight: '600',
  },
});