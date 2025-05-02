
import { cn } from "@/lib/utils";
import React from "react";

interface HighContrastContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function HighContrastContainer({
  children,
  className,
  ...props
}: HighContrastContainerProps) {
  return (
    <div
      className={cn(
        "dynamic-container p-4 rounded-lg border", 
        "dynamic:gradient-card",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface HighContrastTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function HighContrastText({
  children,
  className,
  ...props
}: HighContrastTextProps) {
  return (
    <p
      className={cn(
        "text-foreground dynamic:high-contrast-text",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

interface HighContrastHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function HighContrastHeading({
  children,
  className,
  ...props
}: HighContrastHeadingProps) {
  return (
    <h2
      className={cn(
        "text-xl font-bold text-foreground dynamic:high-contrast-text",
        "dynamic:gradient-text",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
