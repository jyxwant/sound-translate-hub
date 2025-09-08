import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

export const BreadcrumbSchema = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  
  const breadcrumbLabels = {
    en: {
      home: "Home",
      converter: "Audio Converter"
    },
    zh: {
      home: "首页", 
      converter: "音频转换器"
    },
    fr: {
      home: "Accueil",
      converter: "Convertisseur Audio"
    },
    es: {
      home: "Inicio",
      converter: "Conversor de Audio"
    },
    ru: {
      home: "Главная",
      converter: "Аудио Конвертер"
    },
    ar: {
      home: "الرئيسية",
      converter: "محول الصوت"
    },
    ja: {
      home: "ホーム",
      converter: "オーディオコンバーター"
    },
    ko: {
      home: "홈",
      converter: "오디오 변환기"
    }
  };

  const labels = breadcrumbLabels[currentLang as keyof typeof breadcrumbLabels] || breadcrumbLabels.en;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": labels.home,
              "item": `https://audioconverter.tech/${currentLang}/`
            },
            {
              "@type": "ListItem", 
              "position": 2,
              "name": labels.converter,
              "item": `https://audioconverter.tech/${currentLang}/`
            }
          ]
        })}
      </script>
    </Helmet>
  );
};