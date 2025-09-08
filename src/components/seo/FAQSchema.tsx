import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export const FAQSchema = () => {
  const { i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "en";

  const faqs = {
    en: [
      {
        question: "How fast is this audio converter compared to other converters?",
        answer: "Our audio converter is 300x faster than FFmpeg WASM because it uses lightweight, specialized libraries (lamejs for MP3, Web Audio API for other formats) instead of a heavy 30MB FFmpeg bundle. Total size is only 100KB."
      },
      {
        question: "Which audio formats are supported for conversion?",
        answer: "We support all major audio formats: MP3, WAV, FLAC, AAC, and OGG. You can convert between any of these formats with high quality output."
      },
      {
        question: "Is it safe to convert my audio files online?",
        answer: "Absolutely! All audio conversion happens locally in your browser. Your files never leave your device, there are no uploads to servers, and we don't track or store any data."
      },
      {
        question: "Can I convert multiple audio files at once?",
        answer: "Yes! Our batch audio converter allows you to convert multiple files simultaneously. Simply select multiple files and they'll all be processed in parallel."
      },
      {
        question: "Do I need to install any software to convert audio files?",
        answer: "No installation required! This is a web-based audio converter that works directly in your browser. It works on Windows, Mac, Linux, and mobile devices."
      },
      {
        question: "What's the maximum file size I can convert?",
        answer: "Since processing happens locally in your browser, the limit depends on your device's memory. Most devices can handle files up to several GB without issues."
      }
    ],
    zh: [
      {
        question: "这个音频转换器比其他转换器快多少？",
        answer: "我们的音频转换器比FFmpeg WASM快300倍，因为它使用轻量级的专用库（MP3用lamejs，其他格式用Web Audio API），而不是30MB的重型FFmpeg包。总大小只有100KB。"
      },
      {
        question: "支持哪些音频格式转换？",
        answer: "我们支持所有主要音频格式：MP3、WAV、FLAC、AAC和OGG。您可以在这些格式之间进行高质量转换。"
      },
      {
        question: "在线转换音频文件安全吗？",
        answer: "绝对安全！所有音频转换都在您的浏览器本地进行。您的文件不会离开您的设备，没有上传到服务器，我们不跟踪或存储任何数据。"
      },
      {
        question: "可以同时转换多个音频文件吗？",
        answer: "可以！我们的批量音频转换器允许您同时转换多个文件。只需选择多个文件，它们都将并行处理。"
      },
      {
        question: "转换音频文件需要安装软件吗？",
        answer: "不需要安装！这是一个基于网页的音频转换器，直接在浏览器中工作。支持Windows、Mac、Linux和移动设备。"
      },
      {
        question: "可以转换的文件大小限制是多少？",
        answer: "由于处理在您的浏览器本地进行，限制取决于您设备的内存。大多数设备可以处理几GB的文件而没有问题。"
      }
    ]
  };

  const currentFAQs = faqs[currentLang as keyof typeof faqs] || faqs.en;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": currentFAQs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })}
      </script>
    </Helmet>
  );
};