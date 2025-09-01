import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Volume2, Settings } from "lucide-react";

interface AudioOptionsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

export const AudioOptions = ({ settings, onSettingsChange }: AudioOptionsProps) => {
  const { t } = useTranslation();

  const updateSetting = (key: string, value: string) => {
    onSettingsChange((prev: any) => ({ ...prev, [key]: value }));
  };

  const bitrateOptions = [
    { value: "64", label: "64 kbps" },
    { value: "128", label: "128 kbps" },
    { value: "192", label: "192 kbps" },
    { value: "256", label: "256 kbps" },
    { value: "320", label: "320 kbps" },
  ];

  const sampleRateOptions = [
    { value: "22050", label: "22.05 kHz" },
    { value: "44100", label: "44.1 kHz" },
    { value: "48000", label: "48 kHz" },
    { value: "96000", label: "96 kHz" },
  ];

  const channelOptions = [
    { value: "mono", label: t("audioOptions.mono") },
    { value: "stereo", label: t("audioOptions.stereo") },
  ];

  const volumeOptions = [
    { value: "50", label: "50%" },
    { value: "75", label: "75%" },
    { value: "100", label: "100%" },
    { value: "125", label: "125%" },
    { value: "150", label: "150%" },
    { value: "200", label: "200%" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          {t("converter.options")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Audio Quality */}
          <div className="space-y-2">
            <Label>{t("audioOptions.quality")}</Label>
            <Select 
              value={settings.quality} 
              onValueChange={(value) => updateSetting("quality", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="highest">Highest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bitrate */}
          <div className="space-y-2">
            <Label>{t("audioOptions.bitrate")}</Label>
            <Select 
              value={settings.bitrate} 
              onValueChange={(value) => updateSetting("bitrate", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bitrateOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sample Rate */}
          <div className="space-y-2">
            <Label>{t("audioOptions.sampleRate")}</Label>
            <Select 
              value={settings.sampleRate} 
              onValueChange={(value) => updateSetting("sampleRate", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sampleRateOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Channels */}
          <div className="space-y-2">
            <Label>{t("audioOptions.channels")}</Label>
            <Select 
              value={settings.channels} 
              onValueChange={(value) => updateSetting("channels", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {channelOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Volume */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            {t("audioOptions.volume")}
          </Label>
          <Select 
            value={settings.volume} 
            onValueChange={(value) => updateSetting("volume", value)}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {volumeOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};