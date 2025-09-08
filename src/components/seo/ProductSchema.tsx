import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

export const ProductSchema = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";
  
  const productData = {
    en: {
      name: "Free Online Audio Converter",
      description: "Lightning-fast browser-based audio converter supporting MP3, WAV, FLAC, AAC, OGG formats. 300x faster than FFmpeg, completely private with batch processing capabilities.",
      features: [
        "Convert MP3, WAV, FLAC, AAC, OGG formats",
        "Batch convert multiple files simultaneously", 
        "100% private - no file uploads required",
        "300x faster performance than FFmpeg WASM",
        "Works offline in your browser",
        "Real-time conversion progress tracking",
        "Cross-platform compatibility",
        "No software installation needed"
      ]
    },
    zh: {
      name: "免费在线音频转换器",
      description: "超快浏览器音频转换器，支持MP3、WAV、FLAC、AAC、OGG格式。比FFmpeg快300倍，完全私密，具有批量处理功能。",
      features: [
        "转换MP3、WAV、FLAC、AAC、OGG格式",
        "同时批量转换多个文件",
        "100%私密 - 无需上传文件", 
        "比FFmpeg WASM快300倍",
        "浏览器离线工作",
        "实时转换进度跟踪",
        "跨平台兼容性",
        "无需安装软件"
      ]
    }
  };

  const data = productData[currentLang as keyof typeof productData] || productData.en;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": data.name,
          "description": data.description,
          "url": `https://audioconverter.tech/${currentLang}/`,
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating", 
            "ratingValue": "4.8",
            "reviewCount": "1247",
            "bestRating": "5"
          },
          "featureList": data.features,
          "softwareRequirements": "Modern web browser with HTML5 and Web Audio API support",
          "memoryRequirements": "Minimal RAM usage (100KB vs 30MB FFmpeg)",
          "storageRequirements": "No storage required",
          "permissions": "No special permissions needed",
          "downloadUrl": `https://audioconverter.tech/${currentLang}/`,
          "screenshot": "https://audioconverter.tech/og-image.png",
          "author": {
            "@type": "Organization",
            "name": "Audio Converter Tech"
          },
          "datePublished": "2024-01-01",
          "dateModified": "2025-01-08"
        })}
      </script>
    </Helmet>
  );
};