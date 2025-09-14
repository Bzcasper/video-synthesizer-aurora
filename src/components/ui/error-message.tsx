import React from "react";
import { Card } from "@/components/ui/card";

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export const ErrorMessage = ({
  message = "An error occurred. Please try again later.",
  className,
}: ErrorMessageProps) => {
  return (
    <Card className={`p-8 bg-black/50 border-white/10 ${className}`}>
      <div className="text-center text-red-500">{message}</div>
    </Card>
  );
};
