'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useAvatarContext } from '@/context/AvatarContext';
import { useToast } from '@/context/ToastContext';
import { loginSchema, signupSchema, LoginFormData, SignupFormData } from '@/lib/validators';
import { APP_NAME } from '@/lib/constants';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, signup, isLoading } = useAuth();
  const { avatar } = useAvatarContext();
  const { showToast } = useToast();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      showToast('Welcome back!', 'success');
      router.push(avatar ? '/avatar' : '/profile');
    } catch {
      showToast('Login failed. Please try again.', 'error');
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    try {
      await signup(data.name, data.email, data.password);
      showToast('Account created! Let\'s set up your profile.', 'success');
      router.push('/profile');
    } catch {
      showToast('Signup failed. Please try again.', 'error');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-cream to-off-white">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-serif text-dark-brown mb-2">{APP_NAME}</h1>
          <p className="text-medium-brown">
            {mode === 'login' ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex bg-warm-beige rounded-xl p-1 mb-8">
          {(['login', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                mode === m
                  ? 'bg-white text-dark-brown shadow-card'
                  : 'text-medium-brown hover:text-dark-brown'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-card">
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.form
                key="login"
                onSubmit={loginForm.handleSubmit(handleLogin)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register('email')}
                />
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    error={loginForm.formState.errors.password?.message}
                    {...loginForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-medium-brown hover:text-dark-brown cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
                  Sign In
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                onSubmit={signupForm.handleSubmit(handleSignup)}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                <Input
                  label="Name"
                  placeholder="Your name"
                  error={signupForm.formState.errors.name?.message}
                  {...signupForm.register('name')}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={signupForm.formState.errors.email?.message}
                  {...signupForm.register('email')}
                />
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    error={signupForm.formState.errors.password?.message}
                    {...signupForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-medium-brown hover:text-dark-brown cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter your password"
                  error={signupForm.formState.errors.confirmPassword?.message}
                  {...signupForm.register('confirmPassword')}
                />
                <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
                  Create Account
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs text-center text-medium-brown mt-6">
          By continuing, you agree to our privacy policy. Your data is encrypted and secure.
        </p>
      </motion.div>
    </div>
  );
}
