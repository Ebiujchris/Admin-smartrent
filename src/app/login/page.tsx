'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData);
      router.push('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex items-center gap-3 mb-8 group z-10">
        <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/30">
          <Shield className="h-8 w-8 text-emerald-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-foreground tracking-tight">SmartRent<span className="text-emerald-500">UG</span></span>
          <span className="text-xs font-medium text-emerald-500 uppercase tracking-widest mt-0.5">Admin Portal</span>
        </div>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-white/10 bg-card/50 backdrop-blur-xl z-10">
        <CardHeader className="space-y-2 text-center px-6 pt-8 pb-4">
          <CardTitle className="text-2xl font-bold text-foreground">Admin Access</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Enter your credentials to access the platform controls
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-6">
            {error && (
              <div className="bg-destructive/15 text-destructive border border-destructive/30 p-3 rounded-lg text-sm font-medium text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm font-medium">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@smartrent.ug" 
                required 
                value={formData.email}
                onChange={handleChange}
                className="bg-background/50 border-white/10 focus-visible:ring-emerald-500 h-11" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground text-sm font-medium">Password</Label>
                <Link href="/forgot-password" className="text-xs font-medium text-emerald-500 hover:text-emerald-400">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  required 
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-background/50 border-white/10 focus-visible:ring-emerald-500 h-11 pr-10" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-primary-foreground mt-6 h-11 text-base font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex justify-center text-xs text-muted-foreground px-6 pb-8">
          Authorized personnel only. <Link href="/register" className="ml-1 text-emerald-500 hover:underline">Setup</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
