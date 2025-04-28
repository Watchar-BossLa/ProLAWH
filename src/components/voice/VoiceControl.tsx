
import React from 'react';
import { Button } from "@/components/ui/button";
import { Volume, VolumeX } from "lucide-react";
import { useVoiceGeneration } from '@/hooks/useVoiceGeneration';

interface VoiceControlProps {
  text: string;
}

export function VoiceControl({ text }: VoiceControlProps) {
  const { isGenerating, generateVoice, playAudio, stopAudio, hasAudio } = useVoiceGeneration();

  const handleClick = async () => {
    if (!hasAudio) {
      await generateVoice(text);
    }
    playAudio();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <span className="animate-pulse">Generating...</span>
      ) : (
        <>
          {hasAudio ? <VolumeX className="mr-2" /> : <Volume className="mr-2" />}
          {hasAudio ? 'Play Voice' : 'Generate Voice'}
        </>
      )}
    </Button>
  );
}
