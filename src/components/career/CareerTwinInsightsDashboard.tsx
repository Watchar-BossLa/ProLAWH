
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CareerRecommendation } from '@/hooks/useCareerTwin';
import { Grid } from '@/components/ui/grid';
import { BarChart3, PieChart as PieChartIcon, ThumbsUp, UserCheck } from 'lucide-react';

interface CareerTwinInsightsDashboardProps {
  recommendations: CareerRecommendation[];
}

export function CareerTwinInsightsDashboard({ recommendations }: CareerTwinInsightsDashboardProps) {
  // Calculate metrics for the dashboard
  const totalRecommendations = recommendations.length;
  const implementedCount = recommendations.filter(r => r.status === 'implemented').length;
  const acceptedCount = recommendations.filter(r => r.status === 'accepted').length;
  const pendingCount = recommendations.filter(r => r.status === 'pending').length;
  const rejectedCount = recommendations.filter(r => r.status === 'rejected').length;
  
  // Calculate implementation rate
  const implementationRate = totalRecommendations > 0
    ? Math.round((implementedCount / totalRecommendations) * 100)
    : 0;
    
  // Calculate acceptance rate
  const acceptanceRate = totalRecommendations > 0
    ? Math.round(((implementedCount + acceptedCount) / totalRecommendations) * 100)
    : 0;
  
  // Recommendation types breakdown
  const typeCount = recommendations.reduce((acc, recommendation) => {
    const type = recommendation.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const typeData = Object.entries(typeCount).map(([name, value]) => ({
    name: name === 'skill_gap' 
      ? 'Skill Development' 
      : name === 'job_match' 
        ? 'Career Opportunities' 
        : name === 'mentor_suggest' 
          ? 'Mentorship' 
          : name,
    value
  }));
  
  // Status breakdown
  const statusData = [
    { name: 'Implemented', value: implementedCount, color: '#22c55e' },
    { name: 'Accepted', value: acceptedCount, color: '#3b82f6' },
    { name: 'Pending', value: pendingCount, color: '#eab308' },
    { name: 'Rejected', value: rejectedCount, color: '#ef4444' }
  ].filter(item => item.value > 0);
  
  // Recommendation timeline
  const timelineData = recommendations.reduce((acc, recommendation) => {
    // Get month and year from created_at
    const date = new Date(recommendation.created_at);
    const month = date.toLocaleString('default', { month: 'short' });
    const key = `${month} ${date.getFullYear()}`;
    
    if (!acc[key]) {
      acc[key] = { name: key, count: 0 };
    }
    
    acc[key].count++;
    return acc;
  }, {} as Record<string, { name: string, count: number }>);
  
  const timelineChartData = Object.values(timelineData).sort((a, b) => {
    // Sort by date
    const aDate = new Date(a.name);
    const bDate = new Date(b.name);
    return aDate.getTime() - bDate.getTime();
  });
  
  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRecommendations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Implementation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{implementationRate}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Acceptance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{acceptanceRate}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Recommendation Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Recommendation Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            {typeData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Recommendations Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timelineChartData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                No timeline data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
