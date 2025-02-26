
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, KeyRound, Settings as SettingsIcon, Wallet, Bell } from "lucide-react";
import { AccountTab } from "@/components/settings/AccountTab";
import { ApiTab } from "@/components/settings/ApiTab";
import { PreferencesTab } from "@/components/settings/PreferencesTab";
import { BillingTab } from "@/components/settings/BillingTab";
import { NotificationsTab } from "@/components/settings/NotificationsTab";
import type { UserSettings } from "@/types/settings";

const SettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    username: 'johndoe',
    email: 'john@example.com',
    betaFeatures: false,
    developerMode: false,
    enhancedLogging: false,
    emailNotifications: true,
    apiKey: 'sk_live_xxxxxxxxxxxxxxxxxxxxx'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-orbitron font-bold text-white">Settings</h1>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 glass-panel">
          <TabsTrigger value="account" className="flex gap-2">
            <User size={16} /> Account
          </TabsTrigger>
          <TabsTrigger value="api" className="flex gap-2">
            <KeyRound size={16} /> API
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex gap-2">
            <SettingsIcon size={16} /> Preferences
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex gap-2">
            <Wallet size={16} /> Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2">
            <Bell size={16} /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <AccountTab
            settings={settings}
            setSettings={setSettings}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </TabsContent>

        <TabsContent value="api">
          <ApiTab
            settings={settings}
            setSettings={setSettings}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab
            settings={settings}
            setSettings={setSettings}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </TabsContent>

        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab
            settings={settings}
            setSettings={setSettings}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
