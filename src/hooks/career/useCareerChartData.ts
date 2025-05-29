
import { useMemo } from 'react';
import { CareerRecommendation } from '@/hooks/useCareerTwin';

export function useCareerChartData(recommendations: CareerRecommendation[]) {
  const typeData = useMemo(() => {
    const types = recommendations.reduce((acc, rec) => {
      acc[rec.type] = (acc[rec.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(types).map(([name, value]) => {
      let displayName;
      
      switch (name) {
        case 'skill_gap':
          displayName = 'Skill Development';
          break;
        case 'job_match':
          displayName = 'Job Opportunities';
          break;
        case 'mentor_suggest':
          displayName = 'Mentorship';
          break;
        default:
          displayName = name;
      }
      
      return { name: displayName, value };
    });
  }, [recommendations]);

  const statusData = useMemo(() => {
    const stats = recommendations.reduce((acc, rec) => {
      acc[rec.status] = (acc[rec.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Implemented', value: stats.implemented || 0, color: '#10b981' },
      { name: 'Accepted', value: stats.accepted || 0, color: '#3b82f6' },
      { name: 'Pending', value: stats.pending || 0, color: '#f59e0b' },
      { name: 'Rejected', value: stats.rejected || 0, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [recommendations]);

  return { typeData, statusData };
}
