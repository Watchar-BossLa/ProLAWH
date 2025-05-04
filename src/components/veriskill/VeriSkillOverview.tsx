
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Target, Coins, Shield, ArrowRight, Globe2, Binary } from "lucide-react";

export function VeriSkillOverview() {
  const features = [
    {
      title: "Digital Identity Wallet",
      description: "Self-sovereign identity with Shamir secret sharing for key recovery",
      icon: <Wallet className="h-8 w-8 text-blue-500" />,
      tags: ["DID", "Web3", "Identity"]
    },
    {
      title: "AI-Powered Talent Matching",
      description: "Vector-based search connects talent with opportunities globally",
      icon: <Target className="h-8 w-8 text-purple-500" />,
      tags: ["AI", "Vector DB", "Matching"]
    },
    {
      title: "Stablecoin Payment Rails",
      description: "Cross-chain payments with escrow and yield generation",
      icon: <Coins className="h-8 w-8 text-green-500" />,
      tags: ["USDC", "Escrow", "Yield"]
    },
    {
      title: "Compliance & Privacy",
      description: "Built-in compliance with EU CRA, NIS2, GDPR, and NIST SP 800-226",
      icon: <Shield className="h-8 w-8 text-red-500" />,
      tags: ["Zero-Trust", "Encryption", "Privacy"]
    }
  ];

  const metrics = [
    { label: "Verification Speed", value: "< 500ms", trend: "improving" },
    { label: "Global RPS", value: "10K+", trend: "stable" },
    { label: "API Availability", value: "99.99%", trend: "stable" },
    { label: "Carbon Footprint", value: "Low", trend: "improving" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl">VeriSkill Network Platform</CardTitle>
            <CardDescription>
              Decentralized skill passport + gig matching + stablecoin payment rail for the global south
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none dark:prose-invert">
              <p>
                VeriSkill Network is a modular, failure-tolerant platform designed to bridge the global skills gap 
                through verifiable credentials, AI-powered talent matching, and seamless cross-chain payments.
              </p>
              <p>
                Built with sustainable languages (Python, Rust, Go) and zero-trust architecture, 
                the platform ensures maximum security, privacy, and environmental sustainability.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center text-sm text-muted-foreground gap-2">
              <Globe2 className="h-4 w-4" />
              <span>Platform Status: Operational</span>
            </div>
            <Button variant="outline" onClick={() => window.open('https://veriskill.network', '_blank')}>
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        {features.map((feature, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mb-4">{feature.description}</CardDescription>
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag, j) => (
                  <Badge key={j} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Binary className="h-5 w-5" /> 
            Platform Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric, i) => (
              <div key={i} className="flex flex-col items-center p-4 border rounded-lg">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <span className="text-2xl font-bold">{metric.value}</span>
                <span className={`text-xs ${
                  metric.trend === "improving" ? "text-green-500" : 
                  metric.trend === "declining" ? "text-red-500" : "text-blue-500"
                }`}>
                  {metric.trend === "improving" ? "↑" : 
                   metric.trend === "declining" ? "↓" : "→"} {metric.trend}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
