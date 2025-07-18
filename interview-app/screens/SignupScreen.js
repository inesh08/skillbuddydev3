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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../services/Zuststand';
import ConfettiAnimation from '../components/ConfettiAnimation';

export default function SignupScreen() {
  const navigation = useNavigation();
  const { signup, isLoading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const validateEmail = (email) => {
    // Stricter email regex: TLD must be 2-6 letters only
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');

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
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        navigation.navigate('Home');
        }, 2000);
      } else {
        console.log('Signup failed:', result.error);
        if (result.error && result.error.toLowerCase().includes('user already exists')) {
          Alert.alert(
            'User Already Exists',
            'An account with this email already exists. Would you like to login instead?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Go to Login', onPress: handleLogin }
            ]
          );
        } else {
          Alert.alert('Sign Up Failed', result.error || 'Please try again.');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Sign Up Failed', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const isButtonEnabled = email.trim() && password.trim() && !isLoading;

  if (showConfetti) {
    return <ConfettiAnimation successText="Account Created!" subText="Welcome to Skill Buddy" />;
  }

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

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Logo */}
              <View style={styles.googleLogoContainer}>
                <Image
                  source={require('../assets/google.png')}
                  style={styles.googleLogo}
                  resizeMode="contain"
                />
              </View>

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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666',
    fontSize: 14,
    marginHorizontal: 15,
  },
  googleLogoContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  googleLogo: {
    width: 40,
    height: 40,
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