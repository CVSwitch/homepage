"use client";

import { signInWithGoogle, auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      // Check if result exists and has the correct structure
      if (result && result.user) {
        setUser(result.user);
        // Redirect to home page after successful sign-in
        router.push('/home');
      } else {
        console.error('Invalid sign-in result:', result);
        throw new Error('Failed to get user data from sign-in');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Left side - Logo and mascot */}
      <div className="flex-1 flex items-center justify-center bg-white/80 backdrop-blur-sm p-12">
        <div className="text-center space-y-6">
          <img 
            src="/mascot/main.png" 
            alt="CVSwitch Logo" 
            className="w-48 h-48 mx-auto drop-shadow-2xl" 
          />
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-slate-700">Professional Resume Builder</h3>
            <p className="text-slate-600 text-lg">Create stunning resumes that stand out</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Content and sign-in */}
      <div className="flex-1 flex flex-col justify-center p-16 bg-white/60 backdrop-blur-sm">
        <div className="max-w-md mx-auto space-y-8">
          {/* Main heading */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-slate-800 leading-tight">
              CVSwitch
            </h1>
            <h2 className="text-2xl font-medium text-slate-600 leading-relaxed">
              Build Your Dream Resume in Minutes
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Professional templates, AI-powered optimization, and expert guidance
            </p>
          </div>

          {/* Sign-in button */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white rounded-2xl px-8 py-4 text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-white rounded-full"></div>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>

          {/* Reset button */}
          <div className="text-center">
            <button
              onClick={() => {
                // Clear any stored auth state
                auth.signOut();
                // Clear localStorage completely
                localStorage.clear();
                // Reload the page
                window.location.reload();
              }}
              className="text-base text-slate-500 hover:text-slate-700 transition-colors duration-200 underline decoration-slate-300 hover:decoration-slate-500"
            >
              Having trouble? Click here to reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
