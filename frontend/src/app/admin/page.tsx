"use client";

import { useState, useEffect } from "react";
import { fetchAPI, getCategoryTree, getAllCategories, getProducts, getReferences, submitContactInquiry, uploadFile } from "@/lib/api";
import { LayoutDashboard, FolderTree, Box, MapPin, Inbox, LogOut, Key, Plus, Trash2, Edit, CheckCircle, Upload, File } from "lucide-react";
import Image from "next/image";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("products");

  // Live Data lists
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [references, setReferences] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);

  // Creation/Edit Forms
  const [editingItem, setEditingItem] = useState<any | null>(null);
  
  const [brandForm, setBrandForm] = useState({ name: "", image_url: "", is_active: true });
  const [settingForm, setSettingForm] = useState({ key: "", value: "" });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: "",
    description: "",
    parent_id: "" as any,
    meta_title: "",
    meta_description: "",
  });
  
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    category_id: "" as any,
    excerpt: "",
    description: "",
    voltage_class: "Medium Voltage",
    tech_specs_str: '{"Nominal Gerilim": "36kV", "Nominal Akım": "1250A"}',
    image_url: "",
    datasheet_url: "",
    meta_title: "",
    meta_description: "",
  });

  const [referenceForm, setReferenceForm] = useState({
    name: "",
    client: "",
    city: "",
    year: new Date().getFullYear(),
    scope: "",
    latitude: 39.9,
    longitude: 32.8,
    image_url: "",
  });

  useEffect(() => {
    // Check local storage for JWT
    const storedToken = localStorage.getItem("admin_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch lists whenever token or active tab changes
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === "categories") {
        const cats = await fetchAPI("/api/categories/all");
        setCategories(cats);
      } else if (activeTab === "products") {
        const prods = await getProducts();
        setProducts(prods);
        const cats = await fetchAPI("/api/categories/all");
        setCategories(cats);
      } else if (activeTab === "references") {
        const refs = await getReferences();
        setReferences(refs);
      } else if (activeTab === "inquiries") {
        const headers = { Authorization: `Bearer ${token}` };
        const inqs = await fetchAPI("/api/contact/inquiries", { headers });
        setInquiries(inqs);
      } else if (activeTab === "brands") {
        const brs = await fetchAPI("/api/brands");
        setBrands(brs);
      } else if (activeTab === "settings") {
        const sets = await fetchAPI("/api/settings");
        setSettings(sets);
      } else if (activeTab === "media") {
        const files = await fetchAPI("/api/media/all");
        setMediaFiles(files);
      }
    } catch (e) {
      console.error("Error loading admin data: ", e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error("Giriş bilgileri hatalı.");
      }

      const data = await response.json();
      localStorage.setItem("admin_token", data.access_token);
      setToken(data.access_token);
    } catch (err: any) {
      setLoginError(err.message || "Giriş yapılamadı.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
  };

  // ----------------- CRUD actions -----------------

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      
      const payload = {
        ...categoryForm,
        parent_id: categoryForm.parent_id ? parseInt(categoryForm.parent_id) : null,
      };

      if (editingItem) {
        await fetchAPI(`/api/categories/${editingItem.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        await fetchAPI("/api/categories", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }
      
      resetCategoryForm();
      fetchData();
    } catch (err) {
      alert("İşlem başarısız.");
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      let parsedSpecs = {};
      try {
        parsedSpecs = JSON.parse(productForm.tech_specs_str);
      } catch (e) {
        alert("Teknik özellikler geçerli bir JSON objesi olmalıdır!");
        return;
      }

      const payload = {
        name: productForm.name,
        slug: productForm.slug,
        category_id: parseInt(productForm.category_id),
        excerpt: productForm.excerpt,
        description: productForm.description,
        voltage_class: productForm.voltage_class,
        tech_specs: parsedSpecs,
        image_gallery: productForm.image_url ? [productForm.image_url] : [],
        datasheet_url: productForm.datasheet_url || null,
        is_active: true,
        meta_title: productForm.meta_title || null,
        meta_description: productForm.meta_description || null,
      };

      if (editingItem) {
        await fetchAPI(`/api/products/${editingItem.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        await fetchAPI("/api/products", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      resetProductForm();
      fetchData();
    } catch (err) {
      alert("İşlem başarısız.");
    }
  };

  const handleReferenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const payload = {
        name: referenceForm.name,
        client: referenceForm.client,
        city: referenceForm.city,
        year: parseInt(referenceForm.year as any),
        scope: referenceForm.scope,
        latitude: parseFloat(referenceForm.latitude as any),
        longitude: parseFloat(referenceForm.longitude as any),
        image_gallery: referenceForm.image_url ? [referenceForm.image_url] : [],
      };

      if (editingItem) {
        await fetchAPI(`/api/references/${editingItem.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        await fetchAPI("/api/references", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      resetReferenceForm();
      fetchData();
    } catch (err) {
      alert("İşlem başarısız.");
    }
  };

  const deleteItem = async (endpoint: string, id: number) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await fetchAPI(`${endpoint}/${id}`, { method: "DELETE", headers });
      fetchData();
    } catch (err) {
      alert("Silme işlemi başarısız.");
    }
  };

  const startEditCategory = (item: any) => {
    setEditingItem(item);
    setCategoryForm({
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      parent_id: item.parent_id || "",
      meta_title: item.meta_title || "",
      meta_description: item.meta_description || "",
    });
  };

  const startEditProduct = (item: any) => {
    setEditingItem(item);
    setProductForm({
      name: item.name,
      slug: item.slug,
      category_id: item.category_id,
      excerpt: item.excerpt || "",
      description: item.description || "",
      voltage_class: item.voltage_class || "Medium Voltage",
      tech_specs_str: JSON.stringify(item.tech_specs || {}),
      image_url: item.image_gallery && item.image_gallery.length > 0 ? item.image_gallery[0] : "",
      datasheet_url: item.datasheet_url || "",
      meta_title: item.meta_title || "",
      meta_description: item.meta_description || "",
    });
  };

  const startEditReference = (item: any) => {
    setEditingItem(item);
    setReferenceForm({
      name: item.name,
      client: item.client || "",
      city: item.city || "",
      year: item.year || new Date().getFullYear(),
      scope: item.scope || "",
      latitude: item.latitude || 39.9,
      longitude: item.longitude || 32.8,
      image_url: item.image_gallery && item.image_gallery.length > 0 ? item.image_gallery[0] : "",
    });
  };

  const resetCategoryForm = () => {
    setEditingItem(null);
    setCategoryForm({ name: "", slug: "", description: "", parent_id: "", meta_title: "", meta_description: "" });
  };

  const resetProductForm = () => {
    setEditingItem(null);
    setProductForm({
      name: "",
      slug: "",
      category_id: "",
      excerpt: "",
      description: "",
      voltage_class: "Medium Voltage",
      tech_specs_str: "{}",
      image_url: "",
      datasheet_url: "",
      meta_title: "",
      meta_description: "",
    });
  };

  const resetReferenceForm = () => {
    setEditingItem(null);
    setReferenceForm({
      name: "",
      client: "",
      city: "",
      year: new Date().getFullYear(),
      scope: "",
      latitude: 39.9,
      longitude: 32.8,
      image_url: "",
    });
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      if (editingItem) {
        await fetchAPI(`/api/brands/${editingItem.id}`, { method: "PUT", headers, body: JSON.stringify(brandForm) });
      } else {
        await fetchAPI("/api/brands", { method: "POST", headers, body: JSON.stringify(brandForm) });
      }
      setEditingItem(null);
      setBrandForm({ name: "", image_url: "", is_active: true });
      fetchData();
    } catch (err) { alert("İşlem başarısız."); }
  };

  const handleSettingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
      await fetchAPI("/api/settings", { method: "POST", headers, body: JSON.stringify(settingForm) });
      setEditingItem(null);
      setSettingForm({ key: "", value: "" });
      fetchData();
    } catch (err) { alert("İşlem başarısız."); }
  };

  const startEditBrand = (item: any) => {
    setEditingItem(item);
    setBrandForm({ name: item.name, image_url: item.image_url, is_active: item.is_active });
  };
  
  const startEditSetting = (item: any) => {
    setEditingItem(item);
    setSettingForm({ key: item.key, value: item.value || "" });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetFormSetter: any) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const res = await uploadFile(e.target.files[0]);
        targetFormSetter((prev: any) => ({ ...prev, image_url: res.url }));
        alert("Medya yüklendi ve WebP'ye sıkıştırıldı!");
      } catch (err) {
        alert("Dosya yükleme başarısız.");
      }
    }
  };

  // ----------------- LOGIN VIEW -----------------
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 font-sans">
        <div className="glass-panel max-w-md w-full p-8 rounded-2xl border border-white/10 bg-slate-900/60 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="font-heading font-black text-2xl tracking-wider text-white">
              STRING<span className="text-amber-500 font-light ml-1 font-sans">CONSOLE</span>
            </span>
            <p className="text-xs text-slate-400">Yönetici paneline erişmek için yetkilendirme gereklidir.</p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Kullanıcı Adı</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Şifre</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
            >
              <Key className="w-4 h-4" />
              <span>Giriş Yap</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------- DASHBOARD VIEW -----------------
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 flex flex-col font-sans">
      <div className="max-w-7xl mx-auto px-6 w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-slate-900/40 space-y-2">
            <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Navigasyon</div>
            {[
              { id: "products", name: "Ürün Yönetimi", icon: Box },
              { id: "categories", name: "Kategoriler", icon: FolderTree },
              { id: "references", name: "Proje Referansları", icon: MapPin },
              { id: "inquiries", name: "Müşteri Başvuruları", icon: Inbox },
              { id: "brands", name: "Marka Yönetimi", icon: CheckCircle },
              { id: "settings", name: "Site Ayarları", icon: LayoutDashboard },
              { id: "media", name: "Görsel Kütüphanesi", icon: File },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEditingItem(null);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    activeTab === tab.id
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-semibold py-3 rounded-xl transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Oturumu Kapat</span>
          </button>
        </div>

        {/* Right Active Tab Content */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* TAB: PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-8">
              {/* Product Form */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60">
                <h3 className="font-heading font-bold text-lg text-white mb-4 flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-amber-500" />
                  <span>{editingItem ? "Ürünü Güncelle" : "Yeni Ürün Ekle"}</span>
                </h3>
                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-200">
                  <div className="space-y-1">
                    <label>Ürün Adı</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Slug (Benzersiz URL)</label>
                    <input
                      type="text"
                      required
                      value={productForm.slug}
                      onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Kategori</label>
                    <select
                      required
                      value={productForm.category_id}
                      onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-300"
                    >
                      <option value="">Seçiniz</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label>Gerilim Sınıfı</label>
                    <select
                      value={productForm.voltage_class}
                      onChange={(e) => setProductForm({ ...productForm, voltage_class: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-300"
                    >
                      <option value="Low Voltage">Alçak Gerilim (LV)</option>
                      <option value="Medium Voltage">Orta Gerilim (OG)</option>
                      <option value="High Voltage">Yüksek Gerilim (YG)</option>
                    </select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label>Kısa Excerpt (Özet)</label>
                    <input
                      type="text"
                      value={productForm.excerpt}
                      onChange={(e) => setProductForm({ ...productForm, excerpt: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label>Teknik Parametreler (JSON formatında)</label>
                    <textarea
                      rows={2}
                      value={productForm.tech_specs_str}
                      onChange={(e) => setProductForm({ ...productForm, tech_specs_str: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 font-mono"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label>Detaylı Açıklama (HTML formatında)</label>
                    <textarea
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  
                  {/* Image and Upload */}
                  <div className="space-y-1">
                    <label>Görsel Dosyası Yükle</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setProductForm)}
                      className="w-full text-slate-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label>Yüklenen Görsel URL</label>
                    <input
                      type="text"
                      readOnly
                      value={productForm.image_url}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-500"
                    />
                  </div>

                  <div className="md:col-span-2 flex space-x-2 pt-2">
                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg">
                      {editingItem ? "Güncelle" : "Ekle"}
                    </button>
                    {editingItem && (
                      <button type="button" onClick={resetProductForm} className="bg-slate-800 text-white px-6 py-2.5 rounded-lg">
                        İptal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Products List */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/40">
                <h3 className="font-heading font-bold text-lg text-white mb-4">Mevcut Ürünler</h3>
                <div className="space-y-2">
                  {products.map((prod) => (
                    <div key={prod.id} className="flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-xl text-sm">
                      <div>
                        <div className="font-bold text-white">{prod.name}</div>
                        <div className="text-xs text-slate-500">{prod.voltage_class} | Slug: {prod.slug}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => startEditProduct(prod)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteItem("/api/products", prod.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-8">
              {/* Category Form */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60">
                <h3 className="font-heading font-bold text-lg text-white mb-4">
                  {editingItem ? "Kategoriyi Güncelle" : "Yeni Kategori Ekle"}
                </h3>
                <form onSubmit={handleCategorySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-200">
                  <div className="space-y-1">
                    <label>Kategori Adı</label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Slug</label>
                    <input
                      type="text"
                      required
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Üst Kategori (Sınırsız Alt Kategori)</label>
                    <select
                      value={categoryForm.parent_id}
                      onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-300"
                    >
                      <option value="">Kök Düzey (Ana Kategori)</option>
                      {categories
                        .filter((c) => !editingItem || c.id !== editingItem.id) // Avoid self-parenting
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label>Açıklama</label>
                    <input
                      type="text"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg">
                      {editingItem ? "Güncelle" : "Ekle"}
                    </button>
                    {editingItem && (
                      <button type="button" onClick={resetCategoryForm} className="bg-slate-800 text-white px-6 py-2.5 rounded-lg">
                        İptal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Categories list */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/40">
                <h3 className="font-heading font-bold text-lg text-white mb-4">Mevcut Kategoriler</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-xl text-sm">
                      <div>
                        <span className="font-bold text-white">{cat.name}</span>
                        {cat.parent_id && <span className="text-xs text-amber-500 ml-2">(Alt Kategori)</span>}
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => startEditCategory(cat)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteItem("/api/categories", cat.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: REFERENCES */}
          {activeTab === "references" && (
            <div className="space-y-8">
              {/* Reference Form */}
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60">
                <h3 className="font-heading font-bold text-lg text-white mb-4">
                  {editingItem ? "Referans Projeyi Güncelle" : "Yeni Proje Referansı Ekle"}
                </h3>
                <form onSubmit={handleReferenceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-200">
                  <div className="space-y-1">
                    <label>Proje Adı</label>
                    <input
                      type="text"
                      required
                      value={referenceForm.name}
                      onChange={(e) => setReferenceForm({ ...referenceForm, name: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Müşteri</label>
                    <input
                      type="text"
                      value={referenceForm.client}
                      onChange={(e) => setReferenceForm({ ...referenceForm, client: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Şehir / Konum</label>
                    <input
                      type="text"
                      value={referenceForm.city}
                      onChange={(e) => setReferenceForm({ ...referenceForm, city: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Yıl</label>
                    <input
                      type="number"
                      value={referenceForm.year}
                      onChange={(e) => setReferenceForm({ ...referenceForm, year: parseInt(e.target.value) })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  
                  {/* Coords for Leaflet Map */}
                  <div className="space-y-1">
                    <label>Enlem (Latitude)</label>
                    <input
                      type="number"
                      step="any"
                      value={referenceForm.latitude}
                      onChange={(e) => setReferenceForm({ ...referenceForm, latitude: parseFloat(e.target.value) })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="space-y-1">
                    <label>Boylam (Longitude)</label>
                    <input
                      type="number"
                      step="any"
                      value={referenceForm.longitude}
                      onChange={(e) => setReferenceForm({ ...referenceForm, longitude: parseFloat(e.target.value) })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label>İş Kapsamı</label>
                    <textarea
                      rows={3}
                      value={referenceForm.scope}
                      onChange={(e) => setReferenceForm({ ...referenceForm, scope: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="space-y-1">
                    <label>Görsel Dosyası</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setReferenceForm)}
                      className="w-full text-slate-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label>Yüklenen Görsel URL</label>
                    <input
                      type="text"
                      readOnly
                      value={referenceForm.image_url}
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-slate-500"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2 md:col-span-2">
                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg">
                      {editingItem ? "Güncelle" : "Ekle"}
                    </button>
                    {editingItem && (
                      <button type="button" onClick={resetReferenceForm} className="bg-slate-800 text-white px-6 py-2.5 rounded-lg">
                        İptal
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* References list */}
              <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/40">
                <h3 className="font-heading font-bold text-lg text-white mb-4">Mevcut Proje Referansları</h3>
                <div className="space-y-2">
                  {references.map((ref) => (
                    <div key={ref.id} className="flex items-center justify-between p-4 bg-slate-950/40 border border-white/5 rounded-xl text-sm">
                      <div>
                        <div className="font-bold text-white">{ref.name}</div>
                        <div className="text-xs text-slate-500">{ref.client} | {ref.city} ({ref.year})</div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => startEditReference(ref)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteItem("/api/references", ref.id)} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/40 space-y-4">
              <h3 className="font-heading font-bold text-lg text-white">Gelen Müşteri Başvuruları</h3>
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="p-6 bg-slate-950/50 border border-white/5 rounded-xl space-y-3 text-sm text-slate-200">
                    <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/5 pb-2">
                      <div>
                        <strong className="text-white text-base">{inq.name}</strong>
                        <span className="text-xs text-slate-500 ml-2">&lt;{inq.email}&gt;</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(inq.created_at).toLocaleString("tr-TR")}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
                      <div>Şirket: <strong className="text-slate-300">{inq.company || "Belirtilmedi"}</strong></div>
                      <div>Telefon: <strong className="text-slate-300">{inq.phone || "Belirtilmedi"}</strong></div>
                      <div>Konu: <strong className="text-slate-300">{inq.subject || "Genel"}</strong></div>
                      <div>Ürün İlgi Alanı: <strong className="text-amber-500">{inq.interest_product || "Yok"}</strong></div>
                    </div>

                    <div className="bg-slate-950/30 p-3 rounded-lg border border-white/5 text-slate-300 leading-relaxed font-light">
                      {inq.message}
                    </div>

                    {/* Attachment Link if present */}
                    {inq.attachment_url && (
                      <div className="flex items-center space-x-2 pt-2">
                        <File className="w-4 h-4 text-amber-500" />
                        <a
                          href={`${API_BASE_URL}${inq.attachment_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-amber-500 hover:underline font-semibold"
                        >
                          Eklenmiş İhale / Şartname Dosyasını Görüntüle
                        </a>
                      </div>
                    )}
                  </div>
                ))}
                {inquiries.length === 0 && (
                  <div className="text-slate-500 text-center py-10 font-sans">
                    Henüz kayıtlı müşteri başvurusu bulunmamaktadır.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: BRANDS */}
          {activeTab === "brands" && (
            <div className="space-y-8">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60">
                <h3 className="font-heading font-bold text-lg text-white mb-4">
                  {editingItem ? "Markayı Güncelle" : "Yeni Marka Ekle"}
                </h3>
                <form onSubmit={handleBrandSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-200">
                  <div className="space-y-1">
                    <label>Marka Adı</label>
                    <input type="text" required value={brandForm.name} onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2" />
                  </div>
                  <div className="space-y-1">
                    <label>Logo URL</label>
                    <input type="text" required value={brandForm.image_url} onChange={(e) => setBrandForm({ ...brandForm, image_url: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2" />
                  </div>
                  <div className="space-y-1">
                    <label>Logo Dosyası Yükle</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, setBrandForm)} className="w-full text-slate-500" />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input type="checkbox" checked={brandForm.is_active} onChange={(e) => setBrandForm({ ...brandForm, is_active: e.target.checked })} />
                    <label>Aktif</label>
                  </div>
                  <div className="md:col-span-2 flex space-x-2 pt-2">
                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg">{editingItem ? "Güncelle" : "Ekle"}</button>
                    {editingItem && <button type="button" onClick={() => { setEditingItem(null); setBrandForm({ name: "", image_url: "", is_active: true }); }} className="bg-slate-800 text-white px-6 py-2.5 rounded-lg">İptal</button>}
                  </div>
                </form>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/40">
                <h3 className="font-heading font-bold text-lg text-white mb-4">Mevcut Markalar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {brands.map((brand) => (
                    <div key={brand.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-xl flex items-center space-x-4">
                      {brand.image_url && <div className="w-16 h-16 relative"><Image src={`${API_BASE_URL}${brand.image_url}`} alt={brand.name} fill className="object-contain" /></div>}
                      <div className="flex-1">
                        <div className="font-bold text-white text-sm">{brand.name}</div>
                        <div className="text-xs text-slate-500">{brand.is_active ? "Aktif" : "Pasif"}</div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button onClick={() => startEditBrand(brand)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteItem("/api/brands", brand.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-8">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60">
                <h3 className="font-heading font-bold text-lg text-white mb-4">
                  {editingItem ? "Ayarı Güncelle" : "Yeni Ayar / Metin Ekle"}
                </h3>
                <form onSubmit={handleSettingSubmit} className="space-y-4 text-xs text-slate-200">
                  <div className="space-y-1">
                    <label>Ayar Anahtarı (örn: about_us, contact_email)</label>
                    <input type="text" required value={settingForm.key} onChange={(e) => setSettingForm({ ...settingForm, key: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2" />
                  </div>
                  <div className="space-y-1">
                    <label>Değer / Metin</label>
                    <textarea rows={5} value={settingForm.value} onChange={(e) => setSettingForm({ ...settingForm, value: e.target.value })} className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2" />
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg">{editingItem ? "Güncelle" : "Ekle"}</button>
                    {editingItem && <button type="button" onClick={() => { setEditingItem(null); setSettingForm({ key: "", value: "" }); }} className="bg-slate-800 text-white px-6 py-2.5 rounded-lg">İptal</button>}
                  </div>
                </form>
              </div>
              <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-slate-900/40">
                <h3 className="font-heading font-bold text-lg text-white mb-4">Sistem Ayarları</h3>
                <div className="space-y-2">
                  {settings.map((setting) => (
                    <div key={setting.id} className="p-4 bg-slate-950/40 border border-white/5 rounded-xl flex justify-between items-center text-sm">
                      <div><div className="font-bold text-amber-500">{setting.key}</div><div className="text-slate-400 line-clamp-1">{setting.value}</div></div>
                      <div className="flex space-x-2">
                        <button onClick={() => startEditSetting(setting)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteItem("/api/settings", setting.key)} className="p-2 bg-red-500/10 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MEDIA */}
          {activeTab === "media" && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-slate-900/60 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-bold text-lg text-white">Görsel Kütüphanesi</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mediaFiles.map((file) => (
                  <div key={file.filename} className="relative group bg-slate-950 rounded-xl overflow-hidden border border-white/5 aspect-square flex items-center justify-center">
                    {file.filename.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                      <Image src={`${API_BASE_URL}${file.url}`} alt={file.filename} fill className="object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="text-slate-500 flex flex-col items-center"><File className="w-8 h-8 mb-2" /><span className="text-[10px] break-all px-2 text-center">{file.filename}</span></div>
                    )}
                    <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2">
                      <button onClick={() => navigator.clipboard.writeText(file.url)} className="text-xs bg-amber-500 text-slate-950 px-3 py-1 rounded font-bold">Kopyala</button>
                      <button onClick={() => deleteItem("/api/media", file.filename)} className="text-xs bg-red-500 text-white px-3 py-1 rounded font-bold">Sil</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
