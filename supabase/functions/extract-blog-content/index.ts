// supabase/functions/extract-blog-content/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

// Text extraction and processing libraries
import { extract } from "https://esm.sh/article-parser@7.0.0";
import { load as cheerioLoad } from "https://esm.sh/cheerio@1.0.0-rc.12";

// Create a Supabase client for interacting with the database
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

async function extractBlogContent(url: string) {
  try {
    // Use article-parser to extract main content
    const article = await extract(url);

    if (!article || !article.content) {
      throw new Error("Failed to extract content from URL");
    }

    // Use cheerio to parse HTML content
    const $ = cheerioLoad(article.content);

    // Extract paragraphs and headings
    const sections: string[] = [];

    // Get title
    if (article.title) {
      sections.push(article.title);
    }

    // Process paragraphs
    $("p").each((_, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 30) {
        // Only include substantial paragraphs
        sections.push(text);
      }
    });

    // Include headings with their content
    $("h1, h2, h3").each((_, elem) => {
      const headingText = $(elem).text().trim();
      if (headingText.length > 10) {
        sections.push(headingText);
      }
    });

    // Extract quotes
    $("blockquote").each((_, elem) => {
      const quoteText = $(elem).text().trim();
      if (quoteText.length > 0) {
        sections.push(`"${quoteText}"`);
      }
    });

    // Filter and limit sections to most important ones
    const filteredSections = sections
      .filter((section) => section.length >= 10 && section.length <= 300)
      .filter(
        (section, index, self) =>
          // Remove duplicates
          index === self.findIndex((s) => s === section),
      )
      .slice(0, 10); // Limit to 10 sections

    // Ensure we have at least some content
    if (filteredSections.length === 0) {
      // Use a fallback method or return an error
      throw new Error("No suitable content sections found in the blog post");
    }

    return {
      title: article.title,
      author: article.author,
      published: article.published,
      sections: filteredSections,
      url: article.url || url,
    };
  } catch (error) {
    console.error("Error extracting content:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request
    const { url } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract content from blog URL
    const content = await extractBlogContent(url);

    // Return extracted content
    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in extract-blog-content function:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to extract blog content",
        message: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
