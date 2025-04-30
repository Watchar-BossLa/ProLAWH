
import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCheck, Clock, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { CareerRecommendation } from "@/hooks/useCareerRecommendations"

interface CareerTwinCardProps {
  recommendation: CareerRecommendation
  onStatusUpdate: (id: string, status: CareerRecommendation["status"]) => void
}

export const CareerTwinCard = ({ recommendation, onStatusUpdate }: CareerTwinCardProps) => {
  const handleStatusUpdate = async (status: CareerRecommendation["status"]) => {
    try {
      await onStatusUpdate(recommendation.id, status)
      toast({
        title: "Status updated",
        description: `Recommendation marked as ${status}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {recommendation.type === 'skill_gap' && 'Skill Gap Analysis'}
          {recommendation.type === 'job_match' && 'Job Match'}
          {recommendation.type === 'mentor_suggest' && 'Mentorship Suggestion'}
          {recommendation.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
          {recommendation.status === 'accepted' && <CheckCheck className="h-4 w-4 text-green-500" />}
          {recommendation.status === 'rejected' && <XCircle className="h-4 w-4 text-red-500" />}
        </CardTitle>
        <CardDescription>
          Relevance Score: {Math.round(recommendation.relevance_score * 100)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{recommendation.recommendation}</p>
        {recommendation.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-green-600"
              onClick={() => handleStatusUpdate('accepted')}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600"
              onClick={() => handleStatusUpdate('rejected')}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
