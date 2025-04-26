import { useState, useEffect } from 'react';
import { resumeService } from '@/services/resumeService';
import type { Resume } from '@/types/resume';

export function useResumes(userId: string | undefined) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setResumes([]);
      return;
    }
    
    fetchResumes(userId);
  }, [userId]);

  const fetchResumes = async (uid: string) => {
    try {
      setIsLoading(true);
      const fetchedResumes = await resumeService.getUserResumes(uid);
      setResumes(fetchedResumes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch resumes'));
      console.error('Error fetching resumes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadResume = async (file: File) => {
    if (!userId) return;
    
    try {
      setUploadLoading(true);
      const response = await resumeService.uploadResume(userId, file);
      fetchResumes(userId); // Refresh resumes after upload
      // setResumes(prev => [newResume, ...prev]);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to upload resume'));
      console.error('Error uploading resume:', err);
    } finally {
      setUploadLoading(false);
    }
  };

  return { 
    resumes, 
    isLoading, 
    uploadLoading, 
    error, 
    uploadResume,
    refreshResumes: () => userId && fetchResumes(userId)
  };
} 