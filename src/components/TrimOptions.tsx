import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors } from "lucide-react";

interface TrimOptionsProps {
  settings: any;
  onSettingsChange: (settings: any) => void;
}

export const TrimOptions = ({ settings, onSettingsChange }: TrimOptionsProps) => {
  const { t } = useTranslation();

  const updateSetting = (key: string, value: string) => {
    onSettingsChange((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          {t("trim.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trimStart">{t("trim.start")}</Label>
            <Input
              id="trimStart"
              placeholder={t("trim.placeholder")}
              value={settings.trimStart}
              onChange={(e) => updateSetting("trimStart", e.target.value)}
              pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trimEnd">{t("trim.end")}</Label>
            <Input
              id="trimEnd"
              placeholder={t("trim.placeholder")}
              value={settings.trimEnd}
              onChange={(e) => updateSetting("trimEnd", e.target.value)}
              pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
            />
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          {t("trim.placeholder")} format (e.g., 00:01:30 for 1 minute 30 seconds)
        </p>
      </CardContent>
    </Card>
  );
};