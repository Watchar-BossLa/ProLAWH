
import React from "react";
import { Cuboid } from "lucide-react";

export function ARLoadingState() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="text-center">
        <Cuboid className="h-12 w-12 mx-auto text-primary animate-pulse mb-4" />
        <p>Checking AR capabilities...</p>
      </div>
    </div>
  );
}
