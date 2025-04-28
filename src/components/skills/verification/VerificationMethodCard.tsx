
import React from "react";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface VerificationMethodCardProps {
  id: string;
  name: string;
  description: string;
  requiredEvidence: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
}

export function VerificationMethodCard({
  id,
  name,
  description,
  requiredEvidence,
  icon,
  isSelected,
  onSelect,
}: VerificationMethodCardProps) {
  return (
    <div
      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
        isSelected
          ? "border-primary bg-primary/5"
          : "hover:border-primary/50"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{name}</h4>
            {isSelected && (
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              >
                Selected
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
          
          {isSelected && (
            <div className="mt-3 border-t pt-2 text-xs text-muted-foreground">
              <span className="font-medium">Required:</span> {requiredEvidence}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
