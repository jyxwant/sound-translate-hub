import { useMemo, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/features/converter/components/FileUpload";
import { Music, ArrowRight, Download, Loader2, Archive, Shield, Settings } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { convertAudio, loadConverter, isConverterLoaded, isConverterLoading } from "@/features/converter/audioConverter";
import { Progress } from "@/components/ui/progress";
import { zipBlobs } from "@/lib/zip";

interface ConversionSettings {
  fromFormat: string;
  toFormat: string;
  quality: string;
  bitrate: string;
  sampleRate: string;
  channels: string;
}

export const AudioConverter = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const [files, setFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [zipGenerating, setZipGenerating] = useState(false);
  const [settings, setSettings] = useState<ConversionSettings>({
    fromFormat: "",
    toFormat: "mp3",
    quality: "high",
    bitrate: "320",
    sampleRate: "44100",
    channels: "stereo",
  });

  type TaskStatus = 'queued' | 'processing' | 'done' | 'error';
  type Task = {
    id: string;
    file: File;
    status: TaskStatus;
    progress: number; // 0..100
    outputUrl?: string;
    outputName?: string;
    error?: string;
  };
  const [tasks, setTasks] = useState<Task[]>([]);
  const abortRef = useRef<{ aborted: boolean }>({ aborted: false });

  const audioFormats = useMemo(
    () => [
      { value: "mp3", label: t("formats.mp3"), description: t("formatDesc.mp3") },
      { value: "wav", label: t("formats.wav"), description: t("formatDesc.wav") },
      { value: "flac", label: t("formats.flac"), description: t("formatDesc.flac") },
      { value: "aac", label: t("formats.aac"), description: t("formatDesc.aac") },
      { value: "ogg", label: t("formats.ogg"), description: t("formatDesc.ogg") },
      { value: "opus", label: "OPUS", description: "Open source" },
    ],
    [t]
  );

  const handleFilesSelect = useCallback((newFiles: File[]) => {
    setFiles(newFiles);
    const first = newFiles[0];
    const ext = first?.name.split(".").pop()?.toLowerCase();
    if (ext && audioFormats.some((f) => f.value === ext)) {
      setSettings((prev) => ({ ...prev, fromFormat: ext }));
    }
    const initialTasks: Task[] = newFiles.map((f) => ({
      id: `${f.name}-${f.size}-${f.lastModified}`,
      file: f,
      status: 'queued',
      progress: 0,
    }));
    setTasks(initialTasks);
    toast.success(t("file.selected", { name: `${newFiles.length} files` }));
    // 预加载转换器引擎（轻量级库不需要预加载）
    if (!isConverterLoaded() && !isConverterLoading()) {
      loadConverter().catch(() => {});
    }
  }, [audioFormats, t]);

  const handleClear = useCallback(() => {
    setFiles([]);
    setSettings((p) => ({ ...p, fromFormat: "" }));
    setTasks([]);
  }, []);

  const handleConvert = async () => {
    if (!files.length) {
      toast.error(t("errors.unsupportedFormat"));
      return;
    }
    
    // 轻量级转换器无需预加载，直接开始转换
    if (!isConverterLoaded()) {
      toast.info("初始化音频转换引擎...", {
        duration: 2000,
      });
    }
    
    setIsConverting(true);
    abortRef.current.aborted = false;
    
    try {
      const nextTasks = tasks.map((t) => ({ 
        ...t, 
        status: 'queued' as TaskStatus, 
        progress: 0, 
        outputUrl: undefined, 
        outputName: undefined, 
        error: undefined 
      }));
      setTasks(nextTasks);

      // 轻量级转换器已就绪
      try {
        await loadConverter();
        console.log('轻量级音频转换器已就绪');
      } catch (error) {
        console.error('转换器初始化失败:', error);
        toast.error("转换器初始化失败，请刷新页面重试");
        setIsConverting(false);
        return;
      }

      for (let i = 0; i < nextTasks.length; i++) {
        if (abortRef.current.aborted) break;
        const task = nextTasks[i];
        
        // mark processing
        setTasks((prev) => prev.map((x) => 
          x.id === task.id ? { ...x, status: 'processing' as TaskStatus, progress: 0 } : x
        ));
        
        try {
          console.log(`Converting file ${i + 1}/${nextTasks.length}:`, task.file.name);
          
          const { blob, outputName } = await convertAudio(
            task.file, 
            {
              toFormat: settings.toFormat,
              bitrate: settings.bitrate === 'original' ? undefined : settings.bitrate,
              sampleRate: settings.sampleRate === 'original' ? undefined : settings.sampleRate,
              channels: settings.channels === 'mono' ? 'mono' : 'stereo',
            }, 
            (p) => {
              console.log(`Progress for ${task.file.name}:`, p);
              setTasks((prev) => prev.map((x) => 
                x.id === task.id ? { ...x, progress: Math.round(p * 100) } : x
              ));
            }
          );

          const url = URL.createObjectURL(blob);
          setTasks((prev) => prev.map((x) => 
            x.id === task.id ? { 
              ...x, 
              status: 'done' as TaskStatus, 
              progress: 100, 
              outputUrl: url, 
              outputName 
            } : x
          ));
          
          console.log(`Successfully converted: ${task.file.name} -> ${outputName}`);
        } catch (err: any) {
          console.error(`Failed to convert ${task.file.name}:`, err);
          setTasks((prev) => prev.map((x) => 
            x.id === task.id ? { 
              ...x, 
              status: 'error' as TaskStatus, 
              error: String(err) 
            } : x
          ));
          toast.error(`Failed to convert ${task.file.name}: ${String(err)}`);
        }
      }

      const successCount = tasks.filter(t => t.status === 'done').length;
      if (successCount > 0) {
        toast.success(t("conversion.success") + ` (${successCount}/${tasks.length})`);
      }
    } catch (err) {
      console.error('Conversion process failed:', err);
      toast.error(t("errors.conversionFailed"));
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownloadAllZip = async () => {
    const done = tasks.filter((t) => t.status === 'done' && t.outputUrl && t.outputName);
    if (!done.length) return;
    setZipGenerating(true);
    try {
      const files = await Promise.all(done.map(async (t) => ({
        name: t.outputName!,
        blob: await fetch(t.outputUrl!).then((r) => r.blob()),
      })));
      const zipBlob = await zipBlobs(files);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted_${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t("download.started"));
    } catch (e) {
      toast.error(t("errors.conversionFailed"));
    } finally {
      setZipGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Main converter card - Professional ChatGPT style */}
      <div className="card-modern p-8 max-w-4xl mx-auto">
        
        {/* Privacy Badge */}
        <div className="flex items-center justify-center gap-2 mb-8 p-3 rounded-lg bg-success-light text-success border border-success/20">
          <Shield className="h-4 w-4" />
          <span className="text-sm font-medium">
            {t("privacy.localProcessing")}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Format Selection */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {t("steps.selectFormat")}
            </h2>
            
            <div className="space-y-4">
              {/* From Format */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("converter.fromFormat")}
                </label>
                <Select
                  dir={dir}
                  value={settings.fromFormat}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, fromFormat: value }))}
                >
                  <SelectTrigger className={cn("input-modern h-12", dir === "rtl" && "text-right")}>
                    <SelectValue placeholder={t("converter.autoDetect")} />
                  </SelectTrigger>
                  <SelectContent>
                    {audioFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className={cn("flex items-center justify-between w-full", dir === "rtl" && "flex-row-reverse")}>
                          <span className="font-medium">{format.label}</span>
                          <span className={cn("text-xs text-muted-foreground", dir === "rtl" ? "mr-2" : "ml-2")}>
                            {format.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Arrow Indicator */}
              <div className="flex justify-center">
                <ArrowRight className={cn("w-5 h-5 text-muted-foreground", dir === "rtl" && "rtl-flip")} />
              </div>

              {/* To Format */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("converter.toFormat")}
                </label>
                <Select
                  dir={dir}
                  value={settings.toFormat}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, toFormat: value }))}
                >
                  <SelectTrigger className={cn("input-modern h-12 ring-2 ring-primary/20", dir === "rtl" && "text-right")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {audioFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className={cn("flex items-center justify-between w-full", dir === "rtl" && "flex-row-reverse")}>
                          <span className="font-medium">{format.label}</span>
                          <span className={cn("text-xs text-muted-foreground", dir === "rtl" ? "mr-2" : "ml-2")}>
                            {format.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Right Column - Audio Settings */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {t("steps.adjustSettings")}
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("audioOptions.bitrate")}
                </label>
                <Select
                  dir={dir}
                  value={settings.bitrate}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, bitrate: value }))}
                >
                  <SelectTrigger className={cn("input-modern", dir === "rtl" && "text-right")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="64">64 kbps</SelectItem>
                    <SelectItem value="128">128 kbps</SelectItem>
                    <SelectItem value="192">192 kbps</SelectItem>
                    <SelectItem value="320">320 kbps</SelectItem>
                    <SelectItem value="original">{t("audioOptions.noChange")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("audioOptions.sampleRate")}
                </label>
                <Select
                  dir={dir}
                  value={settings.sampleRate}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, sampleRate: value }))}
                >
                  <SelectTrigger className={cn("input-modern", dir === "rtl" && "text-right")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8000">8 kHz</SelectItem>
                    <SelectItem value="16000">16 kHz</SelectItem>
                    <SelectItem value="32000">32 kHz</SelectItem>
                    <SelectItem value="44100">44.1 kHz</SelectItem>
                    <SelectItem value="48000">48 kHz</SelectItem>
                    <SelectItem value="original">{t("audioOptions.noChange")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t("audioOptions.channels")}
                </label>
                <Select
                  dir={dir}
                  value={settings.channels}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, channels: value }))}
                >
                  <SelectTrigger className={cn("input-modern", dir === "rtl" && "text-right")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mono">{t("audioOptions.mono")}</SelectItem>
                    <SelectItem value="stereo">{t("audioOptions.stereo")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Upload Section - Highlight Batch Feature */}
      <div className="card-modern p-8 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {t("steps.selectFiles")}
          </h2>
          <p className="text-muted-foreground">
            {t("features.batchDesc")}
          </p>
        </div>
        
        <FileUpload onFilesSelect={handleFilesSelect} selectedFiles={files} onClear={handleClear} />
      </div>

      {/* Action and Progress Section */}
      {files.length > 0 && (
        <div className="card-modern p-8 max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {t("steps.convertDownload")}
            </h2>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleConvert} 
              disabled={isConverting || files.length === 0} 
              className="btn-primary h-12 px-8 text-base font-medium min-w-[200px]"
              size="lg"
            >
              {isConverting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {t("converter.converting")}...
                </>
              ) : (
                <>
                  <Music className="h-5 w-5 mr-2" />
                  {t("converter.convert")} ({files.length} {files.length === 1 ? "file" : "files"})
                </>
              )}
            </Button>
            
            {tasks.filter((t) => t.status === 'done').length > 0 && (
              <Button 
                onClick={handleDownloadAllZip} 
                disabled={zipGenerating} 
                variant="outline" 
                className="h-12 px-8 text-base font-medium border-2 min-w-[200px]"
                size="lg"
              >
                {zipGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Archive className="h-5 w-5 mr-2" />
                    Download ZIP
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Progress Display */}
          {tasks.length > 0 && (
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Progress</h3>
                <span className="text-sm font-medium text-muted-foreground">
                  {tasks.filter(t => t.status === 'done').length} / {tasks.length} completed
                </span>
              </div>
              
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-background rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{task.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(task.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        {task.status === 'done' && task.outputUrl && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 px-3 text-xs" 
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = task.outputUrl!;
                              a.download = task.outputName ?? task.file.name;
                              a.click();
                            }}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        )}
                        {task.status === 'processing' && (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            <span className="text-sm font-medium text-primary">{task.progress}%</span>
                          </div>
                        )}
                        {task.status === 'error' && (
                          <span className="text-sm font-medium text-destructive">Failed</span>
                        )}
                        {task.status === 'done' && (
                          <span className="text-sm font-medium text-success">✓</span>
                        )}
                      </div>
                    </div>
                    <Progress 
                      value={task.status === 'done' ? 100 : task.progress} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
