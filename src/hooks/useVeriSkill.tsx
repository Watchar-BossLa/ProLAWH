
import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { VeriSkillPlatformConfig, SkillPassport, GigOpportunity } from '@/types/veriskill';

interface VeriSkillContextType {
  isConnected: boolean;
  isPending: boolean;
  error: Error | null;
  config: VeriSkillPlatformConfig | null;
  userSkillPassport: SkillPassport | null;
  availableGigs: GigOpportunity[];
  connectWallet: (did?: string) => Promise<void>;
  disconnectWallet: () => void;
  refreshSkills: () => Promise<void>;
  getLatestGigs: () => Promise<GigOpportunity[]>;
}

const VeriSkillContext = createContext<VeriSkillContextType>({
  isConnected: false,
  isPending: false,
  error: null,
  config: null,
  userSkillPassport: null,
  availableGigs: [],
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshSkills: async () => {},
  getLatestGigs: async () => []
});

export const VeriSkillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [config, setConfig] = useState<VeriSkillPlatformConfig | null>(null);
  const [userSkillPassport, setUserSkillPassport] = useState<SkillPassport | null>(null);
  const [availableGigs, setAvailableGigs] = useState<GigOpportunity[]>([]);

  // Initialize with mock data for demonstration
  useEffect(() => {
    if (user) {
      // In a real integration, this would be loaded from the VeriSkill API
      setConfig({
        apiEndpoint: 'https://api.veriskill.network',
        embedMode: true,
        features: {
          wallet: true,
          marketplace: true,
          credentials: true,
          payments: true
        }
      });
      
      // Simulate loading delay
      setIsPending(true);
      setTimeout(() => {
        setIsPending(false);
      }, 1500);
    } else {
      // Reset state when user logs out
      setIsConnected(false);
      setUserSkillPassport(null);
      setConfig(null);
    }
  }, [user]);

  const connectWallet = async (did?: string) => {
    try {
      setIsPending(true);
      
      // Simulate API call to connect wallet
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would communicate with the VeriSkill platform
      setIsConnected(true);
      
      // Mock data for demo purposes
      setUserSkillPassport({
        did: did || `did:key:z${Math.random().toString(36).substring(2, 15)}`,
        credentials: [],
        skills: [
          {
            name: 'React',
            level: 'advanced',
            verificationStatus: 'verified',
            credentialIds: []
          },
          {
            name: 'TypeScript',
            level: 'intermediate',
            verificationStatus: 'pending',
            credentialIds: []
          }
        ],
        profile: {
          name: user?.email?.split('@')[0] || 'VeriSkill User',
        }
      });
      
      toast({
        title: 'Wallet Connected',
        description: 'Your digital identity wallet is now connected to VeriSkill Network',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to connect wallet'));
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: 'Could not connect to VeriSkill Network',
      });
    } finally {
      setIsPending(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setUserSkillPassport(null);
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected from VeriSkill Network',
    });
  };

  const refreshSkills = async () => {
    try {
      setIsPending(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real implementation, this would fetch updated skills from the platform
      if (userSkillPassport) {
        setUserSkillPassport({
          ...userSkillPassport,
          skills: [
            ...userSkillPassport.skills,
            {
              name: 'Python',
              level: 'beginner',
              verificationStatus: 'unverified',
              credentialIds: []
            }
          ]
        });
      }
      
      toast({
        title: 'Skills Refreshed',
        description: 'Your skill passport has been updated',
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh skills'));
      toast({
        variant: 'destructive',
        title: 'Refresh Failed',
        description: 'Could not update your skill passport',
      });
    } finally {
      setIsPending(false);
    }
  };

  const getLatestGigs = async () => {
    try {
      setIsPending(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock gig data for demo purposes
      const mockGigs: GigOpportunity[] = [
        {
          id: 'gig-1',
          title: 'React Developer for E-commerce Platform',
          description: 'We need a skilled React developer to help build our e-commerce platform',
          requiredSkills: ['React', 'TypeScript', 'Redux'],
          budget: {
            amount: 2000,
            currency: 'USDC'
          },
          duration: {
            estimatedHours: 80,
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          client: {
            id: 'client-1',
            name: 'TechShop Inc.',
            rating: 4.8
          },
          location: {
            type: 'remote',
            timezone: ['UTC-5', 'UTC-4']
          },
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'gig-2',
          title: 'Python Backend Developer',
          description: 'Looking for a Python developer to build APIs for our mobile app',
          requiredSkills: ['Python', 'FastAPI', 'PostgreSQL'],
          budget: {
            amount: 1500,
            currency: 'USDC'
          },
          duration: {
            estimatedHours: 60
          },
          client: {
            id: 'client-2',
            name: 'MobileApps Ltd',
            rating: 4.5
          },
          location: {
            type: 'hybrid',
            country: 'Kenya'
          },
          status: 'open',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setAvailableGigs(mockGigs);
      return mockGigs;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch gigs'));
      toast({
        variant: 'destructive',
        title: 'Fetch Failed',
        description: 'Could not load latest opportunities',
      });
      return [];
    } finally {
      setIsPending(false);
    }
  };

  return (
    <VeriSkillContext.Provider
      value={{
        isConnected,
        isPending,
        error,
        config,
        userSkillPassport,
        availableGigs,
        connectWallet,
        disconnectWallet,
        refreshSkills,
        getLatestGigs
      }}
    >
      {children}
    </VeriSkillContext.Provider>
  );
};

export const useVeriSkill = () => useContext(VeriSkillContext);

// Add this provider to App.tsx later if we want to use the context globally
