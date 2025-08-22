import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SignupFormProps {
  formData: {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    grade: string;
    school: string;
  };
  onUpdateData: (updates: Partial<SignupFormProps['formData']>) => void;
  onNext: () => void;
  onSwitchToLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

const passwordRequirements = [
  { id: 'length', text: 'Të paktën 8 karaktere', check: (password: string) => password.length >= 8 },
  { id: 'uppercase', text: 'Një shkronjë të madhe', check: (password: string) => /[A-Z]/.test(password) },
  { id: 'lowercase', text: 'Një shkronjë të vogël', check: (password: string) => /[a-z]/.test(password) },
  { id: 'number', text: 'Një numër', check: (password: string) => /\d/.test(password) }
];

export function SignupForm({ 
  formData, 
  onUpdateData, 
  onNext, 
  onSwitchToLogin, 
  isLoading, 
  error 
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const passwordValidation = useMemo(() => {
    return passwordRequirements.map(req => ({
      ...req,
      isValid: req.check(formData.password)
    }));
  }, [formData.password]);

  const isPasswordValid = useMemo(() => {
    return passwordValidation.every(req => req.isValid);
  }, [passwordValidation]);

  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  }, [formData.email]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      errors.name = 'Emri është i detyrueshëm';
    }

    if (!formData.email) {
      errors.email = 'Email është i detyrueshëm';
    } else if (!isEmailValid) {
      errors.email = 'Formati i email-it nuk është valid';
    }

    if (!formData.password) {
      errors.password = 'Fjalëkalimi është i detyrueshëm';
    } else if (!isPasswordValid) {
      errors.password = 'Fjalëkalimi nuk i plotëson kërkesat';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Fjalëkalimet nuk përputhen';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    onUpdateData({ [field]: value });
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const canProceed = formData.name && formData.email && formData.password && 
                    formData.confirmPassword && isEmailValid && isPasswordValid && 
                    formData.password === formData.confirmPassword;

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Emri i plotë</Label>
        <Input
          id="name"
          type="text"
          placeholder="p.sh. Ardi Hoxha"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={validationErrors.name ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {validationErrors.name && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{validationErrors.name}</span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="emri.juaj@gmail.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={validationErrors.email ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {validationErrors.email && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{validationErrors.email}</span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Fjalëkalimi</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Krijoni një fjalëkalim të sigurt"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={validationErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>

        {/* Password Requirements */}
        {formData.password && (
          <div className="space-y-2 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Kërkesat për fjalëkalimin:</p>
            <div className="space-y-1">
              {passwordValidation.map(req => (
                <div key={req.id} className="flex items-center space-x-2">
                  {req.isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${req.isValid ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Konfirmoni fjalëkalimin</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Shkruani përsëri fjalëkalimin"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          className={validationErrors.confirmPassword ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {validationErrors.confirmPassword && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{validationErrors.confirmPassword}</span>
          </p>
        )}
      </div>

      <Button 
        onClick={handleNext} 
        className="w-full" 
        disabled={isLoading || !canProceed}
      >
        Vazhdo
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Keni llogari? </span>
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto"
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Hyni këtu
        </Button>
      </div>
    </div>
  );
}