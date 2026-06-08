import DynamicMap from "@/components/ui/DynamicMap";
import { getReferences, Reference } from "@/lib/api";
import { Briefcase, Calendar, Globe, User } from "lucide-react";

export const metadata = {
  title: "Referans Projelerimiz",
  description: "String Solutions dünya çapında tamamlanmış anahtar teslim enerji ve otomasyon projeleri.",
};

const MOCK_REFERENCES: Reference[] = [
  {
    id: 1,
    name: "154kV Trafo Merkezi Kurulumu",
    client: "TEİAŞ",
    city: "Ankara, Türkiye",
    year: 2024,
    scope: "154kV şalt sahası tasarımı, güç transformatörleri montajı, koruma kontrol panoları imalatı, test ve devreye alma faaliyetleri.",
    latitude: 39.9334,
    longitude: 32.8597,
  },
  {
    id: 2,
    name: "Demir Çelik Fabrikası SCADA Entegrasyonu",
    client: "Kardemir",
    city: "Karabük, Türkiye",
    year: 2025,
    scope: "Tesis genelindeki tüm motor kontrol merkezlerinin (MCC), fırın otomasyonunun ve OG şebekesinin tek bir SCADA odasından kontrol edilmesini sağlayan yedekli SCADA / DCS altyapısı.",
    latitude: 41.2061,
    longitude: 32.6204,
  },
  {
    id: 3,
    name: "Güneş Enerji Santrali Şebeke Bağlantısı",
    client: "EnerjiSa",
    city: "Konya, Türkiye",
    year: 2023,
    scope: "34.5kV OG metal-clad hücre temini, modüler beton köşk trafo merkezleri, enerji analizörü ağ entegrasyonu ve resmi kabul işleri.",
    latitude: 37.8714,
    longitude: 32.4847,
  },
];

export const revalidate = 60; // ISR validation

export default async function References() {
  let references: Reference[] = [];

  try {
    references = await getReferences();
    if (references.length === 0) references = MOCK_REFERENCES;
  } catch (e) {
    references = MOCK_REFERENCES;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-16">
      {/* Page Header */}
      <div className="space-y-4">
        <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
          Proje Portföyümüz
        </span>
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white">
          Referanslarımız
        </h1>
        <p className="font-sans text-sm text-slate-400 max-w-xl font-light">
          Küresel ölçekte mühendislik standartlarını yükselttiğimiz, başarıyla teslim edilen enerji dağıtımı ve otomasyon projelerimiz.
        </p>
      </div>

      {/* Global References Map */}
      <div className="space-y-4">
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
          İnteraktif Referans Haritası (Haritada Seçerek İnceleyin)
        </h3>
        <DynamicMap references={references} />
      </div>

      {/* References Grid Table */}
      <div className="space-y-6">
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
          Proje Arşivi Listesi
        </h3>

        <div className="grid grid-cols-1 gap-6 font-sans">
          {references.map((ref) => (
            <div
              key={ref.id}
              className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 bg-slate-900/40 hover:border-amber-500/20 transition-all duration-300 space-y-4"
            >
              {/* Meta Info Line */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-white/5 text-xs text-slate-400 font-medium">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-amber-500" />
                  <span>Müşteri: <strong className="text-slate-200">{ref.client || "Belirtilmedi"}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-amber-500" />
                  <span>Konum: <strong className="text-slate-200">{ref.city || "Belirtilmedi"}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Yıl: <strong className="text-slate-200">{ref.year || "Devam Ediyor"}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-amber-500" />
                  <span>Durum: <strong className="text-slate-200">Tamamlandı</strong></span>
                </div>
              </div>

              {/* Title & Scope */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-lg text-white">
                  {ref.name}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  {ref.scope || "Anahtar teslim mühendislik ve devreye alma hizmetleri verilmiştir."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
