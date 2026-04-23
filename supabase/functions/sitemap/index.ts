import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://pasamotor.com.tr";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/hakkimizda", priority: "0.8", changefreq: "monthly" },
  { path: "/hizmetler", priority: "0.9", changefreq: "weekly" },
  { path: "/yedek-parca", priority: "0.9", changefreq: "daily" },
  { path: "/blog", priority: "0.9", changefreq: "daily" },
  { path: "/galeri", priority: "0.7", changefreq: "weekly" },
  { path: "/iletisim", priority: "0.8", changefreq: "monthly" },
];

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  const today = new Date().toISOString().split("T")[0];
  const urls: string[] = [];

  for (const r of STATIC_ROUTES) {
    urls.push(
      `<url><loc>${SITE}${r.path}</loc><lastmod>${today}</lastmod><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`,
    );
  }

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at, images")
    .eq("is_active", true);

  for (const p of products ?? []) {
    const lastmod = (p.updated_at ?? today).split("T")[0];
    const imgTags = (p.images ?? [])
      .slice(0, 5)
      .map(
        (img: string) =>
          `<image:image><image:loc>${escapeXml(img)}</image:loc></image:image>`,
      )
      .join("");
    urls.push(
      `<url><loc>${SITE}/yedek-parca/${p.slug}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority>${imgTags}</url>`,
    );
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at, cover_image")
    .eq("is_published", true);

  for (const p of posts ?? []) {
    const lastmod = (p.updated_at ?? today).split("T")[0];
    const imgTag = p.cover_image
      ? `<image:image><image:loc>${escapeXml(p.cover_image)}</image:loc></image:image>`
      : "";
    urls.push(
      `<url><loc>${SITE}/blog/${p.slug}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority>${imgTag}</url>`,
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
});

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
