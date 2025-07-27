/**
 * Enterprise Authentication Page
 * Comprehensive login/signup with security features
 */

import React, { useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEnterpriseAuth } from '@/components/auth/EnterpriseAuthProvider';
import { logger } from '@/utils/logger/Logger';
import { ENV } from '@/config/environment';
import { Loader2, Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import type { SignInCredentials, SignUpCredentials } from '@/types/auth';

export default function EnterpriseAuthPage() {
  const { 
    signIn, 
    signUp, 
    isLoading, 
    isAuthenticated, 
    error, 
    clearError 
  } = useEnterpriseAuth();
  
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign In Form State
  const [signInForm, setSignInForm] = useState<SignInCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });

  // Sign Up Form State
  const [signUpForm, setSignUpForm] = useState<SignUpCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    acceptTerms: false
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Clear errors when switching tabs
  const clearValidationErrors = () => {
    setValidationErrors({});
    clearError();
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const validateSignInForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!signInForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signInForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!signInForm.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignUpForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!signUpForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!signUpForm.password) {
      errors.password = 'Password is required';
    } else if (signUpForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signUpForm.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!signUpForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (signUpForm.password !== signUpForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!signUpForm.fullName?.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!signUpForm.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignInForm()) return;

    await logger.info('Sign in form submitted', { email: signInForm.email }, 'EnterpriseAuthPage');
    
    const { error } = await signIn(signInForm);
    
    if (error) {
      await logger.warn('Sign in failed from form', { 
        email: signInForm.email, 
        errorType: error.type 
      }, 'EnterpriseAuthPage');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignUpForm()) return;

    await logger.info('Sign up form submitted', { email: signUpForm.email }, 'EnterpriseAuthPage');
    
    const { error } = await signUp(signUpForm);
    
    if (error) {
      await logger.warn('Sign up failed from form', { 
        email: signUpForm.email, 
        errorType: error.type 
      }, 'EnterpriseAuthPage');
    }
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['hsl(var(--destructive))', 'hsl(var(--destructive))', 'hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--success))'];
    
    return {
      strength,
      label: labels[Math.min(strength, 4)],
      color: colors[Math.min(strength, 4)]
    };
  };

  const passwordStrength = getPasswordStrength(signUpForm.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">{ENV.APP_NAME}</h1>
          </div>
          <p className="text-muted-foreground">
            Enterprise-grade professional development platform
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin" onClick={clearValidationErrors}>
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" onClick={clearValidationErrors}>
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Error Display */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                      className={validationErrors.email ? 'border-destructive' : ''}
                      disabled={isLoading}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-destructive">{validationErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={signInForm.password}
                        onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                        className={validationErrors.password ? 'border-destructive pr-10' : 'pr-10'}
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
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-sm text-destructive">{validationErrors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={signInForm.rememberMe}
                      onCheckedChange={(checked) => 
                        setSignInForm(prev => ({ ...prev, rememberMe: checked as boolean }))
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember-me" className="text-sm">
                      Remember me
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpForm.fullName}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className={validationErrors.fullName ? 'border-destructive' : ''}
                      disabled={isLoading}
                    />
                    {validationErrors.fullName && (
                      <p className="text-sm text-destructive">{validationErrors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                      className={validationErrors.email ? 'border-destructive' : ''}
                      disabled={isLoading}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-destructive">{validationErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={signUpForm.password}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                        className={validationErrors.password ? 'border-destructive pr-10' : 'pr-10'}
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
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {signUpForm.password && (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-300"
                              style={{ 
                                width: `${(passwordStrength.strength / 5) * 100}%`,
                                backgroundColor: passwordStrength.color
                              }}
                            />
                          </div>
                          <span className="text-xs" style={{ color: passwordStrength.color }}>
                            {passwordStrength.label}
                          </span>
                        </div>
                      </div>
                    )}
                    {validationErrors.password && (
                      <p className="text-sm text-destructive">{validationErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={signUpForm.confirmPassword}
                        onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={validationErrors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-sm text-destructive">{validationErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="accept-terms"
                        checked={signUpForm.acceptTerms}
                        onCheckedChange={(checked) => 
                          setSignUpForm(prev => ({ ...prev, acceptTerms: checked as boolean }))
                        }
                        disabled={isLoading}
                        className="mt-0.5"
                      />
                      <Label htmlFor="accept-terms" className="text-sm leading-relaxed">
                        I agree to the{' '}
                        <a href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </a>
                      </Label>
                    </div>
                    {validationErrors.acceptTerms && (
                      <p className="text-sm text-destructive">{validationErrors.acceptTerms}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Protected by enterprise-grade security</p>
          <p>Version {ENV.APP_VERSION} • {ENV.NODE_ENV}</p>
        </div>
      </div>
    </div>
  );
}