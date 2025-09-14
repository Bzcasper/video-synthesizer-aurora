import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Type, Upload, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubtitleVideoControlProps {
  videoId: string;
  onSubmit: (params: { subtitleUrl: string }) => void;
  isProcessing?: boolean;
}

const SubtitleVideoControl = ({
  videoId,
  onSubmit,
  isProcessing = false,
}: SubtitleVideoControlProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith(".srt")) {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a .srt subtitle file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const { data, error } = await supabase.storage
      .from("subtitles")
      .upload(`${videoId}-${Date.now()}-${file.name}`, file);

    if (error) {
      console.error("Error uploading subtitle:", error);
      return;
    }

    const publicURL = supabase.storage.from("subtitles").getPublicUrl(data.path)
      .data.publicUrl;

    onSubmit({ subtitleUrl: publicURL });
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="subtitle-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-white/10 bg-black/20 hover:bg-black/30 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-400">.srt files only</p>
          </div>
          <input
            id="subtitle-upload"
            type="file"
            accept=".srt"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {file && (
        <div className="text-sm text-gray-400">Selected file: {file.name}</div>
      )}

      <Button
        className="w-full bg-aurora-blue hover:bg-aurora-blue/80 text-white"
        onClick={handleUpload}
        disabled={isProcessing || !file}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload & Apply Subtitles"
        )}
      </Button>
    </div>
  );
};

export default SubtitleVideoControl;
