
import { useState } from 'react';
import { CareerRecommendation } from '@/hooks/useCareerTwin';

export function useCareerTwinState(recommendations: CareerRecommendation[]) {
  const [activeTab, setActiveTab] = useState("recommendations");

  const pendingRecommendations = recommendations.filter(r => r.status === 'pending');
  const acceptedRecommendations = recommendations.filter(r => r.status === 'accepted');
  const implementedRecommendations = recommendations.filter(r => r.status === 'implemented');

  const groupedRecommendations = {
    pending: pendingRecommendations,
    accepted: acceptedRecommendations,
    implemented: implementedRecommendations
  };

  return {
    activeTab,
    setActiveTab,
    groupedRecommendations,
    pendingRecommendations,
    acceptedRecommendations,
    implementedRecommendations
  };
}
