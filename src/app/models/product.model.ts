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
  category: string | null;
  material: string | null;
  image_url: string | null;
}
