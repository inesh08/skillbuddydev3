// services/onboardingStore.js
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import apiService from './apiService';

export const useOnboardingStore = create((set, get) => ({
  // State
  onboardingData: {
    name: '',
    profession: '',
    career_choices: [],
    college_name: '',
    college_email: '',
  },
  currentStep: 1,
  isLoading: false,
  error: null,
  isOnboardingComplete: false,

  // Actions
  loadOnboardingData: async () => {
    try {
      const savedData = await SecureStore.getItemAsync('onboardingData');
      if (savedData) {
        set({ onboardingData: JSON.parse(savedData) });
      }
      
      const isComplete = await SecureStore.getItemAsync('onboardingComplete');
      if (isComplete === 'true') {
        set({ isOnboardingComplete: true });
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    }
  },

  saveOnboardingData: async (data) => {
    try {
      const newData = { ...get().onboardingData, ...data };
      set({ onboardingData: newData });
      await SecureStore.setItemAsync('onboardingData', JSON.stringify(newData));
    } catch (error) {
      console.error('Error saving onboarding data:', error);
    }
  },

  updateProfileInBackend: async (profileData) => {
    set({ isLoading: true, error: null });

    try {
      const response = await apiService.updateProfile(profileData);
      console.log('Profile updated successfully:', response);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  saveStep1Data: async (name) => {
    try {
      await get().saveOnboardingData({ name });
      await get().updateProfileInBackend({ name });
      set({ currentStep: 2 });
    } catch (error) {
      console.error('Error saving step 1 data:', error);
      throw error;
    }
  },

  saveStep2Data: async (profession) => {
    try {
      await get().saveOnboardingData({ profession });
      await get().updateProfileInBackend({ profession });
      set({ currentStep: 3 });
    } catch (error) {
      console.error('Error saving step 2 data:', error);
      throw error;
    }
  },

  saveStep3Data: async (career_choices) => {
    try {
      await get().saveOnboardingData({ career_choices });
      await get().updateProfileInBackend({ career_choices });
      set({ currentStep: 4 });
    } catch (error) {
      console.error('Error saving step 3 data:', error);
      throw error;
    }
  },

  saveStep4Data: async (college_name, college_email) => {
    try {
      await get().saveOnboardingData({ college_name, college_email });
      await get().updateProfileInBackend({ college_name, college_email });
      set({ currentStep: 5 });
    } catch (error) {
      console.error('Error saving step 4 data:', error);
      throw error;
    }
  },

  completeOnboarding: async () => {
    try {
      await SecureStore.setItemAsync('onboardingComplete', 'true');
      await SecureStore.deleteItemAsync('onboardingData');
      set({ 
        isOnboardingComplete: true,
        onboardingData: {
          name: '',
          profession: '',
          career_choices: [],
          college_name: '',
          college_email: '',
        },
        currentStep: 1,
        error: null
      });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  resetOnboarding: async () => {
    try {
      await SecureStore.deleteItemAsync('onboardingData');
      await SecureStore.deleteItemAsync('onboardingComplete');
      set({ 
        onboardingData: {
          name: '',
          profession: '',
          career_choices: [],
          college_name: '',
          college_email: '',
        },
        currentStep: 1,
        error: null,
        isOnboardingComplete: false
      });
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  },

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setCurrentStep: (step) => set({ currentStep: step }),
})); 