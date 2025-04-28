
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useVoiceGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const generateVoice = async (text: string) => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('voice-generation', {
        body: { text }
      });

      if (error) throw error;

      const audioElement = new Audio(`data:audio/wav;base64,${data.audio}`);
      setAudio(audioElement);
      return audioElement;
    } catch (error) {
      console.error('Error generating voice:', error);
      toast({
        title: 'Voice Generation Failed',
        description: 'Failed to generate voice output. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = () => {
    if (audio) {
      audio.play();
    }
  };

  const stopAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return {
    isGenerating,
    generateVoice,
    playAudio,
    stopAudio,
    hasAudio: !!audio
  };
}
