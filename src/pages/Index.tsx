import { useTranslation } from "react-i18next";
import { AudioConverter } from "@/components/AudioConverter";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Music2 } from "lucide-react";

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Music2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t("app.title")}</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                {t("app.description")}
              </p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t("header.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("header.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <AudioConverter />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 Audio Converter. Professional audio conversion service.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
