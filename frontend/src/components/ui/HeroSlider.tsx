"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

const DEFAULT_SLIDES: Slide[] = [
  {
    id: 1,
    title: "YÜKSEK GERİLİM GÜÇ SİSTEMLERİ",
    subtitle: "Güçlü Enerji İletim Altyapıları",
    description: "Tasarımından devreye alınmasına kadar yüksek gerilim trafo merkezleri, güç iletim hatları ve şalt sahası mühendisliği.",
    ctaText: "Güç Çözümlerini İncele",
    ctaLink: "/products",
    image: "/images/slide_transformer_1780689513923.png",
  },
  {
    id: 2,
    title: "ENDÜSTRİYEL OTOMASYON & SCADA",
    subtitle: "Yüksek Hassasiyetli Proses Kontrolü",
    description: "Akıllı fabrika otomasyonu, DCS, PLC sistemleri ve tesisinizin performansını gerçek zamanlı izleyen SCADA yazılımları.",
    ctaText: "Otomasyonu Keşfet",
    ctaLink: "/products",
    image: "/images/slide_factory_1780689527180.png",
  },
  {
    id: 3,
    title: "ORTA GERİLİM HÜCRELERİ & ŞALT",
    subtitle: "Güvenilir ve Kesintisiz Dağıtım",
    description: "Uluslararası standartlarda metal-clad şalt panoları, vakumlu kesiciler ve koruma röleleri entegrasyonu.",
    ctaText: "Ürün Portföyü",
    ctaLink: "/products",
    image: "/images/slide_switchgear_1780689541936.png",
  },
  {
    id: 4,
    title: "YENİLENEBİLİR ENERJİ SANTRALLERİ",
    subtitle: "Sürdürülebilir Gelecek İçin Güneş Enerjisi",
    description: "Endüstriyel ölçekli güneş enerjisi santrallerinin mühendisliği, projelendirilmesi ve anahtar teslim kurulumu.",
    ctaText: "Yeşil Enerjiyi Keşfet",
    ctaLink: "/products",
    image: "/images/slide_solar_1780689553271.png",
  },
  {
    id: 5,
    title: "GELİŞMİŞ KONTROL MERKEZLERİ",
    subtitle: "Tek Merkezden Veri İzleme ve Yönetim",
    description: "Tüm enerji ve üretim altyapınızı tek bir güvenli kontrol merkezinden milisaniye hassasiyetinde yönetin.",
    ctaText: "Sistemlerimizi İncele",
    ctaLink: "/products",
    image: "/images/slide_scada_1780689566131.png",
  },
  {
    id: 6,
    title: "HASSAS DEVRE VE KORUMA",
    subtitle: "Üstün Kalite Mühendislik Standartları",
    description: "Kritik tesislerde maksimum güvenliği sağlayan gelişmiş devre kesici ve koruma röleleri altyapısı.",
    ctaText: "Koruma Sistemleri",
    ctaLink: "/products",
    image: "/images/slide_wiring_1780689577870.png",
  },
  {
    id: 7,
    title: "RÜZGAR ENERJİSİ ALTYAPILARI",
    subtitle: "Açık Deniz ve Karasal Santraller",
    description: "Rüzgar türbinlerinin şebeke bağlantıları, trafo merkezleri ve enerji iletim mühendisliğinde uzman çözümler.",
    ctaText: "Projelerimiz",
    ctaLink: "/references",
    image: "/images/slide_wind_1780689588868.png",
  },
  {
    id: 8,
    title: "MODERN GÜÇ DAĞITIM TESİSLERİ",
    subtitle: "Geleceğin Şehirleri İçin Altyapı",
    description: "Büyük ölçekli sanayi bölgeleri ve modern şehirler için tasarlanmış yüksek verimli güç dağıtım merkezleri.",
    ctaText: "Çözümlerimiz",
    ctaLink: "/products",
    image: "/images/slide_distribution_1780689601521.png",
  },
  {
    id: 9,
    title: "AKILLI ÜRETİM HATLARI",
    subtitle: "Endüstri 4.0 Standartlarında Üretim",
    description: "Üretim bandınızı yapay zeka destekli kameralar, yüksek teknoloji sensörler ve otonom sistemlerle donatın.",
    ctaText: "Otomasyona Geç",
    ctaLink: "/products",
    image: "/images/slide_conveyor_1780689617307.png",
  },
  {
    id: 10,
    title: "KESİNTİSİZ SANAYİ ENERJİSİ",
    subtitle: "7/24 Kesintisiz Üretim Güvencesi",
    description: "Ağır sanayi tesisleri için özel tasarlanmış, yedekli ve arıza toleranslı güç sistemleri mühendisliği.",
    ctaText: "Altyapınızı Güçlendirin",
    ctaLink: "/products",
    image: "/images/slide_plant_1780689629063.png",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % DEFAULT_SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + DEFAULT_SLIDES.length) % DEFAULT_SLIDES.length);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: dir > 0 ? 1.1 : 0.9,
    }),
    center: {
      zIndex: 1,
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 1.2, ease: "easeOut" },
        scale: { duration: 8, ease: "linear" }, // Ken Burns effect
      },
    },
    exit: (dir: number) => ({
      zIndex: 0,
      opacity: 0,
      scale: dir > 0 ? 0.95 : 1.05,
      transition: {
        opacity: { duration: 1.2, ease: "easeInOut" },
        scale: { duration: 1.2, ease: "easeInOut" },
      },
    }),
  };

  const currentSlide = DEFAULT_SLIDES[current];

  // For staggered text animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    },
  };

  return (
    <div className="relative h-screen w-full bg-slate-950 overflow-hidden group">
      {/* Background Slides with Ken Burns */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            priority
            className="object-cover object-center"
          />
          {/* Advanced Gradients for Premium Look */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </motion.div>
      </AnimatePresence>

      {/* Animated Text Content */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full mt-16">
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${current}`}
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
                className="space-y-6"
              >
                {/* Subtitle / Badge */}
                <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                  <span className="text-xs font-heading font-bold text-amber-400 uppercase tracking-[0.2em]">
                    {currentSlide.subtitle}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                  variants={itemVariants}
                  className="font-heading font-black text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-white tracking-tight"
                >
                  {currentSlide.title.split(" ").map((word, i) => (
                    <span key={i} className="inline-block mr-4 mb-2 overflow-hidden">
                      <motion.span
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className={`inline-block ${
                          i === currentSlide.title.split(" ").length - 1 ? "text-amber-500" : ""
                        }`}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </motion.h1>

                {/* Description */}
                <motion.p
                  variants={itemVariants}
                  className="font-sans text-lg md:text-2xl text-slate-300 leading-relaxed max-w-2xl font-light border-l-2 border-amber-500 pl-4"
                >
                  {currentSlide.description}
                </motion.p>

                {/* CTA Button */}
                <motion.div variants={itemVariants} className="pt-8">
                  <Link
                    href={currentSlide.ctaLink}
                    className="group/btn relative inline-flex items-center space-x-3 bg-amber-500 text-slate-950 font-bold px-8 py-4 rounded-lg overflow-hidden transition-all duration-300"
                  >
                    <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 font-sans tracking-wide text-sm uppercase">{currentSlide.ctaText}</span>
                    <ArrowRight className="relative z-10 w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col space-y-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <button
          onClick={handlePrev}
          className="bg-slate-950/50 hover:bg-amber-500 border border-white/10 hover:border-amber-500 text-white hover:text-slate-950 p-4 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110"
          aria-label="Önceki Slayt"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="bg-slate-950/50 hover:bg-amber-500 border border-white/10 hover:border-amber-500 text-white hover:text-slate-950 p-4 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110"
          aria-label="Sonraki Slayt"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Modern Progress indicators */}
      <div className="absolute bottom-12 left-0 right-0 z-20 flex justify-center space-x-3 px-6">
        {DEFAULT_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className="group/dot relative h-2 rounded-full overflow-hidden transition-all duration-500 ease-out bg-white/20"
            style={{ width: i === current ? '64px' : '32px' }}
            aria-label={`Slide ${i + 1}`}
          >
            {/* Animated filling bar for current slide */}
            {i === current && (
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-amber-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
              />
            )}
            <div className={`absolute inset-0 bg-white/40 opacity-0 group-hover/dot:opacity-100 transition-opacity ${i === current ? 'hidden' : 'block'}`} />
          </button>
        ))}
      </div>
      
      {/* Slide Counter Overlay */}
      <div className="absolute bottom-12 right-12 z-20 font-heading text-4xl font-black text-white/20">
        <span className="text-amber-500">{(current + 1).toString().padStart(2, '0')}</span> / {DEFAULT_SLIDES.length.toString().padStart(2, '0')}
      </div>
    </div>
  );
}
