"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, Globe, ChevronRight } from "lucide-react";
import useSWR from "swr";
import { getCategoryTree, CategoryTree } from "@/lib/api";
import Image from "next/image";

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Fetch live category tree from API using SWR
  const { data: categories, error } = useSWR<CategoryTree[]>("/api/categories", getCategoryTree, {
    fallbackData: [], // fallback to empty array if loading or error
    revalidateOnFocus: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const navLinks = [
    { name: "Hakkımızda", href: "/about" },
    {
      name: "Ürünler",
      href: "/products",
      hasDropdown: true,
      dropdownItems: categories || [],
    },
    { name: "Referanslar", href: "/references" },
    { name: "İletişim", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-3 bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20"
          : "py-5 bg-transparent border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative w-48 h-12 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="String Solutions Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
              onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className={`font-sans font-medium text-sm transition-colors flex items-center space-x-1 py-2 ${
                  pathname.startsWith(link.href)
                    ? "text-amber-500"
                    : "text-slate-300 hover:text-amber-500"
                }`}
              >
                <span>{link.name}</span>
                {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
              </Link>

              {/* Dynamic Hover Dropdown */}
              {link.hasDropdown && activeDropdown === link.name && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-72">
                  <div className="glass-panel p-4 rounded-xl border border-white/10 shadow-2xl bg-slate-900/95 overflow-hidden">
                    <div className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 border-b border-white/5 pb-2">
                      Kategoriler
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <Link
                          href="/products"
                          className="block font-sans text-sm text-slate-300 hover:text-amber-500 hover:translate-x-1 transition-all py-1.5 font-semibold"
                        >
                          Tüm Portföyü Gör
                        </Link>
                      </li>
                      {link.dropdownItems.map((cat) => (
                        <li key={cat.id} className="relative group/sub">
                          <Link
                            href={`/products/${cat.slug}`}
                            className="flex items-center justify-between font-sans text-sm text-slate-300 hover:text-amber-500 hover:translate-x-1 transition-all py-1.5"
                          >
                            <span>{cat.name}</span>
                            {cat.children && cat.children.length > 0 && (
                              <ChevronRight className="w-3 h-3 text-slate-500 group-hover/sub:text-amber-500" />
                            )}
                          </Link>

                          {/* Subcategory level 2 */}
                          {cat.children && cat.children.length > 0 && (
                            <div className="hidden group-hover/sub:block absolute left-full top-0 pl-2 w-64">
                              <div className="glass-panel p-3 rounded-lg border border-white/10 bg-slate-900/95 shadow-xl">
                                <ul className="space-y-1">
                                  {cat.children.map((sub) => (
                                    <li key={sub.id}>
                                      <Link
                                        href={`/products/${cat.slug}/${sub.slug}`}
                                        className="block font-sans text-sm text-slate-400 hover:text-amber-500 hover:translate-x-1 transition-all py-1.5"
                                      >
                                        {sub.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-5">
          {/* Search Toggle */}
          <button className="text-slate-400 hover:text-amber-500 transition-colors p-1.5 rounded-lg hover:bg-white/5">
            <Search className="w-5 h-5" />
          </button>
          
          {/* Language Selector */}
          <button className="flex items-center space-x-1 text-slate-400 hover:text-amber-500 transition-colors p-1.5 rounded-lg hover:bg-white/5">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-sans uppercase font-bold">TR</span>
          </button>

          {/* Admin Panel Entry */}
          <Link
            href="/admin"
            className="font-sans text-xs bg-slate-900/50 hover:bg-amber-500/10 border border-white/15 hover:border-amber-500/50 text-slate-200 hover:text-amber-500 font-bold px-4 py-2 rounded-lg transition-all duration-300"
          >
            Yönetici Paneli
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-slate-200 hover:text-amber-500 transition-colors p-2 rounded-lg"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-950 border-b border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <div key={link.name} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <Link
                      href={link.href}
                      className="block font-sans font-medium text-slate-200 hover:text-amber-500 py-2"
                    >
                      {link.name}
                    </Link>
                    {link.hasDropdown && (
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === link.name ? null : link.name)
                        }
                        className="p-1.5 text-slate-400"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeDropdown === link.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile Dropdown Level 1 */}
                  {link.hasDropdown && activeDropdown === link.name && (
                    <div className="pl-4 border-l border-white/10 space-y-2 py-1">
                      <Link
                        href="/products"
                        className="block font-sans text-sm text-slate-400 hover:text-amber-500 py-1"
                      >
                        Tüm Ürünler
                      </Link>
                      {link.dropdownItems.map((cat) => (
                        <div key={cat.id} className="space-y-1">
                          <Link
                            href={`/products/${cat.slug}`}
                            className="block font-sans text-sm text-slate-400 hover:text-amber-500 py-1"
                          >
                            {cat.name}
                          </Link>
                          {cat.children && cat.children.length > 0 && (
                            <div className="pl-4 border-l border-white/5 space-y-1">
                              {cat.children.map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={`/products/${cat.slug}/${sub.slug}`}
                                  className="block font-sans text-xs text-slate-500 hover:text-amber-500 py-1"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button className="flex items-center space-x-1 text-slate-400">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold">TR</span>
                </button>
                <Link
                  href="/admin"
                  className="font-sans text-xs bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg"
                >
                  Yönetici Paneli
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
