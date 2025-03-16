
import { supabase } from "@/integrations/supabase/client";

export class BlogExtractor {
  /**
   * Extracts key sections from a blog post URL
   * @param url The URL of the blog post to extract content from
   * @returns An array of content sections
   */
  static async extractFromUrl(url: string): Promise<string[]> {
    try {
      // Call the Supabase Edge Function to extract content
      const { data, error } = await supabase.functions.invoke('extract-blog-content', {
        body: { url }
      });

      if (error) {
        console.error('Error extracting blog content:', error);
        throw new Error(`Failed to extract blog content: ${error.message}`);
      }

      if (!data || !Array.isArray(data.sections)) {
        throw new Error('Invalid response from content extraction service');
      }

      return data.sections;
    } catch (error) {
      console.error('Error in extractFromUrl:', error);
      
      // For testing and preview, return mock data if the API call fails
      if (process.env.NODE_ENV === 'development') {
        console.warn('Using mock data for blog extraction (development mode)');
        return BlogExtractor.getMockSections();
      }
      
      throw error;
    }
  }

  /**
   * Returns mock blog sections for testing and preview
   */
  private static getMockSections(): string[] {
    return [
      "Create stunning AI-generated videos with Aurora's powerful video synthesizer. Transform your ideas into visual masterpieces with just a few clicks.",
      
      "Our advanced AI understands your prompts and generates high-quality video content that matches your creative vision. Perfect for marketers, content creators, and businesses.",
      
      "With multiple style options including cinematic, anime, realistic, and artistic, you can customize the look and feel of your videos to match your brand or creative needs.",
      
      "Aurora's video enhancement features let you improve existing videos with AI-powered filters, effects, and transformations. Upscale, colorize, or completely transform your footage.",
      
      "Generate videos in multiple formats suitable for different platforms and use cases. From vertical social media clips to widescreen promotional videos, Aurora has you covered."
    ];
  }
}
