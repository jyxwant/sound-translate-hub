import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

interface SEOImageProps {
  src: string;
  className?: string;
  altKey: string; // Key for translation
}

export const SEOImage = ({ src, className, altKey }: SEOImageProps) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  
  // Create descriptive alt text based on language
  const altTexts = {
    "converter.icon": {
      en: "Audio converter icon - Convert MP3 WAV FLAC AAC files fast",
      zh: "音频转换器图标 - 快速转换MP3 WAV FLAC AAC文件", 
      fr: "Icône convertisseur audio - Convertir fichiers MP3 WAV FLAC AAC rapidement",
      es: "Icono conversor audio - Convertir archivos MP3 WAV FLAC AAC rápido",
      ru: "Иконка аудио конвертера - Быстрое конвертирование MP3 WAV FLAC AAC файлов",
      ar: "أيقونة محول الصوت - تحويل ملفات MP3 WAV FLAC AAC بسرعة",
      ja: "オーディオコンバーターアイコン - MP3 WAV FLAC AACファイル高速変換", 
      ko: "오디오 변환기 아이콘 - MP3 WAV FLAC AAC 파일 빠른 변환"
    },
    "batch.processing": {
      en: "Batch audio conversion - Convert multiple MP3 WAV FLAC files simultaneously",
      zh: "批量音频转换 - 同时转换多个MP3 WAV FLAC文件",
      fr: "Conversion audio par lots - Convertir plusieurs fichiers MP3 WAV FLAC simultanément", 
      es: "Conversión de audio por lotes - Convertir múltiples archivos MP3 WAV FLAC simultáneamente",
      ru: "Пакетная конвертация аудио - Конвертировать несколько MP3 WAV FLAC файлов одновременно",
      ar: "تحويل الصوت بالدفعات - تحويل ملفات MP3 WAV FLAC متعددة في نفس الوقت",
      ja: "バッチオーディオ変換 - 複数のMP3 WAV FLACファイルを同時変換",
      ko: "일괄 오디오 변환 - 여러 MP3 WAV FLAC 파일 동시 변환"
    },
    "privacy.secure": {
      en: "Private audio conversion - No uploads, files stay on your device securely",
      zh: "私密音频转换 - 无上传，文件安全保留在您的设备上",
      fr: "Conversion audio privée - Pas de téléchargement, fichiers restent sur votre appareil",
      es: "Conversión de audio privada - Sin subidas, archivos permanecen seguros en tu dispositivo", 
      ru: "Приватная конвертация аудио - Без загрузок, файлы остаются на вашем устройстве",
      ar: "تحويل صوتي خاص - بدون رفع، الملفات تبقى آمنة على جهازك",
      ja: "プライベートオーディオ変換 - アップロードなし、ファイルはデバイスに安全保存",
      ko: "개인 오디오 변환 - 업로드 없음, 파일이 기기에 안전하게 보관"
    },
    "speed.fast": {
      en: "Fast audio converter - 300x faster than FFmpeg with instant results",
      zh: "快速音频转换器 - 比FFmpeg快300倍，即时出结果", 
      fr: "Convertisseur audio rapide - 300x plus rapide que FFmpeg avec résultats instantanés",
      es: "Conversor de audio rápido - 300x más rápido que FFmpeg con resultados instantáneos",
      ru: "Быстрый аудио конвертер - В 300 раз быстрее FFmpeg с мгновенными результатами",
      ar: "محول صوت سريع - أسرع 300 مرة من FFmpeg مع نتائج فورية",
      ja: "高速オーディオコンバーター - FFmpegより300倍高速で即座に結果",
      ko: "고속 오디오 변환기 - FFmpeg보다 300배 빠른 즉시 결과"
    }
  };

  const currentLang = (lang || "en") as keyof typeof altTexts[typeof altKey];
  const altText = altTexts[altKey as keyof typeof altTexts]?.[currentLang] || 
                  altTexts[altKey as keyof typeof altTexts]?.["en"] || 
                  t(altKey);

  return (
    <img 
      src={src} 
      alt={altText}
      className={className}
      loading="lazy" // SEO: Lazy loading for better performance
    />
  );
};