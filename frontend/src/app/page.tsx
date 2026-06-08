import HeroSlider from "@/components/ui/HeroSlider";
import Link from "next/link";
import { ArrowRight, Cpu, Shield, Zap, Award, Globe, Users, Trophy } from "lucide-react";
import DynamicMap from "@/components/ui/DynamicMap";
import { getReferences, getCategoryTree, Reference, CategoryTree } from "@/lib/api";

// Mock Fallbacks for static build / offline API
const MOCK_CATEGORIES: CategoryTree[] = [
  { id: 1, name: "Yüksek Gerilim Trafolar", slug: "yuksek-gerilim-trafolar", children: [] },
  { id: 2, name: "Orta Gerilim Hücreler", slug: "orta-gerilim-hucreler", children: [] },
  { id: 3, name: "Endüstriyel Otomasyon", slug: "endustriyel-otomasyon", children: [] },
];

const MOCK_REFERENCES: Reference[] = [
  {
    id: 1,
    name: "154kV Trafo Merkezi Kurulumu",
    client: "TEİAŞ",
    city: "Ankara",
    year: 2024,
    scope: "154kV şalt sahası tasarımı, trafo montajı, koruma röleleri montajı ve testi.",
    latitude: 39.9334,
    longitude: 32.8597,
  },
  {
    id: 2,
    name: "Demir Çelik Fabrikası SCADA Entegrasyonu",
    client: "Kardemir",
    city: "Karabük",
    year: 2025,
    scope: "DCS kontrol ünitesi montajı, SCADA yazılım lisanslama ve tesis genelinde optimizasyon.",
    latitude: 41.2061,
    longitude: 32.6204,
  },
  {
    id: 3,
    name: "Güneş Enerji Santrali Şebeke Bağlantısı",
    client: "EnerjiSa",
    city: "Konya",
    year: 2023,
    scope: "34.5kV OG hücre tedariği, beton köşk trafolar ve enerji kalitesi analizörleri devreye alma.",
    latitude: 37.8714,
    longitude: 32.4847,
  },
];

export const revalidate = 60; // Revalidate cache every minute (ISR)

export default async function Home() {
  let categories: CategoryTree[] = [];
  let references: Reference[] = [];

  try {
    categories = await getCategoryTree();
  } catch (e) {
    console.warn("Could not fetch categories tree from API, using fallback data.");
    categories = MOCK_CATEGORIES;
  }

  try {
    references = await getReferences();
    if (references.length === 0) references = MOCK_REFERENCES;
  } catch (e) {
    console.warn("Could not fetch references from API, using fallback data.");
    references = MOCK_REFERENCES;
  }

  const stats = [
    { value: "25+", label: "Yıllık Tecrübe", icon: Award },
    { value: "150+", label: "Tamamlanan Proje", icon: Trophy },
    { value: "15+", label: "Ülkeye İhracat", icon: Globe },
    { value: "50+", label: "Uzman Mühendis", icon: Users },
  ];

  const sectors = [
    {
      title: "Enerji Üretim Tesisleri",
      desc: "HES, GES ve RES santrallerinin şebeke entegrasyonu ve elektrik altyapıları.",
      icon: Zap,
    },
    {
      title: "Ağır Sanayi Entegrasyonu",
      desc: "Demir-çelik, çimento ve kimya sanayisinde güvenli enerji dağıtımı ve proses otomasyonu.",
      icon: Shield,
    },
    {
      title: "Akıllı Şebekeler & Otomasyon",
      desc: "SCADA merkezleri ile tüm enerji akışını anlık izleyen ve raporlayan gelişmiş otomasyon çözümleri.",
      icon: Cpu,
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. About Us Teaser & Stats */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
              Biz Kimiz?
            </span>
            <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white leading-tight">
              Yarının Enerji Altyapısını Bugünden İnşa Ediyoruz
            </h2>
            <p className="font-sans text-slate-400 leading-relaxed font-light">
              String Solutions olarak, endüstriyel tesislerin enerji ihtiyacını güvenilir kılmak ve operasyonel verimliliği en üst seviyeye çıkarmak için mühendislik sınırlarını zorluyoruz. Anahtar teslim yüksek gerilim şalt tesislerinden en karmaşık otomasyon yazılımlarına kadar her adımda dünya standartlarında çözümler üretiyoruz.
            </p>
            <div className="pt-4">
              <Link
                href="/about"
                className="font-sans text-sm inline-flex items-center space-x-2 text-amber-500 hover:text-white font-semibold transition-colors group"
              >
                <span>Hakkımızda Daha Fazla Bilgi Al</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/40 text-center space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-heading font-extrabold text-3xl text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="font-sans text-xs text-slate-400 font-medium tracking-wide">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Product Categories Banner */}
      <section className="bg-slate-950 py-20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
              Mühendislik Çözümlerimiz
            </span>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white">
              Endüstriyel Ürün Portföyü
            </h2>
            <p className="font-sans text-sm text-slate-400 font-light">
              Tesisleriniz için uluslararası standartlarda, zorlu saha koşullarına dayanıklı yüksek gerilim, orta gerilim ve otomasyon ekipmanlarımız.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((cat) => (
              <div
                key={cat.id}
                className="glass-panel p-8 rounded-2xl border border-white/5 bg-slate-900/40 glow-card flex flex-col justify-between h-80"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white">{cat.name}</h3>
                  <p className="font-sans text-sm text-slate-400 leading-relaxed font-light">
                    Kategori kapsamındaki teknik ürünleri, şartnameleri ve veri formlarını görüntüleyin.
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href={`/products/${cat.slug}`}
                    className="font-sans text-xs inline-flex items-center space-x-1.5 text-amber-500 hover:text-white font-semibold transition-colors"
                  >
                    <span>Ürünleri Listele</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sectors Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
            Sektörler
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white">
            Hizmet Verdiğimiz Alanlar
          </h2>
          <p className="font-sans text-sm text-slate-400 font-light">
            Enerjinin üretildiği santralden tüketildiği ağır sanayi tesisine kadar her aşamada kritik çözümler sağlıyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sectors.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <div
                key={index}
                className="glass-panel p-8 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-amber-500/20 transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">{sector.title}</h3>
                <p className="font-sans text-sm text-slate-400 leading-relaxed font-light">
                  {sector.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Interactive World Map */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
            Global Harita
          </span>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white">
            Neredeyiz? Referans Projelerimiz
          </h2>
          <p className="font-sans text-sm text-slate-400 font-light">
            Dünyanın dört bir yanında devreye aldığımız başarılı projelerin teknik kapsamını interaktif haritamız üzerinden inceleyin.
          </p>
        </div>

        <DynamicMap references={references} />
      </section>
    </div>
  );
}
