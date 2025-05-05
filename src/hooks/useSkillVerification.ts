
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { VerificationMethod } from '@/types/skills';

export function useSkillVerification() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadVerificationEvidence = async (
    file: File,
    skillId: string,
    method: VerificationMethod
  ): Promise<string | null> => {
    if (!user) {
      setUploadError(new Error('You must be logged in to upload verification evidence'));
      return null;
    }

    if (!file) {
      setUploadError(new Error('No file selected'));
      return null;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      // Simulate file upload since our mock doesn't have storage
      // In a real implementation we would use:
      // const { data, error } = await supabase.storage
      //   .from('skill-verifications')
      //   .upload(`${user.id}/${skillId}/${uuidv4()}`, file)

      // Mock progress updates
      const mockUpload = async () => {
        for (let i = 0; i <= 100; i += 20) {
          setUploadProgress(i);
          await new Promise(r => setTimeout(r, 300));
        }
      };
      
      await mockUpload();
      
      // Return a mock file URL
      const mockFileUrl = `https://example.com/storage/skill-verifications/${user.id}/${skillId}/${uuidv4()}`;
      return mockFileUrl;
    } catch (err) {
      setUploadError(err instanceof Error ? err : new Error('Error uploading file'));
      console.error('Error uploading verification evidence:', err);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadVerificationEvidence,
    isUploading,
    uploadError,
    uploadProgress
  };
}
