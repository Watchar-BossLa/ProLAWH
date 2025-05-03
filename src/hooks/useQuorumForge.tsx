
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Orchestrator } from '../quorumforge/core/Orchestrator';
import { A2AHub } from '../quorumforge/communication/A2AHub';
import { runSwarm } from '../quorumforge/core/SwarmWrapper';

interface QuorumForgeContextType {
  scheduleTask: (task: string, context?: Record<string, any>) => Promise<string>;
  getTaskStatus: (taskId: string) => any;
  runParallel: <T, R>(tasks: T[], processor: (task: T) => Promise<R>, concurrency?: number) => Promise<(R | Error)[]>;
  registerAgent: (agentId: string) => void;
  sendMessage: (from: string, to: string, content: any) => string;
  listenToMessages: (agentId: string, handler: (message: any) => void) => () => void;
}

const QuorumForgeContext = createContext<QuorumForgeContextType | null>(null);

export const QuorumForgeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orchestrator] = useState(() => Orchestrator.getInstance());
  const [hub] = useState(() => A2AHub.getInstance());
  
  const scheduleTask = async (task: string, context: Record<string, any> = {}) => {
    return await orchestrator.scheduleTask(task, context);
  };
  
  const getTaskStatus = (taskId: string) => {
    return orchestrator.getTaskStatus(taskId);
  };
  
  const runParallel = async <T, R>(
    tasks: T[], 
    processor: (task: T) => Promise<R>, 
    concurrency: number = 4
  ) => {
    return await runSwarm(tasks, processor, concurrency);
  };
  
  const registerAgent = (agentId: string) => {
    hub.registerAgent(agentId);
  };
  
  const sendMessage = (from: string, to: string, content: any) => {
    return hub.sendMessage(from, to, content);
  };
  
  const listenToMessages = (agentId: string, handler: (message: any) => void) => {
    return hub.addMessageHandler(agentId, handler);
  };
  
  const value = {
    scheduleTask,
    getTaskStatus,
    runParallel,
    registerAgent,
    sendMessage,
    listenToMessages
  };
  
  return (
    <QuorumForgeContext.Provider value={value}>
      {children}
    </QuorumForgeContext.Provider>
  );
};

export const useQuorumForge = () => {
  const context = useContext(QuorumForgeContext);
  if (!context) {
    throw new Error('useQuorumForge must be used within a QuorumForgeProvider');
  }
  return context;
};
