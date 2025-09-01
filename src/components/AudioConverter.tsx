import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "./FileUpload";
import { AudioOptions } from "./AudioOptions";
import { TrimOptions } from "./TrimOptions";
import { Music, ArrowRight, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const audioFormats = [
  { value: "mp3", label: "MP3", description: "Most compatible" },
  { value: "wav", label: "WAV", description: "Uncompressed" },
  { value: "aac", label: "AAC", description: "High quality" },
  { value: "flac", label: "FLAC", description: "Lossless" },
  { value: "ogg", label: "OGG", description: "Open source" },
  { value: "m4a", label: "M4A", description: "Apple format" },
  { value: "wma", label: "WMA", description: "Windows format" },
];

interface ConversionSettings {
  fromFormat: string;
  toFormat: string;
  quality: string;
  bitrate: string;
  sampleRate: string;
  channels: string;
  volume: string;
  trimStart: string;
  trimEnd: string;
}

export const AudioConverter = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] = useState<string | null>(null);
  const [settings, setSettings] = useState<ConversionSettings>({
    fromFormat: "",
    toFormat: "mp3",
    quality: "high",
    bitrate: "192",
    sampleRate: "44100",
    channels: "stereo",
    volume: "100",
    trimStart: "",
    trimEnd: "",
  });

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    // Auto-detect source format from file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension && audioFormats.some(format => format.value === extension)) {
      setSettings(prev => ({ ...prev, fromFormat: extension }));
    }
    setConversionResult(null);
    toast.success(`File "${file.name}" selected`);
  }, []);

  const handleConvert = async () => {
    if (!selectedFile) {
      toast.error(t("errors.unsupportedFormat"));
      return;
    }

    setIsConverting(true);
    
    try {
      // Mock conversion - in real app, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result URL
      const mockResultUrl = URL.createObjectURL(selectedFile);
      setConversionResult(mockResultUrl);
      
      toast.success("Conversion completed successfully!");
    } catch (error) {
      toast.error(t("errors.conversionFailed"));
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (conversionResult && selectedFile) {
      const link = document.createElement('a');
      link.href = conversionResult;
      link.download = `${selectedFile.name.split('.')[0]}.${settings.toFormat}`;
      link.click();
      toast.success("Download started!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Format Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            {t("converter.convert")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium mb-2">
                {t("converter.fromFormat")}
              </label>
              <Select 
                value={settings.fromFormat} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, fromFormat: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Auto-detect" />
                </SelectTrigger>
                <SelectContent>
                  {audioFormats.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{format.label}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {format.description}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            
            <div className="flex-1 max-w-xs">
              <label className="block text-sm font-medium mb-2">
                {t("converter.toFormat")}
              </label>
              <Select 
                value={settings.toFormat} 
                onValueChange={(value) => setSettings(prev => ({ ...prev, toFormat: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {audioFormats.map(format => (
                    <SelectItem key={format.value} value={format.value}>
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{format.label}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {format.description}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <FileUpload onFileSelect={handleFileSelect} selectedFile={selectedFile} />
        </CardContent>
      </Card>

      {/* Options */}
      {selectedFile && (
        <>
          <AudioOptions settings={settings} onSettingsChange={setSettings} />
          <TrimOptions settings={settings} onSettingsChange={setSettings} />
        </>
      )}

      {/* Convert Button */}
      {selectedFile && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              <div className="flex gap-3">
                {conversionResult ? (
                  <Button onClick={handleDownload} className="gap-2">
                    <Download className="h-4 w-4" />
                    {t("converter.download")}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleConvert}
                    disabled={isConverting}
                    className="gap-2"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("converter.converting")}
                      </>
                    ) : (
                      t("converter.convert")
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};