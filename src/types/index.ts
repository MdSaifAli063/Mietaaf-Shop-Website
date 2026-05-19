export type CategorySlug =
  | "sherwani"
  | "blazer"
  | "coat"
  | "suits"
  | "kurta"
  | "pants"
  | "designer-dresses"
  | "indo-western"
  | "wedding-collection"
  | "festive-collection"
  | "premium-collection";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  discountPercent?: number;
  category: string;
  categorySlug: CategorySlug;
  sizes: string[];
  colors: ProductColor[];
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  fabric: string;
  tags: string[];
  /** Catalog PDF headline (e.g. MEN TUXEDO SUIT SET) */
  catalogTitle?: string;
  /** Lines under “Description” on catalog layout */
  catalogBullets?: string[];
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  wedding?: boolean;
  popularity?: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href?: string;
  cta?: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  role?: "user" | "admin";
}

export interface OrderLine {
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
  items: OrderLine[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "cancelled";
  createdAt: string;
}

export interface CheckoutFormValues {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}
