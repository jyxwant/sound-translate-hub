import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const supportedLanguages = ["en", "zh", "fr", "es", "ru", "ar", "ja", "ko"];

export const SEOHead = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";

  // SEO优化的长尾关键词策略
  const seoData = {
    en: {
      title: "Audio Converter - Convert MP3 WAV FLAC AAC Files Online Free",
      description: "Lightning-fast browser-based audio converter. Convert MP3, WAV, FLAC, AAC, OGG files instantly without uploads. Batch convert multiple audio files simultaneously. 300x faster than FFmpeg, completely private and secure. Works offline in your browser.",
      keywords: "audio converter, mp3 converter, wav converter, flac converter, aac converter, ogg converter, online audio converter, free audio converter, batch audio converter, fast audio conversion, browser audio converter, no upload converter, private audio converter, web audio converter, audio format converter, convert audio online, audio file converter, music converter, sound converter, lossless audio converter",
      ogTitle: "Audio Converter - Convert MP3 WAV FLAC AAC Files Fast & Private",
      ogDescription: "Convert MP3, WAV, FLAC, AAC files instantly in your browser. No uploads, batch processing, 300x faster performance. Completely free and private.",
      author: "Audio Converter Tech"
    },
    zh: {
      title: "音频转换器 - 在线转换MP3 WAV FLAC AAC文件免费快速",
      description: "超快浏览器音频转换工具。即时转换MP3、WAV、FLAC、AAC、OGG文件，无需上传。批量转换多个音频文件，比FFmpeg快300倍，完全私密安全。浏览器离线工作。",
      keywords: "音频转换器, mp3转换器, wav转换器, flac转换器, aac转换器, ogg转换器, 在线音频转换, 免费音频转换, 批量音频转换, 快速音频转换, 浏览器音频转换, 无上传转换器, 私密音频转换, 网页音频转换, 音频格式转换, 在线转换音频, 音频文件转换器, 音乐转换器, 声音转换器, 无损音频转换",
      ogTitle: "音频转换器 - 快速私密转换MP3 WAV FLAC AAC文件",
      ogDescription: "在浏览器中即时转换MP3、WAV、FLAC、AAC文件。无需上传、批量处理、性能提升300倍。完全免费私密。",
      author: "音频转换器技术"
    },
    fr: {
      title: "Convertisseur Audio Gratuit - Convertir MP3 WAV FLAC AAC Rapidement",
      description: "Convertisseur audio ultra-rapide dans le navigateur. Convertissez instantanément les fichiers MP3, WAV, FLAC, AAC, OGG sans téléchargement. Conversion par lots de plusieurs fichiers audio simultanément. 300x plus rapide que FFmpeg, complètement privé et sécurisé.",
      keywords: "convertisseur audio, convertisseur mp3, convertisseur wav, convertisseur flac, convertisseur aac, convertisseur ogg, convertisseur audio en ligne, convertisseur audio gratuit, convertisseur audio par lots, conversion audio rapide, convertisseur audio navigateur, convertisseur sans téléchargement, convertisseur audio privé",
      ogTitle: "Convertisseur Audio Gratuit - Convertir Fichiers Audio En Ligne",
      ogDescription: "Convertissez les fichiers MP3, WAV, FLAC, AAC instantanément dans votre navigateur. Sans téléchargement, traitement par lots, performance 300x plus rapide.",
      author: "Audio Converter Tech"
    },
    es: {
      title: "Conversor de Audio Gratis - Convertir MP3 WAV FLAC AAC Rápido",
      description: "Conversor de audio ultrarrápido en el navegador. Convierte instantáneamente archivos MP3, WAV, FLAC, AAC, OGG sin subidas. Conversión por lotes de múltiples archivos de audio simultáneamente. 300x más rápido que FFmpeg, completamente privado y seguro.",
      keywords: "conversor de audio, conversor mp3, conversor wav, conversor flac, conversor aac, conversor ogg, conversor de audio en línea, conversor de audio gratis, conversor de audio por lotes, conversión de audio rápida, conversor de audio del navegador, conversor sin subida, conversor de audio privado",
      ogTitle: "Conversor de Audio Gratis - Convertir Archivos de Audio En Línea",
      ogDescription: "Convierte archivos MP3, WAV, FLAC, AAC instantáneamente en tu navegador. Sin subidas, procesamiento por lotes, rendimiento 300x más rápido.",
      author: "Audio Converter Tech"
    },
    ru: {
      title: "Бесплатный Аудио Конвертер - Конвертация MP3 WAV FLAC AAC Быстро",
      description: "Сверхбыстрый аудио конвертер в браузере. Мгновенное конвертирование MP3, WAV, FLAC, AAC, OGG файлов без загрузки. Пакетное конвертирование нескольких аудио файлов одновременно. В 300 раз быстрее FFmpeg, полностью приватно и безопасно.",
      keywords: "аудио конвертер, mp3 конвертер, wav конвертер, flac конвертер, aac конвертер, ogg конвертер, онлайн аудио конвертер, бесплатный аудио конвертер, пакетный аудио конвертер, быстрое конвертирование аудио, браузерный аудио конвертер",
      ogTitle: "Бесплатный Аудио Конвертер - Конвертация Аудио Файлов Онлайн",
      ogDescription: "Конвертируйте MP3, WAV, FLAC, AAC файлы мгновенно в вашем браузере. Без загрузок, пакетная обработка, производительность в 300 раз выше.",
      author: "Audio Converter Tech"
    },
    ar: {
      title: "محول الصوت المجاني - تحويل ملفات MP3 WAV FLAC AAC بسرعة",
      description: "محول صوتي فائق السرعة في المتصفح. تحويل فوري لملفات MP3، WAV، FLAC، AAC، OGG بدون رفع. تحويل دفعي لملفات صوتية متعددة في نفس الوقت. أسرع 300 مرة من FFmpeg، خاص وآمن تماماً.",
      keywords: "محول الصوت, محول mp3, محول wav, محول flac, محول aac, محول ogg, محول صوت اونلاين, محول صوت مجاني, محول صوت دفعي, تحويل صوت سريع, محول صوت المتصفح, محول بدون رفع, محول صوت خاص",
      ogTitle: "محول الصوت المجاني - تحويل الملفات الصوتية اونلاين",
      ogDescription: "حوّل ملفات MP3، WAV، FLAC، AAC فورياً في متصفحك. بدون رفع، معالجة دفعية، أداء أسرع 300 مرة.",
      author: "Audio Converter Tech"
    },
    ja: {
      title: "無料オーディオコンバーター - MP3 WAV FLAC AAC ファイル高速変換",
      description: "ブラウザ内超高速オーディオコンバーター。MP3、WAV、FLAC、AAC、OGGファイルをアップロード不要で即座に変換。複数のオーディオファイルを同時にバッチ変換。FFmpegより300倍高速、完全にプライベートで安全。",
      keywords: "オーディオコンバーター, mp3コンバーター, wavコンバーター, flacコンバーター, aacコンバーター, oggコンバーター, オンラインオーディオコンバーター, 無料オーディオコンバーター, バッチオーディオコンバーター, 高速オーディオ変換, ブラウザオーディオコンバーター",
      ogTitle: "無料オーディオコンバーター - オンラインオーディオファイル変換",
      ogDescription: "ブラウザでMP3、WAV、FLAC、AAC ファイルを即座に変換。アップロード不要、バッチ処理、300倍高速パフォーマンス。",
      author: "Audio Converter Tech"
    },
    ko: {
      title: "무료 오디오 변환기 - MP3 WAV FLAC AAC 파일 빠른 변환",
      description: "브라우저 내 초고속 오디오 변환기. 업로드 없이 MP3, WAV, FLAC, AAC, OGG 파일을 즉시 변환. 여러 오디오 파일을 동시에 일괄 변환. FFmpeg보다 300배 빠르고, 완전히 비공개이며 안전합니다.",
      keywords: "오디오 변환기, mp3 변환기, wav 변환기, flac 변환기, aac 변환기, ogg 변환기, 온라인 오디오 변환기, 무료 오디오 변환기, 일괄 오디오 변환기, 빠른 오디오 변환, 브라우저 오디오 변환기, 업로드 없는 변환기",
      ogTitle: "무료 오디오 변환기 - 온라인 오디오 파일 변환",
      ogDescription: "브라우저에서 MP3, WAV, FLAC, AAC 파일을 즉시 변환하세요. 업로드 없음, 일괄 처리, 300배 빠른 성능.",
      author: "Audio Converter Tech"
    }
  };

  const currentSEO = seoData[currentLang as keyof typeof seoData] || seoData.en;
  const baseUrl = "https://audioconverter.tech";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{currentSEO.title}</title>
      <meta name="description" content={currentSEO.description} />
      <meta name="keywords" content={currentSEO.keywords} />
      <meta name="author" content={currentSEO.author} />
      
      {/* Language and Direction */}
      <html lang={currentLang} dir={i18n.dir()} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={`${baseUrl}/${currentLang}/`} />
      
      {/* Alternate Language Versions */}
      {supportedLanguages.map((langCode) => (
        <link
          key={langCode}
          rel="alternate"
          hrefLang={langCode}
          href={`${baseUrl}/${langCode}/`}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/en/`} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={currentSEO.ogTitle} />
      <meta property="og:description" content={currentSEO.ogDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${baseUrl}/${currentLang}/`} />
      <meta property="og:image" content={`${baseUrl}/og-image.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Audio Converter" />
      <meta property="og:locale" content={currentLang === "en" ? "en_US" : 
                                       currentLang === "zh" ? "zh_CN" :
                                       currentLang === "fr" ? "fr_FR" :
                                       currentLang === "es" ? "es_ES" :
                                       currentLang === "ru" ? "ru_RU" :
                                       currentLang === "ar" ? "ar_AR" :
                                       currentLang === "ja" ? "ja_JP" :
                                       currentLang === "ko" ? "ko_KR" : "en_US"} />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={currentSEO.ogTitle} />
      <meta name="twitter:description" content={currentSEO.ogDescription} />
      <meta name="twitter:image" content={`${baseUrl}/og-image.png`} />
      <meta name="twitter:creator" content="@audioconverter" />
      <meta name="twitter:site" content="@audioconverter" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="language" content={currentLang === "en" ? "English" :
                                    currentLang === "zh" ? "Chinese" :
                                    currentLang === "fr" ? "French" :
                                    currentLang === "es" ? "Spanish" :
                                    currentLang === "ru" ? "Russian" :
                                    currentLang === "ar" ? "Arabic" :
                                    currentLang === "ja" ? "Japanese" :
                                    currentLang === "ko" ? "Korean" : "English"} />
      <meta name="rating" content="general" />
      <meta name="theme-color" content="#22c55e" />
      
      {/* Performance and Mobile */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Structured Data for current language */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": currentSEO.ogTitle,
          "description": currentSEO.ogDescription,
          "url": `${baseUrl}/${currentLang}/`,
          "inLanguage": currentLang,
          "author": {
            "@type": "Organization",
            "name": currentSEO.author
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Any",
          "browserRequirements": "HTML5, Web Audio API",
          "permissions": "No special permissions required",
          "memoryRequirements": "Minimal (100KB vs 30MB FFmpeg)",
          "storageRequirements": "No storage required - works offline",
          "featureList": [
            currentLang === "zh" ? "转换MP3、WAV、FLAC、AAC音频格式" :
            currentLang === "fr" ? "Convertir les formats audio MP3, WAV, FLAC, AAC" :
            currentLang === "es" ? "Convertir formatos de audio MP3, WAV, FLAC, AAC" :
            currentLang === "ru" ? "Конвертация аудио форматов MP3, WAV, FLAC, AAC" :
            currentLang === "ar" ? "تحويل صيغ الصوت MP3, WAV, FLAC, AAC" :
            currentLang === "ja" ? "MP3、WAV、FLAC、AAC オーディオフォーマット変換" :
            currentLang === "ko" ? "MP3, WAV, FLAC, AAC 오디오 형식 변환" :
            "Convert MP3, WAV, FLAC, AAC audio formats",
            
            currentLang === "zh" ? "批量处理多个文件" :
            currentLang === "fr" ? "Traitement par lots de plusieurs fichiers" :
            currentLang === "es" ? "Procesamiento por lotes de múltiples archivos" :
            currentLang === "ru" ? "Пакетная обработка нескольких файлов" :
            currentLang === "ar" ? "معالجة دفعية لملفات متعددة" :
            currentLang === "ja" ? "複数ファイルのバッチ処理" :
            currentLang === "ko" ? "여러 파일 일괄 처리" :
            "Batch processing multiple files",
            
            currentLang === "zh" ? "完全隐私 - 无需上传文件" :
            currentLang === "fr" ? "Confidentialité complète - pas de téléchargement de fichiers" :
            currentLang === "es" ? "Privacidad completa - no se requiere subir archivos" :
            currentLang === "ru" ? "Полная конфиденциальность - не требуется загрузка файлов" :
            currentLang === "ar" ? "خصوصية كاملة - لا حاجة لرفع الملفات" :
            currentLang === "ja" ? "完全なプライバシー - ファイルアップロード不要" :
            currentLang === "ko" ? "완전한 개인정보 보호 - 파일 업로드 불필요" :
            "Complete privacy - no file uploads required",
            
            currentLang === "zh" ? "比传统转换器快300倍" :
            currentLang === "fr" ? "300x plus rapide que les convertisseurs traditionnels" :
            currentLang === "es" ? "300 veces más rápido que los convertidores tradicionales" :
            currentLang === "ru" ? "В 300 раз быстрее традиционных конвертеров" :
            currentLang === "ar" ? "أسرع 300 مرة من المحولات التقليدية" :
            currentLang === "ja" ? "従来のコンバーターより300倍高速" :
            currentLang === "ko" ? "기존 변환기보다 300배 빠름" :
            "300x faster than traditional converters",
            
            currentLang === "zh" ? "在所有现代浏览器中工作" :
            currentLang === "fr" ? "Fonctionne dans tous les navigateurs modernes" :
            currentLang === "es" ? "Funciona en todos los navegadores modernos" :
            currentLang === "ru" ? "Работает во всех современных браузерах" :
            currentLang === "ar" ? "يعمل في جميع المتصفحات الحديثة" :
            currentLang === "ja" ? "全ての現代的なブラウザで動作" :
            currentLang === "ko" ? "모든 최신 브라우저에서 작동" :
            "Works in all modern browsers",
            
            currentLang === "zh" ? "实时转换进度" :
            currentLang === "fr" ? "Progression de conversion en temps réel" :
            currentLang === "es" ? "Progreso de conversión en tiempo real" :
            currentLang === "ru" ? "Прогресс конвертации в реальном времени" :
            currentLang === "ar" ? "تقدم التحويل في الوقت الفعلي" :
            currentLang === "ja" ? "リアルタイム変換進行状況" :
            currentLang === "ko" ? "실시간 변환 진행상황" :
            "Real-time conversion progress"
          ]
        })}
      </script>
    </Helmet>
  );
};