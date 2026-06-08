const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  meta_title?: string;
  meta_description?: string;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  description?: string;
  excerpt?: string;
  voltage_class?: string;
  tech_specs?: Record<string, any>;
  image_gallery?: string[];
  datasheet_url?: string;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
}

export interface Reference {
  id: number;
  name: string;
  client?: string;
  city?: string;
  year?: number;
  scope?: string;
  latitude?: number;
  longitude?: number;
  image_gallery?: string[];
  meta_title?: string;
  meta_description?: string;
}

export interface ContactInquiry {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  interest_product?: string;
}

// ----------------- API FUNCTIONS -----------------

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText || response.statusText}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function getCategoryTree(): Promise<CategoryTree[]> {
  return fetchAPI("/api/categories");
}

export async function getAllCategories(): Promise<Category[]> {
  return fetchAPI("/api/categories/all");
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  return fetchAPI(`/api/categories/${slug}`);
}

export async function getProducts(filters: {
  category?: string;
  voltage_class?: string;
  search?: string;
} = {}): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.voltage_class) params.append("voltage_class", filters.voltage_class);
  if (filters.search) params.append("search", filters.search);

  const queryStr = params.toString() ? `?${params.toString()}` : "";
  return fetchAPI(`/api/products${queryStr}`);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  return fetchAPI(`/api/products/${slug}`);
}

export async function getReferences(): Promise<Reference[]> {
  return fetchAPI("/api/references");
}

export async function submitContactInquiry(inquiry: ContactInquiry, attachmentUrl?: string): Promise<any> {
  const queryStr = attachmentUrl ? `?attachment_url=${encodeURIComponent(attachmentUrl)}` : "";
  return fetchAPI(`/api/contact${queryStr}`, {
    method: "POST",
    body: JSON.stringify(inquiry),
  });
}

export async function uploadFile(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
    method: "POST",
    body: formData,
    // Note: Do not set Content-Type header, fetch sets it automatically with the correct boundary
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload Error: ${response.status} - ${errorText || response.statusText}`);
  }

  return response.json();
}
