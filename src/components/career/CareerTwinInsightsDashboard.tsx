
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CareerRecommendation } from "@/hooks/useCareerTwin";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Lightbulb, BarChart2, CheckCircle2, Clock } from "lucide-react";

interface CareerTwinInsightsDashboardProps {
  recommendations: CareerRecommendation[];
}

export function CareerTwinInsightsDashboard({ recommendations }: CareerTwinInsightsDashboardProps) {
  // Calculate overall statistics
  const stats = useMemo(() => {
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
  
  // Type distribution data
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
  
  // Status distribution data for pie chart
  const statusData = useMemo(() => {
    return [
      { name: 'Implemented', value: stats.implemented, color: '#10b981' },
      { name: 'Accepted', value: stats.accepted, color: '#3b82f6' },
      { name: 'Pending', value: stats.pending, color: '#f59e0b' },
      { name: 'Rejected', value: stats.rejected, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [stats]);

  // If no data, show empty state
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <BarChart2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Analytics Available</h3>
        <p className="text-muted-foreground">
          Generate career insights first to view analytics and progress metrics.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
            <CardDescription>All generated recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {recommendations.length > 0 
                ? `Last generated on ${new Date(recommendations[0].created_at).toLocaleDateString()}` 
                : 'No insights generated yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Implementation Rate</CardTitle>
            <CardDescription>Recommendations you've implemented</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.implementationRate}%</div>
              <CheckCircle2 className={`h-5 w-5 ${stats.implementationRate > 50 ? 'text-green-500' : 'text-amber-500'}`} />
            </div>
            <Progress value={stats.implementationRate} className="h-2 mt-2 mb-1" />
            <p className="text-xs text-muted-foreground">{stats.implemented} of {stats.total} recommendations implemented</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
            <CardDescription>Recommendations you've accepted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.acceptanceRate}%</div>
              <Lightbulb className={`h-5 w-5 ${stats.acceptanceRate > 50 ? 'text-emerald-500' : 'text-amber-500'}`} />
            </div>
            <Progress value={stats.acceptanceRate} className="h-2 mt-2 mb-1" />
            <p className="text-xs text-muted-foreground">
              {stats.accepted + stats.implemented} of {stats.total} recommendations accepted
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recommendation Status</CardTitle>
            <CardDescription>Distribution of your recommendations by status</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div style={{ width: '100%', height: 250 }}>
              {statusData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} recommendations`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recommendation Types</CardTitle>
            <CardDescription>Distribution by recommendation category</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 250 }}>
              {typeData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={typeData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value) => [`${value} recommendations`, 'Count']} />
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions on your career recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.slice(0, 3).map(rec => (
              <div key={rec.id} className="flex items-center gap-3 pb-3 border-b last:border-0">
                {rec.status === 'implemented' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {rec.status === 'accepted' && <Lightbulb className="h-5 w-5 text-blue-500" />}
                {rec.status === 'pending' && <Clock className="h-5 w-5 text-amber-500" />}
                {rec.status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
                <div>
                  <p className="font-medium text-sm">{rec.type === 'skill_gap' ? 'Skill Development' : rec.type === 'job_match' ? 'Career Opportunity' : 'Mentorship'}</p>
                  <p className="text-xs text-muted-foreground">{rec.recommendation.substring(0, 60)}...</p>
                </div>
              </div>
            ))}
            
            {recommendations.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Import missing icons
import { XCircle } from 'lucide-react';
