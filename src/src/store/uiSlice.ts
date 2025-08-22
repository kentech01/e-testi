import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ViewType = 'dashboard' | 'tests' | 'subject-selection' | 'exam' | 'test-results' | 'tips' | 'settings';

interface UiState {
  currentView: ViewType;
  isDarkMode: boolean;
  isMobileMenuOpen: boolean;
  isAuthModalOpen: boolean;
  isLoading: boolean;
}

const initialState: UiState = {
  currentView: 'dashboard',
  isDarkMode: false,
  isMobileMenuOpen: false,
  isAuthModalOpen: false,
  isLoading: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<ViewType>) => {
      state.currentView = action.payload;
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    toggleAuthModal: (state) => {
      state.isAuthModalOpen = !state.isAuthModalOpen;
    },
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isAuthModalOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCurrentView,
  toggleDarkMode,
  setDarkMode,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleAuthModal,
  setAuthModalOpen,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;