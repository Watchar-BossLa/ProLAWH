
import { useMemo } from 'react';
import { CareerRecommendation } from '@/hooks/useCareerTwin';

export function useCareerStats(recommendations: CareerRecommendation[]) {
  return useMemo(() => {
    const total = recommendations.length;
    const implemented = recommendations.filter(r => r.status === 'implemented').length;
    const pending = recommendations.filter(r => r.status === 'pending').length;
    const accepted = recommendations.filter(r => r.status === 'accepted').length;
    const rejected = recommendations.filter(r => r.status === 'rejected').length;
    
    const implementationRate = total > 0 ? Math.round((implemented / total) * 100) : 0;
    const acceptanceRate = total > 0 ? Math.round(((accepted + implemented) / total) * 100) : 0;
    
    return {
      total,
      implemented,
      pending,
      accepted,
      rejected,
      implementationRate,
      acceptanceRate
    };
  }, [recommendations]);
}
