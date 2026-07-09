'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30">
            <Shield className="h-8 w-8 text-emerald-500" />
          </div>
          <span className="text-3xl font-bold tracking-tight">SmartRent<span className="text-emerald-500">UG</span></span>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Back to Login</Button>
            </Link>
          </CardContent>
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
          <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
          <CardDescription>Enter your admin email and we'll send a reset link.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-6 pb-8">
            {error && (
              <div className="bg-destructive/15 text-destructive border border-destructive/30 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@smartrent.ug"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-white/10 focus-visible:ring-emerald-500 h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 h-11 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
