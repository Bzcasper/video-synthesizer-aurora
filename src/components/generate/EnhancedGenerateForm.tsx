
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { VideoStyleOption } from './VideoStyleOption';
import { GenerateButton } from './GenerateButton';
import { DurationSlider } from './DurationSlider';
import { SceneEditor } from './SceneEditor';
import { VideoDescriptionInput } from './VideoDescriptionInput';

// Define the form schema with zod
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000, "Description must be less than 1000 characters"),
  duration: z.number().min(5, "Duration must be at least 5 seconds").max(60, "Duration must be less than 60 seconds"),
  style: z.string().min(1, "Please select a style"),
  resolution: z.string().default("1080p"),
  aspectRatio: z.string().default("16:9"),
});

type FormValues = z.infer<typeof formSchema>;

const styles = [
  { id: "cinematic", name: "Cinematic", description: "Professional movie-like quality" },
  { id: "anime", name: "Anime", description: "Japanese animation style" },
  { id: "3d", name: "3D Rendered", description: "Computer-generated 3D graphics" },
  { id: "watercolor", name: "Watercolor", description: "Artistic watercolor painting style" },
  { id: "neon", name: "Neon", description: "Vibrant neon colors with glow effects" },
  { id: "aurora", name: "Aurora", description: "Colorful aurora light effects" },
];

const resolutions = [
  { value: "720p", label: "720p - HD" },
  { value: "1080p", label: "1080p - Full HD" },
  { value: "1440p", label: "1440p - 2K" },
  { value: "2160p", label: "2160p - 4K" },
];

const aspectRatios = [
  { value: "16:9", label: "16:9 - Widescreen" },
  { value: "1:1", label: "1:1 - Square" },
  { value: "9:16", label: "9:16 - Vertical" },
  { value: "4:3", label: "4:3 - Classic" },
];

export function EnhancedGenerateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const { toast } = useToast();
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 15,
      style: "cinematic",
      resolution: "1080p",
      aspectRatio: "16:9",
    },
  });
  
  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      console.log("Submitting form values:", values);
      
      // Show success toast
      toast({
        title: "Video generation started",
        description: "Your video is being generated. This may take a few minutes.",
        variant: "default",
      });
      
      // Would normally navigate to status page or show status overlay here
      
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Show error toast
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-aurora-blue/20 bg-gradient-to-b from-aurora-black to-black/90">
      <CardHeader className="pb-4">
        <CardTitle className="text-aurora-white font-orbitron text-xl">Generate New AI Video</CardTitle>
        <CardDescription className="text-gray-400">
          Fill in the details below to create your AI-generated video
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardContent className="pt-0">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6 mt-4">
                {/* Video Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter a title for your video" 
                          {...field} 
                          className="bg-aurora-black/50 border-aurora-blue/20 focus:border-aurora-blue"
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, descriptive title for your video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Video Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Description / Prompt</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what you want in your video in detail. The more specific, the better the results." 
                          {...field} 
                          className="min-h-32 bg-aurora-black/50 border-aurora-blue/20 focus:border-aurora-blue"
                        />
                      </FormControl>
                      <FormDescription>
                        Be detailed and specific about what you want to see in the video
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Duration Slider */}
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video Duration (seconds)</FormLabel>
                      <FormControl>
                        <div className="pt-2">
                          <Slider
                            min={5}
                            max={60}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>5s</span>
                            <span className="font-medium text-aurora-blue">{field.value}s</span>
                            <span>60s</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Longer videos will take more time to generate
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Style Selection */}
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visual Style</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                          {styles.map((style) => (
                            <div 
                              key={style.id}
                              className={`cursor-pointer rounded-lg p-3 transition-all
                                ${field.value === style.id 
                                  ? 'bg-aurora-blue/20 border border-aurora-blue/50' 
                                  : 'bg-black/20 border border-white/10 hover:border-aurora-blue/30'
                                }`}
                              onClick={() => field.onChange(style.id)}
                            >
                              <h4 className="font-medium text-aurora-white">{style.name}</h4>
                              <p className="text-xs text-gray-400 mt-1">{style.description}</p>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-6 mt-4">
                {/* Resolution Selection */}
                <FormField
                  control={form.control}
                  name="resolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resolution</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                        {resolutions.map((res) => (
                          <div 
                            key={res.value}
                            className={`cursor-pointer rounded-lg p-3 transition-all text-center
                              ${field.value === res.value 
                                ? 'bg-aurora-blue/20 border border-aurora-blue/50' 
                                : 'bg-black/20 border border-white/10 hover:border-aurora-blue/30'
                              }`}
                            onClick={() => field.onChange(res.value)}
                          >
                            <p className="text-sm text-aurora-white">{res.label}</p>
                          </div>
                        ))}
                      </div>
                      <FormDescription className="mt-2">
                        Higher resolutions require more processing time
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Aspect Ratio Selection */}
                <FormField
                  control={form.control}
                  name="aspectRatio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aspect Ratio</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                        {aspectRatios.map((ratio) => (
                          <div 
                            key={ratio.value}
                            className={`cursor-pointer rounded-lg p-3 transition-all text-center
                              ${field.value === ratio.value 
                                ? 'bg-aurora-blue/20 border border-aurora-blue/50' 
                                : 'bg-black/20 border border-white/10 hover:border-aurora-blue/30'
                              }`}
                            onClick={() => field.onChange(ratio.value)}
                          >
                            <p className="text-sm text-aurora-white">{ratio.label}</p>
                          </div>
                        ))}
                      </div>
                      <FormDescription className="mt-2">
                        Choose the aspect ratio that best fits your needs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Additional advanced options could be added here */}
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Reset
              </Button>
              
              <Button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-pulse mr-2">⬤</span>
                    Generating...
                  </>
                ) : "Generate Video"}
              </Button>
            </CardFooter>
          </Tabs>
        </form>
      </Form>
    </Card>
  );
}
