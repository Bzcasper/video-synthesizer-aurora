// src/components/VideoGenerationForm.tsx
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateVideo } from "@/lib/api/modalApi";
import { toast } from "@/components/ui/use-toast";
import { useUser } from "@/hooks/useUser";

const videoFormSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  duration: z.number().min(5).max(60),
  resolution: z.array(z.number()).length(2),
  fps: z.number().min(24).max(60),
  style: z.string(),
  enhanceFrames: z.boolean().default(true),
});

type VideoFormValues = z.infer<typeof videoFormSchema>;

export default function VideoGenerationForm() {
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const defaultValues: VideoFormValues = {
    prompt: "",
    duration: 10,
    resolution: [1920, 1080],
    fps: 30,
    style: "cinematic",
    enhanceFrames: true,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues,
  });

  const onSubmit = async (values: VideoFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to generate videos",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await generateVideo({
        ...values,
        userId: user.id,
      });

      toast({
        title: "Video generation started",
        description: `Your video is being processed. Job ID: ${result.jobId}`,
      });

      // Redirect to status page
      window.location.href = `/dashboard/videos/status?jobId=${result.jobId}`;
    } catch (error) {
      toast({
        title: "Failed to start video generation",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 pt-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Video Description
            </label>
            <Controller
              name="prompt"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Describe your video in detail (e.g., Cinematic mountain landscape at sunset with clouds in timelapse)"
                  className="h-32 resize-none"
                />
              )}
            />
            {errors.prompt && (
              <p className="text-sm text-red-500">{errors.prompt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration (seconds)</label>
            <Controller
              name="duration"
              control={control}
              render={({ field: { value, onChange } }) => (
                <>
                  <Slider
                    value={[value]}
                    onValueChange={([newValue]) => onChange(newValue)}
                    min={5}
                    max={60}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>5s</span>
                    <span>{value}s</span>
                    <span>60s</span>
                  </div>
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Style</label>
            <Controller
              name="style"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="artistic">Artistic</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Resolution</label>
            <Controller
              name="resolution"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value.join("x")}
                  onValueChange={(value) => {
                    const [width, height] = value.split("x").map(Number);
                    field.onChange([width, height]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1280x720">HD (720p)</SelectItem>
                    <SelectItem value="1920x1080">Full HD (1080p)</SelectItem>
                    <SelectItem value="3840x2160">4K UHD</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Frames Per Second</label>
            <Controller
              name="fps"
              control={control}
              render={({ field: { value, onChange } }) => (
                <>
                  <Slider
                    value={[value]}
                    onValueChange={([newValue]) => onChange(newValue)}
                    min={24}
                    max={60}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>24fps</span>
                    <span>{value}fps</span>
                    <span>60fps</span>
                  </div>
                </>
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="enhanceFrames"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  id="enhanceFrames"
                  className="h-4 w-4"
                />
              )}
            />
            <label htmlFor="enhanceFrames" className="text-sm font-medium">
              Enhance frames with AI upscaling
            </label>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto"
        >
          {isSubmitting ? "Generating..." : "Generate Video"}
        </Button>
      </div>
    </form>
  );
}
