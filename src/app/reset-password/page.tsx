'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) {
      router.push('/forgot-password');
    } else {
      setToken(t);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired reset token');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-2" />
            <CardTitle>Password Reset!</CardTitle>
            <CardDescription>Redirecting you to login...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <Link href="/login" className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground z-10">
        <ArrowLeft className="h-4 w-4" />
        Back to Login
      </Link>

      <div className="flex items-center gap-3 mb-8 z-10">
        <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30">
          <Shield className="h-8 w-8 text-emerald-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold tracking-tight">SmartRent<span className="text-emerald-500">UG</span></span>
          <span className="text-xs font-medium text-emerald-500 uppercase tracking-widest mt-0.5">Admin Portal</span>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-white/10 bg-card/50 backdrop-blur-xl z-10">
        <CardHeader className="text-center px-6 pt-8 pb-4">
          <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
          <CardDescription>Enter your new admin password below.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 pb-8">
            {error && (
              <div className="bg-destructive/15 text-destructive border border-destructive/30 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-white/10 focus-visible:ring-emerald-500 h-11 pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Repeat password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-background/50 border-white/10 focus-visible:ring-emerald-500 h-11"
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 h-11 font-semibold" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
