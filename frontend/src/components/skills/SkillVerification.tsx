
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function SkillVerification() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          VeriSkill Credentials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Get verifiable credentials for your green skills using our decentralized 
          digital wallet system.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">Decentralized Identity</p>
              <p className="text-xs text-muted-foreground">Self-sovereign wallet with Ed25519 keys</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">W3C Credentials</p>
              <p className="text-xs text-muted-foreground">Industry-standard verifiable certificates</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 border rounded-md">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">Blockchain Anchored</p>
              <p className="text-xs text-muted-foreground">Tamper-proof on Polygon network</p>
            </div>
          </div>
        </div>

        <Button asChild className="w-full">
          <Link to="/dashboard/veriskill">
            Access VeriSkill Wallet
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
