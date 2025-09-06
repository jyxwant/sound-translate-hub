import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

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
    { value: "320", label: "320 kbps" },
    { value: "original", label: t("audioOptions.noChange") },
  ];
  const sampleRateOptions = [
    { value: "8000", label: "8 kHz" },
    { value: "16000", label: "16 kHz" },
    { value: "32000", label: "32 kHz" },
    { value: "44100", label: "44.1 kHz" },
    { value: "48000", label: "48 kHz" },
    { value: "original", label: t("audioOptions.noChange") },
  ];
  const channelOptions = [
    { value: "mono", label: t("audioOptions.mono") },
    { value: "stereo", label: t("audioOptions.stereo") },
  ];
  const volumeOptions = ["50", "75", "100", "125", "150", "200"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          {t("converter.options")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>{t("audioOptions.bitrate")}</Label>
            <Select value={settings.bitrate} onValueChange={(v) => updateSetting("bitrate", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bitrateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("audioOptions.sampleRate")}</Label>
            <Select value={settings.sampleRate} onValueChange={(v) => updateSetting("sampleRate", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sampleRateOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("audioOptions.channels")}</Label>
            <Select value={settings.channels} onValueChange={(v) => updateSetting("channels", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {channelOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

