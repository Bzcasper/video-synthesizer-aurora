// src/app/dashboard/videos/[id]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import VideoPlayer from "@/components/VideoPlayer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Edit, Trash2 } from "lucide-react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });

  const { data: video } = await supabase
    .from("video_jobs")
    .select("prompt")
    .eq("id", params.id)
    .single();

  return {
    title: video
      ? `${video.prompt.slice(0, 50)}... | Aurora Video`
      : "Video Details",
    description: video ? video.prompt : "View generated video details",
  };
}

export default async function VideoDetailPage({ params }: Props) {
  const supabase = createServerComponentClient({ cookies });

  const { data: video, error } = await supabase
    .from("video_jobs")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !video || !video.output_url) {
    notFound();
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 line-clamp-2">{video.prompt}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer
            src={video.output_url}
            title={video.prompt}
            poster={video.thumbnail_url || undefined}
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Video
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Enhance
            </Button>
            <Button
              variant="outline"
              className="text-red-500 flex items-center gap-2 ml-auto"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Video Details</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created</h3>
                <p>{new Date(video.created_at).toLocaleString()}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                <p>{video.duration} seconds</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Resolution
                </h3>
                <p>
                  {video.resolution[0]} × {video.resolution[1]}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Style</h3>
                <p className="capitalize">{video.style || "Standard"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Prompt</h3>
                <p className="text-sm">{video.prompt}</p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Generate Similar
                </h3>
                <Button
                  className="w-full bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
                  onClick={() => {
                    // This would be handled client-side in a use client component
                  }}
                >
                  Create Variation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
