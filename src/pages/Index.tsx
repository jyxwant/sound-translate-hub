import { useTranslation } from "react-i18next";
import { AudioConverter } from "@/features/converter/components/AudioConverter";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ProductSchema } from "@/components/seo/ProductSchema";
import { Files, Zap, Shield, ArrowRight } from "lucide-react";

const Index = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  const features = [
    {
      icon: Files,
      titleKey: "benefits.batch",
      descKey: "features.batchDesc",
      highlight: true,
    },
    {
      icon: Shield,
      titleKey: "benefits.noUpload", 
      descKey: "features.privacyDesc",
    },
    {
      icon: Zap,
      titleKey: "benefits.fast",
      descKey: "features.speedDesc",
    },
  ];

  return (
    <>
      <SEOHead />
      <FAQSchema />
      <BreadcrumbSchema />
      <ProductSchema />
      <Layout>
      {/* Hero Section - Professional and Clean */}
      <div className="text-center mb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-6 tracking-normal leading-tight">
            {t("header.title")}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            {t("header.subtitle")}
          </p>
          
          {/* Key Features - Highlight Batch Processing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className={`card-modern p-6 text-center ${
                    feature.highlight 
                      ? 'ring-2 ring-primary/20 bg-primary/5' 
                      : ''
                  }`}
                >
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    feature.highlight 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                  {feature.highlight && (
                    <div className="mt-3 text-xs font-medium text-primary">
                      {t("features.mainSelling")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
            <span>{t("cta.getStarted")}</span>
            <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rtl-flip' : ''}`} />
          </div>
        </div>
      </div>

      {/* Main Converter - Clean Professional Design */}
      <div className="max-w-4xl mx-auto">
        <AudioConverter />
      </div>
    </Layout>
    </>
  );
};

export default Index;
