import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  BackHandler,
} from 'react-native';
import ProgressBar from '../../components/atoms/ProgressBar';
import AnimatedBackground from '../../components/AnimatedBackground';
import PageLayout from '../../components/layouts/PageLayout';
import GreenButton from '../../components/atoms/GreenButton';
import { useOnboardingStore } from '../../services/onboardingStore';
import { useAuthStore } from '../../services/Zuststand';
import { useProgress } from '../../hooks/useProgress';

export default function Step2Profession({ navigation }) {
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [localError, setLocalError] = useState('');
  
  const { user } = useAuthStore();
  const { 
    onboardingData, 
    isLoading, 
    error, 
    saveStep2Data, 
    loadOnboardingData,
    setUserId,
    clearError 
  } = useOnboardingStore();
  
  const { getOnboardingProgress } = useProgress();

  useEffect(() => {
    // Set user ID in onboarding store when user is available
    if (user?.id) {
      setUserId(user.id);
    }
    
    // Load saved onboarding data (but don't pre-fill)
    loadOnboardingData();
    
    // Don't pre-select profession - start with no selection
    setSelectedProfession(null);
  }, [user?.id]);

  useEffect(() => {
    // Clear error when component mounts
    clearError();
  }, []);

  const professions = [
    { label: 'Student', icon: require('../../assets/student.png') },
    { label: 'Graduate', icon: require('../../assets/undergradute.png') },
    { label: 'Post Graduate', icon: require('../../assets/postgraduate.png') },
    { label: 'Professional', icon: require('../../assets/proffessional.png') },
    { label: 'Switch Career', icon: require('../../assets/CareerSwitch.png') },
  ];

  const handleSelect = (label) => {
    setSelectedProfession(label);
    setLocalError('');
  };

  const handleNext = async () => {
    if (!selectedProfession) {
      setLocalError('Please select a profession to continue.');
      return;
    }

    try {
      await saveStep2Data(selectedProfession);
      navigation.navigate('Step3');
    } catch (error) {
      Alert.alert(
        'Error', 
        'Failed to save your profession. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AnimatedBackground intensity="medium">
        <PageLayout message={"Where are you in your\nCareer Journey"}>
          <View style={styles.innerContainer}>
            <View style={styles.progressContainer}>
              <ProgressBar percent={getOnboardingProgress(2)} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.centerContainer}>
                <View style={styles.allOptionsContainerCentered}>
                  <View style={styles.rowWrapCentered}>
                    {professions.map((item) => (
                      <TouchableOpacity
                        key={item.label}
                        style={styles.professionItem}
                        accessible={true}
                        accessibilityLabel={`Select ${item.label}`}
                        accessibilityRole="button"
                        onPress={() => handleSelect(item.label)}
                        disabled={isLoading}
                      >
                        <View
                          style={[
                            styles.iconFrame,
                            selectedProfession === item.label
                              ? styles.iconFrameSelected
                              : styles.iconFrameDefault,
                          ]}
                        >
                          <Image source={item.icon} style={styles.icon} />
                        </View>
                        <Text style={styles.professionLabel}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {(localError || error) && (
                    <Text style={styles.errorText}>{localError || error}</Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>

          <View style={styles.buttonContainer}>
            <GreenButton
              title={isLoading ? "Saving..." : "Next"}
              onPress={handleNext}
              disabled={isLoading}
            />
            {isLoading && (
              <ActivityIndicator 
                size="small" 
                color="#00ff00" 
                style={styles.loadingIndicator}
              />
            )}
          </View>
        </PageLayout>
      </AnimatedBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 40,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  centerContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: 100, // increased from 80 to push options slightly down
  },
  allOptionsContainerCentered: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowWrapCentered: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  professionItem: {
    alignItems: 'center',
    marginHorizontal: 30,
    marginVertical: 10,
    paddingVertical: 10,
    minHeight: 120,
  },
  iconFrame: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 3,
  },
  iconFrameDefault: {
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  iconFrameSelected: {
    borderColor: '#00ff00',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  professionLabel: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  loadingIndicator: {
    marginTop: 10,
  },
});
