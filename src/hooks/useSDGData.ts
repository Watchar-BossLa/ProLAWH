
import { useMemo } from 'react';
import { useGreenSkills, GreenSkill } from '@/hooks/useGreenSkills';

export interface SDGData {
  sdgNumber: number;
  name: string;
  alignment: number;
  color: string;
}

export function useSDGData() {
  const { data: greenSkills = [] } = useGreenSkills();
  
  const sdgData = useMemo(() => {
    const sdgDefinitions: SDGData[] = [
      { sdgNumber: 1, name: "No Poverty", alignment: 0, color: "#e5243b" },
      { sdgNumber: 2, name: "Zero Hunger", alignment: 0, color: "#dda63a" },
      { sdgNumber: 3, name: "Good Health", alignment: 0, color: "#4c9f38" },
      { sdgNumber: 4, name: "Quality Education", alignment: 0, color: "#c5192d" },
      { sdgNumber: 5, name: "Gender Equality", alignment: 0, color: "#ff3a21" },
      { sdgNumber: 6, name: "Clean Water", alignment: 0, color: "#26bde2" },
      { sdgNumber: 7, name: "Clean Energy", alignment: 0, color: "#fcc30b" },
      { sdgNumber: 8, name: "Good Jobs", alignment: 0, color: "#a21942" },
      { sdgNumber: 9, name: "Innovation", alignment: 0, color: "#fd6925" },
      { sdgNumber: 10, name: "Reduced Inequalities", alignment: 0, color: "#dd1367" },
      { sdgNumber: 11, name: "Sustainable Cities", alignment: 0, color: "#fd9d24" },
      { sdgNumber: 12, name: "Responsible Consumption", alignment: 0, color: "#bf8b2e" },
      { sdgNumber: 13, name: "Climate Action", alignment: 0, color: "#3f7e44" },
      { sdgNumber: 14, name: "Life Below Water", alignment: 0, color: "#0a97d9" },
      { sdgNumber: 15, name: "Life On Land", alignment: 0, color: "#56c02b" },
      { sdgNumber: 16, name: "Peace & Justice", alignment: 0, color: "#00689d" },
      { sdgNumber: 17, name: "Partnerships", alignment: 0, color: "#19486a" }
    ];
    
    // Calculate SDG alignment based on green skills
    const updatedSdgData = [...sdgDefinitions];
    
    // Map green skill categories to SDGs (simplified example)
    const categoryToSDGs: Record<string, number[]> = {
      'Energy Efficiency': [7, 9, 11, 13],
      'Sustainable Agriculture': [2, 12, 15],
      'Water Management': [6, 14],
      'Circular Economy': [8, 9, 12],
      'Clean Technology': [7, 9, 13],
      'Biodiversity Conservation': [14, 15],
      'Carbon Management': [13],
      'Sustainable Transport': [11, 13],
      'Green Building': [11, 13],
      'Waste Management': [11, 12],
      'Sustainable Finance': [8, 17],
      'Climate Policy': [13, 17],
      'Environmental Education': [4, 17]
    };
    
    // Count skill category occurrences
    const categoryCount: Record<string, number> = {};
    greenSkills.forEach(skill => {
      categoryCount[skill.category] = (categoryCount[skill.category] || 0) + 1;
    });
    
    // Update SDG alignment based on skill categories
    Object.entries(categoryCount).forEach(([category, count]) => {
      const sdgNumbers = categoryToSDGs[category] || [];
      sdgNumbers.forEach(sdgNum => {
        const sdgIndex = updatedSdgData.findIndex(item => item.sdgNumber === sdgNum);
        if (sdgIndex >= 0) {
          // Increment alignment percentage based on skill count
          updatedSdgData[sdgIndex].alignment += Math.min(count * 15, 25);
        }
      });
    });
    
    // Ensure alignments don't exceed 100%
    updatedSdgData.forEach(sdg => {
      sdg.alignment = Math.min(sdg.alignment, 100);
    });
    
    return updatedSdgData;
  }, [greenSkills]);
  
  return sdgData;
}
