
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FileUploadProps {
  label: string;
  accept: string;
  icon: React.ReactNode;
  onChange: (files: FileList) => void;
}

const FileUpload = ({ label, accept, icon, onChange }: FileUploadProps) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="relative">
        <input
          type="file"
          accept={accept}
          multiple
          className="hidden"
          id="file-upload"
          onChange={(e) => e.target.files && onChange(e.target.files)}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="h-24 rounded border-2 border-dashed border-muted-foreground/25 flex items-center justify-center hover:border-primary/50 transition-colors">
            <div className="text-center space-y-2">
              {icon}
              <p className="text-sm text-muted-foreground">
                Drop files or click to upload
              </p>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
