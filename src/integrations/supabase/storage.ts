
import { supabase } from '@/integrations/supabase/client';

// Check if chat_attachments bucket exists and create it if it doesn't
export async function ensureChatAttachmentsBucketExists() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error checking storage buckets:', error);
    return false;
  }
  
  const bucketExists = buckets?.some(bucket => bucket.name === 'chat_attachments');
  
  if (!bucketExists) {
    console.info('Creating chat_attachments bucket');
    const { error: createError } = await supabase.storage.createBucket('chat_attachments', {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    
    if (createError) {
      console.error('Error creating chat_attachments bucket:', createError);
      return false;
    }
  }
  
  return true;
}
