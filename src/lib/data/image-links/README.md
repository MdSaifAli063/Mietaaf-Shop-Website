# Mietaaf image links

This is the only folder you need when changing website images.

- `hero-images.ts` — homepage carousel banners
- `category-images.ts` — Featured Categories and category pages
- `home-section-images.ts` — Trending, New Arrivals, Wedding, Premium Suits, Fashion Gallery, Mietaaf Story, and Feed
- `client-story-images.ts` — Client Stories profile photos
- `page-images.ts` — About and Appointment page images
- `product-images.ts` — optional image overrides for any shop product

## Add an online image

Paste the complete image URL:

```ts
hero: "https://example.com/my-image.jpg",
```

## Add an image from this project

Place the file inside `public`, for example `public/uploads/my-image.webp`, then use:

```ts
hero: "/uploads/my-image.webp",
```

Do not include `public` in the link. Save the file and the website will update automatically.

