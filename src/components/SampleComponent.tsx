
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SampleComponentProps {
  title?: string;
  description?: string;
  footerText?: string;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

const SampleComponent: React.FC<SampleComponentProps> = ({
  title = "Hello from Aurora!",
  description = "This is a sample component showcasing a responsive design with Tailwind CSS and Shadcn UI.",
  footerText = "Click the button below to perform an action.",
  onAction,
  actionLabel = "Click Me",
  className = "",
}) => {
  return (
    <Card className={`w-full max-w-md mx-auto transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl md:text-2xl font-bold">{title}</CardTitle>
        <CardDescription className="text-sm md:text-base">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-md text-center">
            <p className="font-medium">Feature One</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Description of first feature</p>
          </div>
          
          <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-md text-center">
            <p className="font-medium">Feature Two</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Description of second feature</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">{footerText}</p>
        <Button 
          onClick={onAction} 
          className="w-full sm:w-auto"
        >
          {actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SampleComponent;
