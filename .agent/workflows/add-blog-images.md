---
description: How to add hero images to blog articles
---
# Adding Hero Images to Blog Articles

## For New Articles (MDX Files)

1. **Generate or obtain an image** (recommended: 1200x800px, PNG or JPG)

2. **Place the image** in `/public/images/blog/`:
   ```
   public/images/blog/your-article-slug-cover.png
   ```

3. **Add the `heroImage` field** to your MDX frontmatter:
   ```yaml
   ---
   title: "Your Article Title"
   date: 2026-01-27
   excerpt: "A brief description..."
   heroImage: "/images/blog/your-article-slug-cover.png"
   pillars: [sleep, mind-body]
   ---
   ```

4. **Sync to Supabase** (if using database):
   // turbo
   ```bash
   npm run seed:articles
   ```

## For Existing Supabase Articles

Use the **Admin Panel** at `/admin/articles/[slug]`:
1. Navigate to the article
2. Add the image path in the "Hero Image" field
3. Save

## Image Guidelines

- **Dimensions**: 1200×800px (3:2 aspect ratio) works best
- **Aesthetic**: Match the NoStress brand - soft, calming, muted earth tones
- **Format**: PNG for best quality, JPG for smaller files
- **Naming**: Use kebab-case matching the article slug, e.g., `my-article-cover.png`

## Using AI-Generated Images

You can ask Claude to generate images using prompts like:
> "A calming, minimalist blog hero image about [topic]. Soft [color palette]. [Scene description]. Editorial photography style, premium aesthetic. No text."
