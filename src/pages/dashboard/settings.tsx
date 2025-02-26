
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Copy, Eye, EyeOff, KeyRound, RefreshCw, User, Bell, Wallet, Settings, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    username: 'johndoe',
    email: 'john@example.com',
    betaFeatures: false,
    developerMode: false,
    enhancedLogging: false,
    emailNotifications: true,
    apiKey: 'sk_live_xxxxxxxxxxxxxxxxxxxxx'
  });

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

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // API call to update profile would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-orbitron font-bold text-white">Settings</h1>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 glass-panel">
          <TabsTrigger value="account" className="flex gap-2">
            <User className="w-4 h-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="api" className="flex gap-2">
            <KeyRound className="w-4 h-4" /> API
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex gap-2">
            <Settings className="w-4 h-4" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex gap-2">
            <Wallet className="w-4 h-4" /> Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account settings and change your profile information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={settings.username}
                    onChange={(e) => setSettings({...settings, username: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
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
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Advanced Options</CardTitle>
              <CardDescription>
                Configure advanced settings and enable experimental features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Beta Features</Label>
                  <p className="text-sm text-gray-400">Access experimental features and updates</p>
                </div>
                <Switch
                  checked={settings.betaFeatures}
                  onCheckedChange={(checked) => setSettings({...settings, betaFeatures: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Developer Mode</Label>
                  <p className="text-sm text-gray-400">Enable advanced debugging tools</p>
                </div>
                <Switch
                  checked={settings.developerMode}
                  onCheckedChange={(checked) => setSettings({...settings, developerMode: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enhanced Logging</Label>
                  <p className="text-sm text-gray-400">Enable detailed activity logging</p>
                </div>
                <Switch
                  checked={settings.enhancedLogging}
                  onCheckedChange={(checked) => setSettings({...settings, enhancedLogging: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage your subscription and billing preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="hover:bg-aurora-blue/10">
                  View Billing History
                </Button>
                <Button className="bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple">
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications and updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-400">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
