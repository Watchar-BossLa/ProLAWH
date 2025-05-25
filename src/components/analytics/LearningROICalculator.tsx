
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ROICalculation {
  investmentCost: number;
  timeInvestment: number;
  currentSalary: number;
  projectedSalaryIncrease: number;
  roi: number;
  paybackPeriod: number;
  totalReturn: number;
  netBenefit: number;
}

export function LearningROICalculator() {
  const [currentSalary, setCurrentSalary] = useState<number>(75000);
  const [coursesCost, setCoursesCost] = useState<number>(2000);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [studyWeeks, setStudyWeeks] = useState<number>(12);
  const [expectedRaise, setExpectedRaise] = useState<number>(15);
  const [skillCategory, setSkillCategory] = useState<string>('frontend');

  const roiCalculation = useMemo<ROICalculation>(() => {
    const totalHours = hoursPerWeek * studyWeeks;
    const opportunityCost = (currentSalary / 2080) * totalHours; // 2080 work hours per year
    const totalInvestment = coursesCost + opportunityCost;
    
    const projectedSalaryIncrease = (currentSalary * expectedRaise) / 100;
    const annualBenefit = projectedSalaryIncrease;
    
    const paybackPeriod = totalInvestment / annualBenefit;
    const fiveYearReturn = annualBenefit * 5;
    const netBenefit = fiveYearReturn - totalInvestment;
    const roi = ((fiveYearReturn - totalInvestment) / totalInvestment) * 100;

    return {
      investmentCost: totalInvestment,
      timeInvestment: totalHours,
      currentSalary,
      projectedSalaryIncrease,
      roi,
      paybackPeriod,
      totalReturn: fiveYearReturn,
      netBenefit
    };
  }, [currentSalary, coursesCost, hoursPerWeek, studyWeeks, expectedRaise]);

  const chartData = useMemo(() => {
    const years = [0, 1, 2, 3, 4, 5];
    return years.map(year => ({
      year: `Year ${year}`,
      investment: year === 0 ? -roiCalculation.investmentCost : 0,
      returns: year === 0 ? 0 : roiCalculation.projectedSalaryIncrease * year,
      netValue: year === 0 ? -roiCalculation.investmentCost : 
                (roiCalculation.projectedSalaryIncrease * year) - roiCalculation.investmentCost
    }));
  }, [roiCalculation]);

  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'text-green-600';
    if (roi >= 100) return 'text-green-500';
    if (roi >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Learning ROI Calculator
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Calculate the return on investment for your learning and skill development
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-salary">Current Annual Salary ($)</Label>
              <Input
                id="current-salary"
                type="number"
                value={currentSalary}
                onChange={(e) => setCurrentSalary(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courses-cost">Courses & Materials Cost ($)</Label>
              <Input
                id="courses-cost"
                type="number"
                value={coursesCost}
                onChange={(e) => setCoursesCost(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="skill-category">Skill Category</Label>
              <Select value={skillCategory} onValueChange={setSkillCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend Development</SelectItem>
                  <SelectItem value="backend">Backend Development</SelectItem>
                  <SelectItem value="data-science">Data Science</SelectItem>
                  <SelectItem value="ai-ml">AI/Machine Learning</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="design">UI/UX Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hours-week">Study Hours per Week</Label>
              <Input
                id="hours-week"
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="study-weeks">Study Duration (Weeks)</Label>
              <Input
                id="study-weeks"
                type="number"
                value={studyWeeks}
                onChange={(e) => setStudyWeeks(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expected-raise">Expected Salary Increase (%)</Label>
              <Input
                id="expected-raise"
                type="number"
                value={expectedRaise}
                onChange={(e) => setExpectedRaise(Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Investment</p>
                <p className="text-2xl font-bold">${roiCalculation.investmentCost.toLocaleString()}</p>
              </div>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time Investment</p>
                <p className="text-2xl font-bold">{roiCalculation.timeInvestment} hrs</p>
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">5-Year ROI</p>
                <p className={`text-2xl font-bold ${getROIColor(roiCalculation.roi)}`}>
                  {roiCalculation.roi.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payback Period</p>
                <p className="text-2xl font-bold">{roiCalculation.paybackPeriod.toFixed(1)} yrs</p>
              </div>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ROI Projection Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value, name) => [
                    `$${Number(value).toLocaleString()}`, 
                    name === 'investment' ? 'Investment' : 
                    name === 'returns' ? 'Cumulative Returns' : 'Net Value'
                  ]}
                />
                <Bar dataKey="investment" fill="#ef4444" name="investment" />
                <Bar dataKey="returns" fill="#10b981" name="returns" />
                <Bar dataKey="netValue" fill="#3b82f6" name="netValue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ROI Analysis Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Investment Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Direct Costs (Courses/Materials):</span>
                  <span>${coursesCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Opportunity Cost ({roiCalculation.timeInvestment} hours):</span>
                  <span>${(roiCalculation.investmentCost - coursesCost).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Total Investment:</span>
                  <span>${roiCalculation.investmentCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Returns Analysis</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Annual Salary Increase:</span>
                  <span>${roiCalculation.projectedSalaryIncrease.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>5-Year Total Returns:</span>
                  <span>${roiCalculation.totalReturn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Net Benefit (5 years):</span>
                  <span className={getROIColor(roiCalculation.roi)}>
                    ${roiCalculation.netBenefit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {roiCalculation.roi >= 200 && (
                <Badge className="bg-green-100 text-green-800">Excellent ROI</Badge>
              )}
              {roiCalculation.paybackPeriod <= 2 && (
                <Badge className="bg-blue-100 text-blue-800">Quick Payback</Badge>
              )}
              {roiCalculation.timeInvestment <= 100 && (
                <Badge className="bg-purple-100 text-purple-800">Time Efficient</Badge>
              )}
              {roiCalculation.roi < 50 && (
                <Badge className="bg-orange-100 text-orange-800">Consider Alternatives</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
