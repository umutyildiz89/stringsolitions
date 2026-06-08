import { Award, Shield, CheckCircle, Target } from "lucide-react";

export const metadata = {
  title: "Hakkımızda",
  description: "String Solutions şirket tarihi, değerlerimiz ve teknoloji ortaklarımız.",
};

const VALUES = [
  {
    title: "Mühendislik Mükemmelliği",
    desc: "Her projede sıfır hata prensibiyle çalışıyor, en modern mühendislik standartlarını tavizsiz uyguluyoruz.",
    icon: Award,
  },
  {
    title: "İş Güvenliği & Çevre",
    desc: "Yüksek gerilim sahalarında çalışırken can güvenliğini birinci sıraya alıyor, sürdürülebilir çevre politikaları güdüyoruz.",
    icon: Shield,
  },
  {
    title: "İnovasyon & Ar-Ge",
    desc: "Endüstri 4.0 hedefleri doğrultusunda kendi enerji izleme yazılımlarımızı ve SCADA entegrasyonlarımızı geliştiriyoruz.",
    icon: Target,
  },
  {
    title: "Güven & Taahhüt",
    desc: "Projeleri zamanında teslim etme kararlılığımız ve satış sonrası mühendislik desteğimizle sektörde güven inşa ediyoruz.",
    icon: CheckCircle,
  },
];

const MILESTONES = [
  { year: "2001", title: "Kuruluş", desc: "İstanbul'da endüstriyel otomasyon danışmanlığı ile faaliyetlerimize başladık." },
  { year: "2008", title: "Orta Gerilim Şalt Entegrasyonu", desc: "Uluslararası markalarla partnerlik yaparak OG hücre tedarikçisi ve pano üreticisi kimliği kazandık." },
  { year: "2016", title: "Küresel Projeler & Yüksek Gerilim", desc: "Orta Doğu ve Afrika ülkelerinde ilk 154kV anahtar teslim şalt sahası projemizi tamamladık." },
  { year: "2026", title: "Dijital Enerji & IoT", desc: "Yeni nesil bulut tabanlı enerji yönetim platformu ve akıllı şebeke projelerini hayata geçirdik." },
];

const PARTNERS = [
  "ABB",
  "Siemens",
  "Schneider Electric",
  "Eaton",
  "Phoenix Contact",
  "WEG Motors",
  "Omron",
  "Rockwell Automation",
];

export default function About() {
  return (
    <div className="pt-24 space-y-24 pb-20">
      {/* Hero Header */}
      <section className="relative py-20 bg-slate-950/60 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
            Kurumsal Bilgilerimiz
          </span>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-white">
            String Solutions Kimdir?
          </h1>
          <p className="font-sans text-lg text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            Biz, karmaşık enerji dağıtım sorunlarını çözen, üretimi otomatikleştiren ve endüstriyi geleceğe taşıyan mühendislik odaklı bir teknoloji şirketiyiz.
          </p>
        </div>
      </section>

      {/* History Split-View Timeline */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
              Tarihçemiz
            </span>
            <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white">
              Çeyrek Asırlık Mühendislik Serüveni
            </h2>
            <p className="font-sans text-slate-400 leading-relaxed font-light">
              Yolculuğumuz, endüstriyel tesislere değer katma hayaliyle başladı. Adım adım genişleyen kapsamımız, bugün bizi kıtalararası projeler yöneten entegratör bir kuruluşa dönüştürdü.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-12 border-l border-white/10 pl-8 relative">
            {MILESTONES.map((milestone, idx) => (
              <div key={idx} className="relative space-y-2 group">
                <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-500 group-hover:bg-amber-500 transition-colors" />
                <span className="font-heading font-black text-2xl text-amber-500">
                  {milestone.year}
                </span>
                <h3 className="font-heading font-bold text-lg text-white">
                  {milestone.title}
                </h3>
                <p className="font-sans text-sm text-slate-400 font-light leading-relaxed">
                  {milestone.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section id="values" className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
            Felsefemiz
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white">
            Bizi Biz Yapan Değerlerimiz
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((val, index) => {
            const Icon = val.icon;
            return (
              <div
                key={index}
                className="glass-panel p-8 rounded-2xl border border-white/5 bg-slate-900/40 space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">{val.title}</h3>
                <p className="font-sans text-sm text-slate-400 leading-relaxed font-light">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology Partners Marquee */}
      <section className="bg-slate-950 py-16 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
          <span className="text-xs font-heading font-semibold text-slate-400 tracking-widest uppercase">
            Teknoloji Ortaklarımız & Markalar
          </span>
        </div>
        
        {/* Infinite CSS marquee marquee wrapper */}
        <div className="relative w-full flex overflow-x-hidden">
          <div className="flex animate-marquee whitespace-nowrap space-x-16 text-slate-500 font-heading font-black text-3xl uppercase tracking-widest">
            {PARTNERS.map((partner, i) => (
              <span key={i} className="hover:text-amber-500 transition-colors cursor-default">
                {partner}
              </span>
            ))}
          </div>
          <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap space-x-16 text-slate-500 font-heading font-black text-3xl uppercase tracking-widest" aria-hidden="true">
            {PARTNERS.map((partner, i) => (
              <span key={i} className="hover:text-amber-500 transition-colors cursor-default">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
