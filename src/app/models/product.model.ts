export interface ApiResponse {
  success: boolean;
  message: string;
  data: ProductListData;
}
export interface ProductListData {
  products: Product[];
  total: number;
  totalPages: number;
  hasNext: boolean;
}
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_price: number | null;
  avg_rating: number | null;
  total_reviews: number;
  status: number;
  is_featured: boolean;
  is_trending: boolean;
  category: string | null;
  material: string | null;
  image_url: string | null;
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: ProductDetail;
}

export interface ProductDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price: number | null;
  avg_rating: number | null;
  total_reviews: number;
  status: number;
  is_featured: boolean;
  is_trending: boolean;
  category_id: number | null;
  material_id: number | null;
  category: string | null;
  material: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: any[];
}

export interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
}

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  stock: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}
export interface Material {
  id: number;
  name: string;
  slug: string;
}
