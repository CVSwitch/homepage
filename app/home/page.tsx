"use client";

import { Sidebar } from "@/components/Sidebar";
import { HeroSection } from "@/components/HeroSection";
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [user, setUser] = useState(null);
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [pastResumes, setPastResumes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        // If not logged in, redirect to login page
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleUploadResume = (file: File) => {
    // console.log('Resume uploaded:', file.name);
    setPastResumes((prev) => [...prev, file.name]);
    setHasUploadedResume(true);
  };

  const handleOfferingSelect = async (selectedOption: string) => {
    if (user) {
      try {
        await completeOnboarding(user.uid, selectedOption);
      } catch (error) {
        console.error('Error saving user preference:', error);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    if (user) {
      try {
        // console.log('Resume uploaded:', file.name);

        // Save user preference for file upload
        const preference = {
          userId: user.uid,
          action: 'file_upload',
          timestamp: new Date().toISOString(),
          fileName: file.name
        };

        await saveUserPreference(preference);
      } catch (error) {
        console.error('Error saving user preference:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, <span className="text-blue-600">{user?.displayName || 'User'}</span>! 👋
          </h1>
        </div>

        <HeroSection
          user={user}
          hasUploadedResume={hasUploadedResume}
          onUploadResume={handleUploadResume}
          pastResumes={pastResumes}
          onOfferingSelect={handleOfferingSelect}
        />
      </main>
    </div>
  );
} 