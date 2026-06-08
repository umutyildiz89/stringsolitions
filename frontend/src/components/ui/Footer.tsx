"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Send, ArrowUp } from "lucide-react";
import useSWR from "swr";
import { getCategoryTree, CategoryTree } from "@/lib/api";
import Image from "next/image";

export default function Footer() {
  const { data: categories } = useSWR<CategoryTree[]>("/api/categories", getCategoryTree);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8 relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Brand & Info */}
        <div className="space-y-6">
          <Link href="/" className="inline-block group">
            <div className="relative w-48 h-12 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="String Solutions Logo"
                fill
                className="object-contain object-left"
              />
            </div>
          </Link>
          <p className="text-sm font-sans text-slate-400 leading-relaxed">
            Endüstriyel enerji iletimi, orta ve yüksek gerilim trafo merkezleri ve ileri otomasyon mühendisliğinde güvenilir, yüksek performanslı çözümler sunuyoruz.
          </p>
          <div className="space-y-3 font-sans text-sm text-slate-300">
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>İkitelli OSB, İsdök Sanayi Sitesi, İstanbul, Türkiye</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>+90 (212) 555 45 45</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span>info@stringsolutions.com</span>
            </div>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div>
          <h4 className="font-heading font-bold text-sm text-slate-100 uppercase tracking-widest mb-6">Kurumsal</h4>
          <ul className="space-y-3 font-sans text-sm">
            <li>
              <Link href="/about" className="text-slate-400 hover:text-amber-500 transition-colors">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/about#values" className="text-slate-400 hover:text-amber-500 transition-colors">
                Değerlerimiz
              </Link>
            </li>
            <li>
              <Link href="/references" className="text-slate-400 hover:text-amber-500 transition-colors">
                Referans Projeler
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-slate-400 hover:text-amber-500 transition-colors">
                İletişim & Ofisler
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Categories (Live data if loaded) */}
        <div>
          <h4 className="font-heading font-bold text-sm text-slate-100 uppercase tracking-widest mb-6">Portföyümüz</h4>
          <ul className="space-y-3 font-sans text-sm text-slate-400">
            {categories && categories.length > 0 ? (
              categories.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/products/${cat.slug}`} className="hover:text-amber-500 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li>
                  <Link href="/products" className="hover:text-amber-500 transition-colors">
                    Güç İletimi & Trafolar
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-amber-500 transition-colors">
                    Orta Gerilim Hücreleri
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-amber-500 transition-colors">
                    Endüstriyel Otomasyon
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-amber-500 transition-colors">
                    Enerji İzleme Yazılımları
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-6">
          <h4 className="font-heading font-bold text-sm text-slate-100 uppercase tracking-widest mb-6">Bültene Katılın</h4>
          <p className="text-sm font-sans text-slate-400">
            Yeni ürün duyuruları, vaka analizleri ve mühendislik makalelerimizden ilk siz haberdar olun.
          </p>
          <form className="flex space-x-2 font-sans" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 grow"
            />
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-2.5 rounded-lg transition-colors flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs font-sans text-slate-500">
          © {new Date().getFullYear()} String Solutions. Tüm hakları saklıdır.
        </p>
        <button
          onClick={scrollToTop}
          className="bg-slate-900 hover:bg-amber-500 border border-white/10 hover:border-amber-500 text-slate-400 hover:text-slate-950 p-3 rounded-full transition-all duration-300 shadow-lg"
          aria-label="Yukarı Çık"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}
