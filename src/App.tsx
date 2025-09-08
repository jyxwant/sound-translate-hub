import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";
import { DirectionProvider } from "@radix-ui/react-direction";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle root redirect based on browser language
const RootRedirect = () => {
  const { i18n } = useTranslation();
  
  // Get browser language and find best match
  const getBestLanguageMatch = () => {
    const browserLang = navigator.language.toLowerCase();
    const browserLangCode = browserLang.split('-')[0]; // e.g., 'en' from 'en-US'
    
    // Check if we support the exact language code
    if (supportedLanguages.includes(browserLangCode)) {
      return browserLangCode;
    }
    
    // Check for language variants (e.g., 'zh-cn' -> 'zh')
    const langMap: { [key: string]: string } = {
      'zh-cn': 'zh',
      'zh-tw': 'zh',
      'zh-hk': 'zh',
      'en-us': 'en',
      'en-gb': 'en',
      'fr-fr': 'fr',
      'fr-ca': 'fr',
      'es-es': 'es',
      'es-mx': 'es',
      'ru-ru': 'ru',
      'ja-jp': 'ja',
      'ko-kr': 'ko'
    };
    
    if (langMap[browserLang]) {
      return langMap[browserLang];
    }
    
    // Default to English
    return 'en';
  };
  
  const targetLang = getBestLanguageMatch();
  return <Navigate to={`/${targetLang}/`} replace />;
  
};

const supportedLanguages = ["en", "zh", "fr", "es", "ru", "ar", "ja", "ko"];

// Component to handle language-specific routing
const LanguageRoute = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    if (lang && supportedLanguages.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // If invalid language, redirect to English
  if (lang && !supportedLanguages.includes(lang)) {
    return <Navigate to="/en/" replace />;
  }

  return <Index />;
};

const AppContent = () => {
  const { i18n } = useTranslation();
  const dir = i18n.dir();
  
  return (
    <DirectionProvider dir={dir}>
      <BrowserRouter>
        <Routes>
          {/* Root redirect based on browser language */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Language-specific routes */}
          <Route path="/:lang/" element={<LanguageRoute />} />
          
          {/* Legacy support - redirect old root to English */}
          <Route path="/index" element={<Navigate to="/en/" replace />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DirectionProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
