import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './components/layout/AppRoutes';
import { ThemeProvider } from './components/layout/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import './styles/globals.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <AppRoutes />
          </Suspense>
          <Toaster />
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;