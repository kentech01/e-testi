import React, { useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { GraduationCap, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignup: (email: string, password: string, name: string, grade: string, school: string) => void;
}

// Memoized school list for better performance
const kosovoSchools = [
  'Liceu i Përgjithshëm "Sami Frashëri" - Prishtinë',
  'Liceu i Përgjithshëm "Eqrem Çabej" - Prishtinë',
  'Shkolla e Mesme "Shtjefën Gjeçovi" - Prishtinë',
  'Liceu "Gjon Buzuku" - Prizren',
  'Shkolla e Mesme Teknike "7 Shtatori" - Prizren',
  'Liceu "Lidhja e Prizrenit" - Prizren',
  'Shkolla e Mesme "Bahri Haxhiu" - Ferizaj',
  'Liceu "Zenel Hajdini" - Gjilan',
  'Shkolla e Mesme "11 Marsi" - Gjakovë',
  'Liceu "Hajdar Dushi" - Pejë',
  'Shkolla e Mesme "Abdyl Frashëri" - Mitrovicë',
  'Liceu "Ukshin Hoti" - Vushtrri',
  'Shkolla e Mesme "Ismail Qemali" - Istog'
];

const passwordRequirements = [
  { id: 'length', text: 'Të paktën 8 karaktere', check: (password: string) => password.length >= 8 },
  { id: 'uppercase', text: 'Një shkronjë të madhe', check: (password: string) => /[A-Z]/.test(password) },
  { id: 'lowercase', text: 'Një shkronjë të vogël', check: (password: string) => /[a-z]/.test(password) },
  { id: 'number', text: 'Një numër', check: (password: string) => /\d/.test(password) }
];

export function AuthModal({ isOpen, onClose, onLogin, onSignup }: AuthModalProps) {
  const [currentStep, setCurrentStep] = useState<'login' | 'signup' | 'grade' | 'school'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    grade: '',
    school: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Memoized password validation
  const passwordValidation = useMemo(() => {
    return passwordRequirements.map(req => ({
      ...req,
      isValid: req.check(formData.password)
    }));
  }, [formData.password]);

  const isPasswordValid = useMemo(() => {
    return passwordValidation.every(req => req.isValid);
  }, [passwordValidation]);

  // Memoized email validation
  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(formData.email);
  }, [formData.email]);

  // Optimized form validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email është i detyrueshëm';
    } else if (!isEmailValid) {
      newErrors.email = 'Formati i email-it nuk është valid';
    }

    if (!formData.password) {
      newErrors.password = 'Fjalëkalimi është i detyrueshëm';
    } else if (currentStep === 'signup' && !isPasswordValid) {
      newErrors.password = 'Fjalëkalimi nuk i plotëson kërkesat';
    }

    if (currentStep === 'signup') {
      if (!formData.name?.trim()) {
        newErrors.name = 'Emri është i detyrueshëm';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Fjalëkalimet nuk përputhen';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, currentStep, isEmailValid, isPasswordValid]);

  // Optimized input handlers
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleLogin = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      onLogin(formData.email, formData.password);
    } catch (error) {
      toast.error('Gabim gjatë hyrjes në llogari');
    } finally {
      setIsLoading(false);
    }
  }, [formData.email, formData.password, validateForm, onLogin]);

  const handleSignup = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSignup(formData.email, formData.password, formData.name, formData.grade, formData.school);
    } catch (error) {
      toast.error('Gabim gjatë krijimit të llogarisë');
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, onSignup]);

  const resetForm = useCallback(() => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      grade: '',
      school: ''
    });
    setErrors({});
    setCurrentStep('login');
    setIsLoading(false);
    setShowPassword(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const nextStep = useCallback(() => {
    if (currentStep === 'signup' && validateForm()) {
      setCurrentStep('grade');
    } else if (currentStep === 'grade' && formData.grade) {
      setCurrentStep('school');
    }
  }, [currentStep, validateForm, formData.grade]);

  const canProceedToGrade = useMemo(() => {
    return formData.name && formData.email && formData.password && formData.confirmPassword && 
           isEmailValid && isPasswordValid && formData.password === formData.confirmPassword;
  }, [formData, isEmailValid, isPasswordValid]);

  const canCompleteSignup = useMemo(() => {
    return canProceedToGrade && formData.grade && formData.school;
  }, [canProceedToGrade, formData.grade, formData.school]);

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'login':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="emri.juaj@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
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
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
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
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <Button 
              onClick={handleLogin} 
              className="w-full" 
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Hyr në llogari
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Nuk keni llogari? </span>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setCurrentStep('signup')}
                disabled={isLoading}
              >
                Regjistrohuni këtu
              </Button>
            </div>
          </div>
        );

      case 'signup':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Emri i plotë</Label>
              <Input
                id="name"
                type="text"
                placeholder="p.sh. Ardi Hoxha"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
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
                className={errors.email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
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
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
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
                className={errors.confirmPassword ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>

            <Button 
              onClick={nextStep} 
              className="w-full" 
              disabled={isLoading || !canProceedToGrade}
            >
              Vazhdo
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Keni llogari? </span>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setCurrentStep('login')}
                disabled={isLoading}
              >
                Hyni këtu
              </Button>
            </div>
          </div>
        );

      case 'grade':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3>Zgjidhni klasën tuaj</h3>
              <p className="text-sm text-muted-foreground">
                Kjo do të na ndihmojë të personalizojmë përmbajtjen për ju
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.grade === '9' ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => handleInputChange('grade', '9')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4>Klasa 9</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Përgatitje për vitin e ardhshëm
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    Bazë
                  </Badge>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  formData.grade === '12' ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => handleInputChange('grade', '12')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4>Klasa 12</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Përgatitje për maturë
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    Avancuar
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('signup')}
                className="flex-1"
                disabled={isLoading}
              >
                Mbrapa
              </Button>
              <Button 
                onClick={nextStep} 
                className="flex-1" 
                disabled={!formData.grade || isLoading}
              >
                Vazhdo
              </Button>
            </div>
          </div>
        );

      case 'school':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3>Zgjidhni shkollën tuaj</h3>
              <p className="text-sm text-muted-foreground">
                Kjo do të na ndihmojë të krijojmë një eksperiencë të personalizuar
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">Shkolla</Label>
              <Select 
                value={formData.school} 
                onValueChange={(value) => handleInputChange('school', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Zgjidhni shkollën tuaj" />
                </SelectTrigger>
                <SelectContent>
                  {kosovoSchools.map(school => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentStep('grade')}
                className="flex-1"
                disabled={isLoading}
              >
                Mbrapa
              </Button>
              <Button 
                onClick={handleSignup} 
                className="flex-1" 
                disabled={!canCompleteSignup || isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Krijo llogari
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle>
                {currentStep === 'login' ? 'Hyr në llogari' : 
                 currentStep === 'signup' ? 'Krijo llogari' :
                 currentStep === 'grade' ? 'Zgjidhni klasën' : 'Zgjidhni shkollën'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {currentStep === 'login' ? 'Mirë se erdhe përsëri!' : 
                 currentStep === 'signup' ? 'Filloni udhëtimin tuaj për në maturë' :
                 currentStep === 'grade' ? 'Hapi 2 nga 3' : 'Hapi 3 nga 3'}
              </p>
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

        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}