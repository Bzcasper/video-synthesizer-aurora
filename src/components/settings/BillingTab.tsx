
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BillingTab() {
  return (
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
  );
}
