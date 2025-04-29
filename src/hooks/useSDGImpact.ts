
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface SDGData {
  sdgNumber: number;
  name: string;
  alignment: number;
  color: string;
}

export function useSDGImpact() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sdgData, setSDGData] = useState<SDGData[]>([
    { sdgNumber: 1, name: "No Poverty", alignment: 15, color: "#E5243B" },
    { sdgNumber: 2, name: "Zero Hunger", alignment: 20, color: "#DDA63A" },
    { sdgNumber: 3, name: "Good Health", alignment: 35, color: "#4C9F38" },
    { sdgNumber: 4, name: "Quality Education", alignment: 45, color: "#C5192D" },
    { sdgNumber: 5, name: "Gender Equality", alignment: 30, color: "#FF3A21" },
    { sdgNumber: 6, name: "Clean Water", alignment: 65, color: "#26BDE2" },
    { sdgNumber: 7, name: "Clean Energy", alignment: 70, color: "#FCC30B" },
    { sdgNumber: 8, name: "Economic Growth", alignment: 40, color: "#A21942" },
    { sdgNumber: 9, name: "Industry & Innovation", alignment: 55, color: "#FD6925" },
    { sdgNumber: 10, name: "Reduced Inequalities", alignment: 25, color: "#DD1367" },
    { sdgNumber: 11, name: "Sustainable Cities", alignment: 60, color: "#FD9D24" },
    { sdgNumber: 12, name: "Responsible Consumption", alignment: 75, color: "#BF8B2E" },
    { sdgNumber: 13, name: "Climate Action", alignment: 80, color: "#3F7E44" },
    { sdgNumber: 14, name: "Life Below Water", alignment: 50, color: "#0A97D9" },
    { sdgNumber: 15, name: "Life on Land", alignment: 55, color: "#56C02B" },
    { sdgNumber: 16, name: "Peace & Justice", alignment: 20, color: "#00689D" },
    { sdgNumber: 17, name: "Partnerships for Goals", alignment: 30, color: "#19486A" }
  ]);

  useEffect(() => {
    if (user) {
      fetchUserSDGData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserSDGData = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('sdg_impact_data')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) {
        console.error('Error fetching SDG data:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Update the SDG data with the user's impact scores
        const updatedSDGData = sdgData.map(sdg => {
          const userSDG = data.find(d => d.sdg_number === sdg.sdgNumber);
          if (userSDG) {
            return {
              ...sdg,
              alignment: userSDG.impact_score
            };
          }
          return sdg;
        });
        
        setSDGData(updatedSDGData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSDGImpact = async (sdgNumber: number, newAlignment: number) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('sdg_impact_data')
        .upsert({
          user_id: user.id,
          sdg_number: sdgNumber,
          impact_score: newAlignment,
          contribution_details: {}
        }, { 
          onConflict: 'user_id,sdg_number' 
        });
      
      if (error) throw error;
      
      setSDGData(prev => 
        prev.map(sdg => 
          sdg.sdgNumber === sdgNumber 
            ? { ...sdg, alignment: newAlignment } 
            : sdg
        )
      );
      
    } catch (error) {
      console.error('Error updating SDG impact:', error);
    }
  };

  return {
    sdgData,
    isLoading,
    updateSDGImpact
  };
}
