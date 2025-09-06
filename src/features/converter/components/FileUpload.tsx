import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onFilesSelect: (files: File[]) => void;
  selectedFiles?: File[];
  onClear?: () => void;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB per file

export const FileUpload = ({ onFilesSelect, selectedFiles = [], onClear }: FileUploadProps) => {
  const { t } = useTranslation();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = acceptedFiles.filter((f) => {
        if (f.size > MAX_FILE_SIZE) {
          toast.error(t("errors.fileTooLarge"));
          return false;
        }
        return true;
      });
      if (files.length) onFilesSelect(files);
    },
    [onFilesSelect, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/*": [".mp3", ".wav", ".aac", ".flac", ".ogg", ".m4a", ".wma"],
    },
    multiple: true,
  });

  const removeFile = () => {
    if (onClear) onClear();
  };

  if (selectedFiles.length > 0) {
    return (
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
              <File className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-base text-primary mb-1">
                {selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"} ready for conversion
              </p>
              <div className="space-y-1">
                {selectedFiles.slice(0, 3).map((file, index) => (
                  <p key={index} className="text-sm text-muted-foreground truncate">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </p>
                ))}
                {selectedFiles.length > 3 && (
                  <p className="text-sm text-muted-foreground font-medium">
                    + {selectedFiles.length - 3} more files
                  </p>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={removeFile} 
            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0 flex-shrink-0"
            title="Remove all files"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`file-upload-zone border-2 border-dashed rounded-lg cursor-pointer hover-glow ${
        isDragActive 
          ? "drag-active border-primary bg-primary/5" 
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
      }`}
    >
      <div className="p-8 sm:p-12 text-center">
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-6 animate-slide-up">
          <div className={`p-4 rounded-full transition-all duration-500 ${
            isDragActive ? "bg-primary/20 scale-110 animate-bounce-gentle" : "bg-primary/10"
          }`}>
            <Upload className={`h-10 w-10 transition-colors duration-300 ${
              isDragActive ? "text-primary animate-pulse-soft" : "text-primary/80"
            }`} />
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xl transition-colors duration-300">
              {isDragActive ? "Drop your files here!" : "Select Audio Files"}
            </h3>
            <p className="text-muted-foreground max-w-sm leading-relaxed transition-all duration-300">
              {isDragActive 
                ? "Release to add files for batch conversion" 
                : "Drag & drop multiple files or click to browse. Perfect for batch processing!"
              }
            </p>
          </div>

          <Button 
            variant="outline" 
            size="lg" 
            className="px-8 py-3 text-base font-medium hover-lift focus-ring"
          >
            Browse Files
          </Button>

          <div className="text-xs text-muted-foreground space-y-1 transition-opacity duration-300 opacity-75 hover:opacity-100">
            <p className="font-medium">{t("file.supportedFormats")}: MP3, WAV, AAC, FLAC, OGG, OPUS</p>
            <p>{t("file.maxFileSize", { size: "100MB per file" })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
