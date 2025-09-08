import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const LANGS = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const current = useMemo(() => {
    const match = LANGS.find((l) => i18n.language?.startsWith(l.code));
    return match ?? LANGS[0];
  }, [i18n.language]);

  // Keep <html> lang and dir in sync with i18n
  useEffect(() => {
    const html = document.documentElement;
    html.lang = i18n.language || current.code;
    // Let i18next decide direction (handles ar, fa, he, ur, ...)
    html.dir = i18n.dir();
  }, [i18n.language, i18n, current.code]);

  const change = (code: string) => {
    // Navigate to the new language URL
    navigate(`/${code}/`);
  };

  const dir = i18n.dir();
  return (
    <DropdownMenu dir={dir}>
      <DropdownMenuTrigger asChild>
        <Button data-testid="language-switcher" variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {current.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={dir === "rtl" ? "start" : "end"}
        className={cn(dir === "rtl" && "text-right")}
      >
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => change(l.code)}
            className={cn(
              l.code === current.code ? "bg-accent" : "",
              dir === "rtl" && "w-full justify-end"
            )}
          >
            {l.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
