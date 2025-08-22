import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToSignup: () => void;
  isLoading: boolean;
  error: string | null;
}

export function LoginForm({ onLogin, onSwitchToSignup, isLoading, error }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.email) {
      errors.email = 'Email është i detyrueshëm';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Formati i email-it nuk është valid';
    }
    
    if (!formData.password) {
      errors.password = 'Fjalëkalimi është i detyrueshëm';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(formData.email, formData.password);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
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
        <Label htmlFor="password">Fjalëkalimi</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Shkruani fjalëkalimin tuaj"
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
        {validationErrors.password && (
          <p className="text-sm text-red-500 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>{validationErrors.password}</span>
          </p>
        )}
      </div>

      <Button 
        type="submit"
        className="w-full" 
        disabled={isLoading || !formData.email || !formData.password}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Hyr në llogari
      </Button>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Nuk keni llogari? </span>
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto"
          onClick={onSwitchToSignup}
          disabled={isLoading}
        >
          Regjistrohuni këtu
        </Button>
      </div>
    </form>
  );
}