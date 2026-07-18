# Mietaaf editable storefront data

Use these files when changing storefront content. No page/component edits are required.

- `../category-products.ts` — all eight numbered products per category: name, image, price, original price, discount, rating, and reviews
- `../category-products/wedding-products.ts` — Wedding category products 1-8
- `../category-products/premium-products.ts` — Premium category products 1-8
- `../home-product-sections.ts` — unique product placement for Trending, New Arrivals, Wedding, Premium Suits, and Feed
- `hero-images.ts` — homepage carousel banners
- `category-images.ts` — Featured Categories and category page covers
- `home-section-images.ts` — Fashion Gallery and Mietaaf Story images
- `client-story-images.ts` — Client Stories profile photos
- `page-images.ts` — About and Appointment page images

## Add an online image

Paste the complete image URL into the product row:

```ts
product(1, "Product name", "https://example.com/image.jpg", 45999, 52999, 13, 4.9, 128)
```

## Add an image from this project

Place the file inside `public`, for example `public/uploads/look-1.webp`, then use
`/uploads/look-1.webp`. Do not include `public` in the path.
