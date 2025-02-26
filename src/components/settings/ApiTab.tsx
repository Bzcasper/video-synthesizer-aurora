
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { TabProps } from "@/types/settings";

export function ApiTab({ settings, isLoading, setIsLoading }: TabProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(settings.apiKey);
    toast({
      title: "API Key Copied",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const handleRegenerateApiKey = async () => {
    setIsLoading(true);
    try {
      // API call to regenerate key would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast({
        title: "API Key Regenerated",
        description: "Your new API key has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to regenerate API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>API Access</CardTitle>
        <CardDescription>
          Manage your API keys and view usage limits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="apiKey">API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={settings.apiKey}
                readOnly
                className="bg-white/5 border-white/10 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button
              variant="outline"
              onClick={handleCopyApiKey}
              className="hover:bg-aurora-blue/10"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleRegenerateApiKey}
              disabled={isLoading}
              className="hover:bg-aurora-blue/10"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Rate Limits</h4>
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Requests per minute</span>
              <span className="text-sm font-medium">60</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Requests per day</span>
              <span className="text-sm font-medium">10,000</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
