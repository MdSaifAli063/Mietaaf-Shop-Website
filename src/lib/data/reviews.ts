import type { Review } from "@/types";

export const DUMMY_REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "p1",
    authorName: "Vikram",
    rating: 5,
    title: "Flawless ceremony piece",
    body: "The embroidery photographs beautifully and the fit is sharp without feeling stiff.",
    createdAt: "2025-12-01",
  },
  {
    id: "r2",
    productId: "p1",
    authorName: "Aditya",
    rating: 4,
    title: "Premium feel",
    body: "Took one alteration locally but Mietaaf’s baseline tailoring is excellent.",
    createdAt: "2025-11-18",
  },
];

export function reviewsForProduct(productId: string): Review[] {
  return DUMMY_REVIEWS.filter((review) => review.productId === productId);
}
