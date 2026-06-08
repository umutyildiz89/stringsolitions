import { Settings, PenTool, ClipboardList, CheckCircle, Zap, Shield, Eye } from "lucide-react";

export const metadata = {
  title: "Sektörler & Mühendislik Çözümleri",
  description: "Endüstriyel tesisler için yüksek ve orta gerilim şalt tesisleri, otomasyon mühendisliği ve test hizmetlerimiz.",
};

const CAPABILITIES = [
  {
    title: "Yüksek Gerilim Mühendisliği",
    desc: "154kV ve 380kV trafo merkezlerinin şalt sahası yerleşim projeleri, tek hat tasarımları, kısa devre hesapları ve selektivite analizleri.",
    icon: Zap,
  },
  {
    title: "Orta Gerilim Hücre Entegrasyonu",
    desc: "Tesisinizin ihtiyacına özel hava yalıtımlı (AIS) ve gaz yalıtımlı (GIS) hücre panolarının mühendislik tasarımları ve devreye alma işlemleri.",
    icon: Settings,
  },
  {
    title: "SCADA & Proses Kontrol",
    desc: "Yedekli (redundant) SCADA kontrol merkezleri tasarımı, PLC / RTU yazılımları, veri depolama ve bulut tabanlı raporlama sistemleri.",
    icon: Eye,
  },
];

const STEPS = [
  {
    step: "01",
    title: "Keşif & Ön Tasarım",
    desc: "Uzman mühendislerimiz sahada detaylı keşif yapar, yük analizleri gerçekleştirir ve elektrik tek hat projelerini hazırlar.",
    icon: ClipboardList,
  },
  {
    step: "02",
    title: "Tedarik & İmalat",
    desc: "Onaylanan tasarımlara göre şalt panoları, röle dolapları ve koruma ekipmanları uluslararası standartlarda fabrikamızda üretilir.",
    icon: PenTool,
  },
  {
    step: "03",
    title: "Saha Montajı & Testler",
    desc: "Ekipmanların sahaya nakliyesi, montajı, kablo bağlantıları ve devreye alma öncesi yüksek gerilim testleri (primer-sekonder) tamamlanır.",
    icon: Settings,
  },
  {
    step: "04",
    title: "Kabul & Devreye Alma",
    desc: "Resmi kurum kabulleri (TEİAŞ / TEDAŞ) tamamlanarak tesis güvenli ve enerjili bir şekilde teslim edilir.",
    icon: CheckCircle,
  },
];

export default function Sectors() {
  return (
    <div className="pt-24 space-y-24 pb-20 font-sans">
      {/* Hero Header */}
      <section className="relative py-20 bg-slate-950/60 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
            Hizmet Kapsamımız
          </span>
          <h1 className="font-heading font-extrabold text-4xl md:text-6xl text-white">
            Sektörler ve Çözümler
          </h1>
          <p className="font-sans text-lg text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            Mühendislik kabiliyetlerimiz ve metodolojimizle, projelerinizi baştan sona sıfır riskle yönetiyoruz.
          </p>
        </div>
      </section>

      {/* Capabilities */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
            Yeterlilikler
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white">
            Anahtar Teslim Mühendislik
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-8 rounded-2xl border border-white/5 bg-slate-900/40 space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">{cap.title}</h3>
                <p className="font-sans text-sm text-slate-400 leading-relaxed font-light">
                  {cap.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Project Steps Execution Flow */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
            Metodoloji
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white">
            Proje Uygulama Adımlarımız
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-8 rounded-2xl border border-white/5 bg-slate-900/40 flex flex-col justify-between h-[300px] hover:border-amber-500/20 transition-all duration-300 relative overflow-hidden"
              >
                <span className="absolute right-6 top-6 font-heading font-black text-6xl text-white/[0.03]">
                  {step.step}
                </span>
                
                <div className="space-y-4 z-10">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-white">{step.title}</h3>
                  <p className="font-sans text-xs text-slate-400 leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
