
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillGapHeatMap } from "./SkillGapHeatMap";
import { LearningROICalculator } from "./LearningROICalculator";
import { PredictiveCareerModel } from "./PredictiveCareerModel";
import { LearningProgressAnalytics } from "./LearningProgressAnalytics";
import { PerformanceMetricsDashboard } from "./PerformanceMetricsDashboard";
import { TrendingUp, Target, Calculator, Brain, BarChart } from "lucide-react";

export function LearningAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Learning Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your learning journey and skill development
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="skill-gaps" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Skill Gaps
          </TabsTrigger>
          <TabsTrigger value="roi-calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            ROI Calculator
          </TabsTrigger>
          <TabsTrigger value="career-prediction" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Career Model
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <LearningProgressAnalytics />
        </TabsContent>

        <TabsContent value="skill-gaps" className="space-y-4">
          <SkillGapHeatMap />
        </TabsContent>

        <TabsContent value="roi-calculator" className="space-y-4">
          <LearningROICalculator />
        </TabsContent>

        <TabsContent value="career-prediction" className="space-y-4">
          <PredictiveCareerModel />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceMetricsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
