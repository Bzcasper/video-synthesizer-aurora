
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-orbitron font-bold text-white">Settings</h1>
      </div>

      <Card className="p-6 bg-white/5 border-white/10">
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <Button
            type="submit"
            className="bg-gradient-to-r from-aurora-purple to-aurora-blue 
                     hover:from-aurora-blue hover:to-aurora-purple"
          >
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Settings;
