
import { createContext, useContext, ReactNode } from 'react';
import { useMentorshipFormState } from '@/hooks/mentorship/useMentorshipFormState';
import { useMentorshipFormValidation } from '@/hooks/mentorship/useMentorshipFormValidation';
import { MentorshipRequest } from '@/types/network';

interface MentorshipFormContextType {
  isSubmitting: boolean;
  submitError: string | null;
  errors: Record<string, string>;
  isValid: boolean;
  handleSubmit: (request: MentorshipRequest, onSubmit: (request: MentorshipRequest) => void | Promise<void>) => Promise<void>;
  validateForm: (request: Partial<MentorshipRequest>) => boolean;
  resetError: () => void;
  clearErrors: () => void;
}

const MentorshipFormContext = createContext<MentorshipFormContextType | undefined>(undefined);

export function useMentorshipFormContext() {
  const context = useContext(MentorshipFormContext);
  if (!context) {
    throw new Error('useMentorshipFormContext must be used within MentorshipFormProvider');
  }
  return context;
}

interface MentorshipFormProviderProps {
  children: ReactNode;
}

export function MentorshipFormProvider({ children }: MentorshipFormProviderProps) {
  const formState = useMentorshipFormState();
  const validation = useMentorshipFormValidation();

  const value = {
    ...formState,
    ...validation
  };

  return (
    <MentorshipFormContext.Provider value={value}>
      {children}
    </MentorshipFormContext.Provider>
  );
}
