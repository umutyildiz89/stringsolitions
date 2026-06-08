import { Metadata } from "next";
import { getProductBySlug, Product } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileText, Settings, ShieldCheck, Download, Mail } from "lucide-react";

interface Props {
  params: {
    productSlug: string;
  };
}

// Fallback details if server API is offline
const MOCK_DETAIL: Record<string, Product> = {
  "hava-yalitimli-hucre-36kv": {
    id: 1,
    name: "Hava Yalıtımlı Hücre (AIS) - 36kV",
    slug: "hava-yalitimli-hucre-36kv",
    category_id: 2,
    description: `
      <p>Hava yalıtımlı modüler şalt hücreleri (AIS), elektrik dağıtım şebekelerinde güvenilir anahtarlama ve koruma fonksiyonları gerçekleştirmek üzere tasarlanmıştır. Metal-enclosed yapısı ve mekanik kilitlemeleriyle en üst düzey işletme emniyeti sağlar.</p>
      <h3 className="text-lg font-bold text-white mt-4">Kullanım Alanları</h3>
      <ul className="list-disc pl-5 text-slate-400 space-y-2 mt-2">
        <li>Endüstriyel tesisler ve organize sanayi bölgeleri</li>
        <li>HES, GES ve RES gibi yenilenebilir enerji santralleri</li>
        <li>Trafo merkezleri ve enerji dağıtım istasyonları</li>
      </ul>
    `,
    excerpt: "LSC2B-PM servis sürekliliği sınıfında, metal enklolje orta gerilim hücre panosu.",
    voltage_class: "Medium Voltage",
    tech_specs: {
      "Nominal Gerilim": "36 kV",
      "Nominal Akım": "1250 A",
      "Kısa Devre Dayanımı": "25 kA / 3s",
      "Yalıtım Seviyesi (Şebeke / Darbe)": "70 kV / 170 kV",
      "Koruma Sınıfı": "IP4X",
      "İç Ark Dayanımı": "IAC AFLR 25kA/1s",
    },
    image_gallery: ["/images/switchgear.png"],
    datasheet_url: "#",
    is_active: true,
    meta_title: "AIS 36kV Orta Gerilim Hücresi | String Solutions",
    meta_description: "36kV metal-enclosed hava yalıtımlı OG hücre panosu. Teknik özellikler ve PDF veri formu.",
  },
};

// 1. Dynamic Meta Generation for Technical SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = params;
  try {
    const product = await getProductBySlug(productSlug);
    return {
      title: product.meta_title || product.name,
      description: product.meta_description || product.excerpt,
      alternates: {
        canonical: `/products/cat/${productSlug}`,
      },
      openGraph: {
        title: product.meta_title || product.name,
        description: product.meta_description || product.excerpt,
        images: product.image_gallery && product.image_gallery.length > 0 ? [{ url: product.image_gallery[0] }] : [],
      },
    };
  } catch (e) {
    const fallback = MOCK_DETAIL[productSlug];
    return {
      title: fallback ? fallback.meta_title : "Ürün Detayı | String Solutions",
      description: fallback ? fallback.meta_description : "Detaylı teknik özellikler.",
    };
  }
}

export default async function ProductDetail({ params }: Props) {
  const { productSlug } = params;
  let product: Product | null = null;

  try {
    product = await getProductBySlug(productSlug);
  } catch (e) {
    product = MOCK_DETAIL[productSlug] || null;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center font-sans">
        <h1 className="text-2xl font-bold text-white">Ürün Bulunamadı</h1>
        <p className="text-slate-500 mt-2">Aradığınız ürün katalogumuzda yer almamaktadır.</p>
        <Link href="/products" className="text-amber-500 hover:underline inline-flex items-center space-x-1 mt-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Kataloga Dön</span>
        </Link>
      </div>
    );
  }

  // 2. Structured Data Schema Markup (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image_gallery && product.image_gallery.length > 0 ? product.image_gallery[0] : "",
    "description": product.excerpt || product.meta_description,
    "brand": {
      "@type": "Brand",
      "name": "String Solutions"
    },
    "category": product.voltage_class || "Industrial Energy Equipment",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "EUR",
      "lowPrice": "0",
      "offerCount": "1",
      "url": `http://localhost:3000/products/cat/${productSlug}`
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 space-y-12">
      {/* JSON-LD Script Tag Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Back to catalog */}
      <Link
        href="/products"
        className="font-sans text-xs inline-flex items-center space-x-1.5 text-slate-400 hover:text-amber-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kataloga Geri Dön</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
            <Image
              src={product.image_gallery && product.image_gallery.length > 0 ? product.image_gallery[0] : "/images/switchgear.png"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {product.voltage_class && (
            <div className="font-sans text-xs bg-slate-900 border border-white/5 p-3 rounded-xl flex items-center justify-between text-slate-400">
              <span>Gerilim Sınıfı:</span>
              <span className="font-bold text-amber-500 uppercase tracking-wider">
                {product.voltage_class === "Low Voltage" ? "Alçak Gerilim" : product.voltage_class === "Medium Voltage" ? "Orta Gerilim" : "Yüksek Gerilim"}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Title and Details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-white leading-tight">
              {product.name}
            </h1>
            <p className="font-sans text-base text-slate-300 leading-relaxed font-light">
              {product.excerpt}
            </p>
          </div>

          {/* Download Datasheet & Offer */}
          <div className="flex flex-wrap gap-4 font-sans">
            {product.datasheet_url && (
              <a
                href={product.datasheet_url}
                download
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-amber-500/10"
              >
                <Download className="w-4 h-4" />
                <span>Teknik Föyü İndir (PDF)</span>
              </a>
            )}
            <Link
              href={`/contact?product=${encodeURIComponent(product.name)}`}
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors"
            >
              <Mail className="w-4 h-4 text-amber-500" />
              <span>Teklif & Bilgi İste</span>
            </Link>
          </div>

          {/* Technical Specs Table */}
          {product.tech_specs && (
            <div className="space-y-4 font-sans">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                <Settings className="w-4 h-4 text-amber-500" />
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">
                  Teknik Parametreler
                </h3>
              </div>
              <div className="border border-white/5 rounded-xl overflow-hidden bg-slate-950/40">
                <table className="w-full text-left text-sm border-collapse">
                  <tbody>
                    {Object.entries(product.tech_specs).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={`border-b border-white/5 last:border-0 ${
                          idx % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent"
                        }`}
                      >
                        <td className="px-5 py-3.5 text-slate-400 font-medium w-1/2">{key}</td>
                        <td className="px-5 py-3.5 text-slate-200">{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Rich text description */}
          {product.description && (
            <div className="space-y-4 font-sans">
              <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">
                  Ürün Detayları & Uygulama
                </h3>
              </div>
              <div
                className="text-slate-400 leading-relaxed font-light space-y-4 text-sm"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
