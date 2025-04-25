
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CareerTwinCard } from "@/components/career/CareerTwinCard";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function CareerTwinPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('career_recommendations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewRecommendation = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('career-twin');
      if (error) throw error;
      await fetchRecommendations();
      toast({
        title: "New recommendation generated",
        description: "Check out your latest career insights!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleStatusUpdate = (id: string, status: string) => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, status } : rec)
    );
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Career Twin</h1>
        <button
          onClick={handleNewRecommendation}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Generate New Insight
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          {recommendations.map((recommendation) => (
            <CareerTwinCard
              key={recommendation.id}
              recommendation={recommendation}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
          {recommendations.length === 0 && (
            <p className="text-center text-gray-500">
              No recommendations yet. Generate your first career insight!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
