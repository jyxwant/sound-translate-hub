import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, X } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

const SUPPORTED_FORMATS = [
  "audio/mpeg", // MP3
  "audio/wav", // WAV
  "audio/aac", // AAC
  "audio/flac", // FLAC
  "audio/ogg", // OGG
  "audio/mp4", // M4A
  "audio/x-ms-wma", // WMA
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const FileUpload = ({ onFileSelect, selectedFile }: FileUploadProps) => {
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(t("errors.fileTooLarge"));
      return;
    }

    onFileSelect(file);
  }, [onFileSelect, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.aac', '.flac', '.ogg', '.m4a', '.wma']
    },
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = () => {
    // Reset to show upload area again
    window.location.reload();
  };

  if (selectedFile) {
    return (
      <Card className="relative">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <File className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      {...getRootProps()} 
      className={`border-2 border-dashed transition-colors cursor-pointer ${
        isDragActive 
          ? "border-primary bg-primary/5" 
          : "border-muted-foreground/25 hover:border-primary/50"
      }`}
    >
      <CardContent className="p-12 text-center">
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">
              {t("converter.selectFile")}
            </h3>
            <p className="text-muted-foreground max-w-sm">
              {t("converter.dragDrop")}
            </p>
          </div>
          
          <Button variant="outline">
            {t("converter.selectFile")}
          </Button>
          
          <div className="text-xs text-muted-foreground">
            <p>Supported formats: MP3, WAV, AAC, FLAC, OGG, M4A, WMA</p>
            <p>Maximum file size: 100MB</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};