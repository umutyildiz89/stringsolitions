import { MetadataRoute } from "next";
import { getProducts, getAllCategories } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Base routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/products`, lastModified: new Date() },
    { url: `${baseUrl}/references`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ];

  let categoryRoutes: any[] = [];
  try {
    const categories = await getAllCategories();
    categoryRoutes = categories.map((cat) => ({
      url: `${baseUrl}/products?category=${cat.slug}`,
      lastModified: new Date(),
    }));
  } catch (e) {
    console.warn("Sitemap failed to fetch categories, omitting dynamic categories");
  }

  let productRoutes: any[] = [];
  try {
    const products = await getProducts();
    productRoutes = products.map((prod) => ({
      url: `${baseUrl}/products/cat/${prod.slug}`,
      lastModified: new Date(),
    }));
  } catch (e) {
    console.warn("Sitemap failed to fetch products, omitting dynamic products");
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
