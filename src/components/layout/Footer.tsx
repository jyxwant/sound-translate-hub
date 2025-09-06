import { useTranslation } from "react-i18next";
import { Github, ExternalLink } from "lucide-react";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t bg-card/50">
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p className="mb-4">{t("footer.tagline")}</p>
        
        {/* GitHub Link */}
        <div className="flex justify-center items-center gap-2 mb-2">
          <a 
            href="https://github.com/jyxwant/sound-translate-hub" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors duration-200"
          >
            <Github className="w-4 h-4" />
            <span>{t("footer.github")}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        
        <div className="text-xs text-muted-foreground/70">
          {t("footer.openSource")}
        </div>
      </div>
    </footer>
  );
};

