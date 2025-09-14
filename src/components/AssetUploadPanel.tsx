import React from "react";
import { Image as ImageIcon, FileAudio } from "lucide-react";
import FileUpload from "@/components/FileUpload";

interface AssetUploadPanelProps {
  onUpload: (files: FileList, type: "image" | "audio") => Promise<void>;
}

const AssetUploadPanel = ({ onUpload }: AssetUploadPanelProps) => {
  return (
    <div className="glass-panel p-4 space-y-4 hover-glow animate-fade-in">
      <FileUpload
        label="Reference Images"
        accept="image/*"
        icon={<ImageIcon className="w-5 h-5" />}
        onChange={(files) => onUpload(files, "image")}
      />

      <FileUpload
        label="Audio Track"
        accept="audio/*"
        icon={<FileAudio className="w-5 h-5" />}
        onChange={(files) => onUpload(files, "audio")}
      />
    </div>
  );
};

export default AssetUploadPanel;
