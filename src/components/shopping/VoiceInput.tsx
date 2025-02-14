
import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Add TypeScript declarations for Web Speech API
interface IWindow extends Window {
  SpeechRecognition?: typeof webkitSpeechRecognition;
  webkitSpeechRecognition?: typeof webkitSpeechRecognition;
}

declare global {
  interface Window extends IWindow {}
}

type RecognitionInstance = any; // Using any temporarily to resolve circular reference

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
}

export const VoiceInput = ({ onVoiceInput }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<RecognitionInstance>(null);

  useEffect(() => {
    // Get the correct Speech Recognition API for the browser
    const SpeechRecognitionAPI = (window as IWindow).SpeechRecognition || (window as IWindow).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      
      recognitionInstance.onresult = (event) => {
        const text = event.results[0][0].transcript;
        onVoiceInput(text);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Failed to recognize speech. Please try again.');
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onVoiceInput]);

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!recognition) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleListening}
      className={isListening ? 'bg-red-100' : ''}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};
