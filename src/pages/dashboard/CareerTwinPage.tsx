
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCareerTwin, CareerRecommendation } from "@/hooks/useCareeriTwin";
import { toast } from "@/hooks/use-toast";
import { CareerTwinHeader } from "@/components/career/CareerTwinHeader";
import { CareerTwinFilters } from "@/components/career/CareerTwinFilters";
import { CareerTwinContent } from "@/components/career/CareerTwinContent";

export default function CareerTwinPage() {
  const { user } = useAuth();
  const { 
    loading, 
    getRecommendations, 
    updateRecommendationStatus, 
    implementRecommendation,
    addRecommendation
  } = useCareerTwin();

  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user, typeFilter, statusFilter]);

  const fetchRecommendations = async () => {
    const type = typeFilter !== 'all' ? typeFilter : undefined;
    const status = statusFilter !== 'all' ? statusFilter : undefined;
    
    const data = await getRecommendations(type, status);
    if (data) {
      setRecommendations(data);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    
    try {
      setIsGenerating(true);
      await addRecommendation();
      await fetchRecommendations();
      toast({
        title: "Success",
        description: "New career recommendation generated!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate recommendation",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: CareerRecommendation["status"]) => {
    try {
      await updateRecommendationStatus(id, status);
      await fetchRecommendations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update recommendation status",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleImplement = async (id: string) => {
    try {
      await implementRecommendation(id);
      await fetchRecommendations();
      return Promise.resolve();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create implementation plan",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <CareerTwinHeader 
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        isLoading={loading}
        isUserLoggedIn={!!user}
      />

      {user && (
        <>
          <CareerTwinFilters
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            setTypeFilter={setTypeFilter}
            setStatusFilter={setStatusFilter}
          />

          <CareerTwinContent
            isUserLoggedIn={!!user}
            isLoading={loading}
            recommendations={recommendations}
            onStatusUpdate={handleStatusUpdate}
            onImplement={handleImplement}
          />
        </>
      )}
    </div>
  );
}
