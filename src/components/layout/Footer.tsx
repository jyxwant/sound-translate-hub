import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t bg-card/50">
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
        <p>{t("footer.tagline")}</p>
      </div>
    </footer>
  );
};

