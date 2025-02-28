// src/app/dashboard/page.tsx
import { Suspense } from "react";
import VideoManagement from "@/components/dashboard/VideoManagement";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Dashboard | Aurora Video Synthesizer",
  description: "Manage your AI-generated videos with Aurora Video Synthesizer",
};

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Video Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-1">Total Videos</h3>
          <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin" />}>
            <TotalVideosCounter />
          </Suspense>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-1">Processing</h3>
          <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin" />}>
            <ProcessingCounter />
          </Suspense>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-1">Storage Used</h3>
          <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin" />}>
            <StorageCounter />
          </Suspense>
        </Card>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <VideoManagement />
      </Suspense>
    </div>
  );
}

async function TotalVideosCounter() {
  // This would typically fetch from API/Supabase
  const count = 12; // Placeholder, replace with actual data
  return <p className="text-3xl font-bold">{count}</p>;
}

async function ProcessingCounter() {
  // This would typically fetch from API/Supabase
  const count = 2; // Placeholder, replace with actual data
  return <p className="text-3xl font-bold">{count}</p>;
}

async function StorageCounter() {
  // This would typically fetch from API/Supabase
  const used = "258 MB"; // Placeholder, replace with actual data
  return <p className="text-3xl font-bold">{used}</p>;
}
