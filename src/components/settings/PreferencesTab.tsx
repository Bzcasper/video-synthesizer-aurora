
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { TabProps } from "@/types/settings";

export function PreferencesTab({ settings, setSettings }: TabProps) {
  return (
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
  );
}
