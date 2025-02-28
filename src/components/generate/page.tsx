// src/app/dashboard/generate/page.tsx
import { Metadata } from "next";
import VideoGenerationForm from "@/components/VideoGenerationForm";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Generate Video | Aurora Video Synthesizer",
  description: "Create a new AI-generated video with Aurora Video Synthesizer",
};

export default function GenerateVideoPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Generate Video</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Video Generation Settings
        </h2>
        <VideoGenerationForm />
      </Card>

      <div className="mt-8 text-sm text-gray-500">
        <h3 className="font-medium mb-2">Tips for best results:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Be specific in your prompt description</li>
          <li>Include details about lighting, mood, and camera angles</li>
          <li>
            Higher frame rates result in smoother videos but longer processing
            times
          </li>
          <li>Generation times vary depending on duration and resolution</li>
        </ul>
      </div>
    </div>
  );
}
