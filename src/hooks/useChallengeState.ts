
import { useState, useCallback, createContext, useContext, ReactNode } from "react";

type ChallengeState = 'ready' | 'active' | 'paused' | 'completed' | 'failed' | 'verifying';

interface ChallengeStateContextType {
  state: ChallengeState;
  setState: (state: ChallengeState) => void;
  resetState: () => void;
  startChallenge: () => void;
  pauseChallenge: () => void;
  resumeChallenge: () => void;
  completeChallenge: () => void;
  failChallenge: () => void;
  startVerification: () => void;
  isActive: boolean;
  isComplete: boolean;
  isPaused: boolean;
}

const ChallengeStateContext = createContext<ChallengeStateContextType | undefined>(undefined);

export const ChallengeStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setStateInternal] = useState<ChallengeState>('ready');
  
  const setState = useCallback((newState: ChallengeState) => {
    setStateInternal(newState);
  }, []);
  
  const resetState = useCallback(() => {
    setStateInternal('ready');
  }, []);
  
  const startChallenge = useCallback(() => {
    setStateInternal('active');
  }, []);
  
  const pauseChallenge = useCallback(() => {
    setStateInternal('paused');
  }, []);
  
  const resumeChallenge = useCallback(() => {
    setStateInternal('active');
  }, []);
  
  const completeChallenge = useCallback(() => {
    setStateInternal('completed');
  }, []);
  
  const failChallenge = useCallback(() => {
    setStateInternal('failed');
  }, []);
  
  const startVerification = useCallback(() => {
    setStateInternal('verifying');
  }, []);
  
  const isActive = state === 'active';
  const isComplete = state === 'completed';
  const isPaused = state === 'paused';
  
  return (
    <ChallengeStateContext.Provider
      value={{
        state,
        setState,
        resetState,
        startChallenge,
        pauseChallenge,
        resumeChallenge,
        completeChallenge,
        failChallenge,
        startVerification,
        isActive,
        isComplete,
        isPaused,
      }}
    >
      {children}
    </ChallengeStateContext.Provider>
  );
};

export const useChallengeState = () => {
  const context = useContext(ChallengeStateContext);
  if (!context) {
    throw new Error("useChallengeState must be used within a ChallengeStateProvider");
  }
  return context;
};
