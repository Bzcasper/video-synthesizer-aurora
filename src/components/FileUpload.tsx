import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  accept: string;
  icon: React.ReactNode;
  onChange: (files: FileList) => void;
  className?: string;
}

const FileUpload = ({
  label,
  accept,
  icon,
  onChange,
  className,
}: FileUploadProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      <div className="relative">
        <input
          type="file"
          accept={accept}
          multiple
          className="hidden"
          id={`file-upload-${label}`}
          onChange={(e) => e.target.files && onChange(e.target.files)}
        />
        <label htmlFor={`file-upload-${label}`} className="cursor-pointer">
          <div className="h-24 rounded border-2 border-dashed border-muted-foreground/25 flex items-center justify-center hover:border-primary/50 transition-colors group">
            <div className="text-center space-y-2">
              <div className="transform group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <p className="text-sm text-muted-foreground">
                Drop {label.toLowerCase()} or click to upload
              </p>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
