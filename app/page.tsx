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
    <div className="min-h-screen flex items-stretch bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
        <img src="/mascot/main.png" alt="CVSwitch Logo" className="w-40 h-40" />
      </div>
      <div className="flex-1 flex flex-col justify-center p-8 bg-white">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">CVSwitch</h1>
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">Build Your Dream Resume in Minutes</h2>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-6 py-3 text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-600 mx-auto"
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
          ) : (
            <>
              Continue with Google
            </>
          )}
        </button>

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
