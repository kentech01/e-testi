import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { loginUser, signupUser, clearError } from '../../store/authSlice';
import { setAuthModalOpen } from '../../store/uiSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { GradeSelection } from './GradeSelection';
import { SchoolSelection } from './SchoolSelection';
import { GraduationCap } from 'lucide-react';

type AuthStep = 'login' | 'signup' | 'grade' | 'school';

export function AuthModal() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const { isAuthModalOpen } = useSelector((state: RootState) => state.ui);
  
  const [currentStep, setCurrentStep] = useState<AuthStep>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    grade: '',
    school: ''
  });

  const handleClose = () => {
    dispatch(setAuthModalOpen(false));
    dispatch(clearError());
    setCurrentStep('login');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      grade: '',
      school: ''
    });
  };

  const handleLogin = async (email: string, password: string) => {
    await dispatch(loginUser({ email, password }));
  };

  const handleSignup = async () => {
    const { email, password, name, grade, school } = formData;
    await dispatch(signupUser({ email, password, name, grade, school }));
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'login': return 'Hyr në llogari';
      case 'signup': return 'Krijo llogari';
      case 'grade': return 'Zgjidhni klasën';
      case 'school': return 'Zgjidhni shkollën';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'login': return 'Mirë se erdhe përsëri!';
      case 'signup': return 'Filloni udhëtimin tuaj për në maturë';
      case 'grade': return 'Hapi 2 nga 3';
      case 'school': return 'Hapi 3 nga 3';
      default: return '';
    }
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'login':
        return (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentStep('signup')}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'signup':
        return (
          <SignupForm
            formData={formData}
            onUpdateData={updateFormData}
            onNext={() => setCurrentStep('grade')}
            onSwitchToLogin={() => setCurrentStep('login')}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'grade':
        return (
          <GradeSelection
            selectedGrade={formData.grade}
            onSelectGrade={(grade) => updateFormData({ grade })}
            onNext={() => setCurrentStep('school')}
            onBack={() => setCurrentStep('signup')}
            isLoading={isLoading}
          />
        );
      case 'school':
        return (
          <SchoolSelection
            selectedSchool={formData.school}
            onSelectSchool={(school) => updateFormData({ school })}
            onComplete={handleSignup}
            onBack={() => setCurrentStep('grade')}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle>{getStepTitle()}</DialogTitle>
              <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Progress indicator for multi-step signup */}
        {currentStep !== 'login' && (
          <div className="flex space-x-2 mb-6">
            <div className={`h-2 flex-1 rounded ${
              ['signup', 'grade', 'school'].includes(currentStep) ? 'bg-primary' : 'bg-muted'
            }`} />
            <div className={`h-2 flex-1 rounded ${
              ['grade', 'school'].includes(currentStep) ? 'bg-primary' : 'bg-muted'
            }`} />
            <div className={`h-2 flex-1 rounded ${
              currentStep === 'school' ? 'bg-primary' : 'bg-muted'
            }`} />
          </div>
        )}

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}