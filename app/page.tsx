"use client";

import { Sidebar } from "@/components/Sidebar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { HeroSection } from "@/components/HeroSection";
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
      setUser(result);
      
      // Redirect to home page after successful sign-in
      router.push('/home');
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome to CVSwitch</h1>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full"
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-gray-800 rounded-full"></div>
          ) : (
            <>
              <img
                src="/images/google-logo.svg"
                alt="Google logo"
                className="w-5 h-5"
              />
              Sign in with Google
            </>
          )}
        </button>
        {user && (
          <div className="mt-4 text-center">
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full mx-auto"
            />
            <p className="mt-2">{user.displayName}</p>
          </div>
        )}
        
        {/* Add reset button for connection issues */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              // Clear any stored auth state
              auth.signOut();
              // Clear localStorage completely
              localStorage.clear();
              // Reload the page
              window.location.reload();
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Having trouble? Click here to reset
          </button>
        </div>
      </div>
    </div>
  );
}
