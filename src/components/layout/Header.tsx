import { Music2 } from "lucide-react";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/50 border-b border-border/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className={`flex items-center gap-3 ${dir === "rtl" ? "order-2" : ""}`}>
          <div className="p-2 rounded-lg bg-primary/10">
            <Music2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">{t("app.title")}</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              {t("app.description")}
            </p>
          </div>
        </div>
        <div className={dir === "rtl" ? "order-1" : ""}>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};
