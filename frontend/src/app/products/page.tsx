"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getAllCategories, Product, Category } from "@/lib/api";
import { Search, SlidersHorizontal, ArrowRight, Zap, Download } from "lucide-react";

// Mock fallbacks for products catalog
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Hava Yalıtımlı Hücre (AIS) - 36kV",
    slug: "hava-yalitimli-hucre-36kv",
    category_id: 2,
    excerpt: "LSC2B-PM servis sürekliliği sınıfında, metal enklolje orta gerilim hücre panosu.",
    voltage_class: "Medium Voltage",
    tech_specs: { "Nominal Gerilim": "36 kV", "Nominal Akım": "1250 A", "Kısa Devre Dayanımı": "25 kA / 3s" },
    image_gallery: ["/images/switchgear.png"],
    is_active: true,
  },
  {
    id: 2,
    name: "Güç Trafosu - 100MVA 154kV",
    slug: "guc-trafosu-100mva-154kv",
    category_id: 1,
    excerpt: "Geniş ölçekli iletim şebekeleri ve rüzgar/güneş santralleri için güç transformatörü.",
    voltage_class: "High Voltage",
    tech_specs: { "Güç": "100 MVA", "Gerilim Oranı": "154 / 33.6 kV", "Soğutma": "ONAF / ONAN" },
    image_gallery: ["/images/transformer.png"],
    is_active: true,
  },
  {
    id: 3,
    name: "Akıllı SCADA Sunucusu ve IoT Ağ Geçidi",
    slug: "akilli-scada-sunucusu-iot-ag-gecidi",
    category_id: 3,
    excerpt: "Tüm şalt sahasını uzaktan kontrol eden ve veri analiz raporları üreten kontrol ünitesi.",
    voltage_class: "Low Voltage",
    tech_specs: { "Protokoller": "IEC 61850, Modbus, DNP3", "Besleme": "110-220 VDC/VAC", "İşlemci": "Dual Core ARM" },
    image_gallery: ["/images/automation.png"],
    is_active: true,
  },
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search states read from URL
  const activeCategory = searchParams.get("category") || "";
  const activeVoltage = searchParams.get("voltage") || "";
  const activeSearch = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(activeSearch);

  // Fetch flat categories list for dropdown filter
  const { data: categories } = useSWR<Category[]>("/api/categories/all", getAllCategories, {
    fallbackData: [],
  });

  // Fetch products based on dynamic URL search parameters
  const { data: products, error, isLoading } = useSWR<Product[]>(
    [`/api/products`, activeCategory, activeVoltage, activeSearch],
    () =>
      getProducts({
        category: activeCategory || undefined,
        voltage_class: activeVoltage || undefined,
        search: activeSearch || undefined,
      }),
    {
      fallbackData: MOCK_PRODUCTS,
    }
  );

  // Update URL parameters
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", searchInput);
  };

  const voltageClasses = ["Low Voltage", "Medium Voltage", "High Voltage"];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs font-heading font-semibold text-amber-500 tracking-widest uppercase">
          Ürün Katalogu
        </span>
        <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-white">
          Mühendislik Portföyü
        </h1>
        <p className="font-sans text-sm text-slate-400 max-w-xl font-light">
          Güç sistemleri, kontrol panoları ve dijital otomasyon yazılımlarımızdan oluşan tam listeyi filtreleyin.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end font-sans">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="lg:col-span-4 relative">
          <input
            type="text"
            placeholder="Ürün adı veya özellik ara..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />
          <button type="submit" className="absolute left-4 top-3.5 text-slate-500 hover:text-amber-500">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Category Filter */}
        <div className="lg:col-span-3">
          <select
            value={activeCategory}
            onChange={(e) => updateFilters("category", e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
          >
            <option value="">Tüm Kategoriler</option>
            {categories &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        {/* Voltage Class Filter */}
        <div className="lg:col-span-3">
          <select
            value={activeVoltage}
            onChange={(e) => updateFilters("voltage", e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
          >
            <option value="">Tüm Gerilim Sınıfları</option>
            {voltageClasses.map((vol) => (
              <option key={vol} value={vol}>
                {vol === "Low Voltage" ? "Alçak Gerilim (LV)" : vol === "Medium Voltage" ? "Orta Gerilim (OG)" : "Yüksek Gerilim (YG)"}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="lg:col-span-2">
          <button
            onClick={() => {
              setSearchInput("");
              router.push("/products");
            }}
            className="w-full bg-slate-950 border border-white/10 hover:border-amber-500/40 text-slate-400 hover:text-amber-500 text-sm py-3 rounded-xl transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Grid Showcase */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="glass-panel h-96 rounded-2xl border border-white/5 bg-slate-900/20 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products && products.length > 0 ? (
            products.map((prod) => (
              <div
                key={prod.id}
                className="glass-panel rounded-2xl border border-white/5 bg-slate-900/40 overflow-hidden flex flex-col justify-between glow-card h-[450px]"
              >
                {/* Image Preview */}
                <div className="relative w-full h-48 bg-slate-950/50 overflow-hidden">
                  <Image
                    src={prod.image_gallery && prod.image_gallery.length > 0 ? prod.image_gallery[0] : "/images/switchgear.png"}
                    alt={prod.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {prod.voltage_class && (
                    <span className="absolute top-4 right-4 bg-slate-950/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-500 px-3 py-1 rounded-full uppercase tracking-wider font-sans">
                      {prod.voltage_class === "Low Voltage" ? "Alçak Gerilim" : prod.voltage_class === "Medium Voltage" ? "Orta Gerilim" : "Yüksek Gerilim"}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-3 flex-grow">
                  <h3 className="font-heading font-bold text-lg text-white leading-snug line-clamp-2">
                    {prod.name}
                  </h3>
                  <p className="font-sans text-xs text-slate-400 leading-relaxed font-light line-clamp-3">
                    {prod.excerpt || "Ürün teknik özellikleri ve indirme detayları."}
                  </p>
                  
                  {/* Tech specs mini preview */}
                  {prod.tech_specs && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {Object.entries(prod.tech_specs).slice(0, 2).map(([key, val]) => (
                        <span key={key} className="text-[10px] bg-white/5 border border-white/5 text-slate-400 px-2 py-0.5 rounded font-sans">
                          {key}: {String(val)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={`/products/cat/${prod.slug}`}
                    className="font-sans text-xs inline-flex items-center space-x-1.5 text-amber-500 hover:text-white font-semibold transition-colors"
                  >
                    <span>Detayları İncele</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {prod.datasheet_url && (
                    <a
                      href={prod.datasheet_url}
                      download
                      className="text-slate-500 hover:text-amber-500 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-slate-500 font-sans">
              Kriterlere uygun ürün bulunamadı.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Products() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-slate-400">Yükleniyor...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
