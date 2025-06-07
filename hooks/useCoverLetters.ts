import { useState, useEffect } from 'react';
import { coverLetterService } from '@/services/coverLetterService';

export function useCoverLetters(userId: string | undefined) {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoverLetters = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    try {
      const fetchedCoverLetters = await coverLetterService.getUserCoverLetters(userId);
      setCoverLetters(fetchedCoverLetters);
    } catch (error) {
      console.error('Error fetching cover letters:', error);
      setError('Failed to fetch cover letters. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCoverLetters();
    }
  }, [userId]);

  const uploadCoverLetter = async (file: File) => {
    if (!userId) return;

    setUploadLoading(true);
    setError(null);
    try {
      const newCoverLetter = await coverLetterService.uploadCoverLetter(userId, file);
      setCoverLetters(prev => [...prev, newCoverLetter]);
      return newCoverLetter;
    } catch (error) {
      console.error('Error uploading cover letter:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload cover letter');
      throw error;
    } finally {
      setUploadLoading(false);
    }
  };

  return {
    coverLetters,
    isLoading,
    uploadCoverLetter,
    uploadLoading,
    error,
    refreshCoverLetters: fetchCoverLetters,
  };
} 