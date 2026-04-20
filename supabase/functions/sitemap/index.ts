import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SITE = "https://pasamotor.com.tr";

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/hakkimizda", priority: "0.7", changefreq: "monthly" },
  { path: "/hizmetler", priority: "0.8", changefreq: "monthly" },
  { path: "/yedek-parca", priority: "0.9", changefreq: "weekly" },
  { path: "/blog", priority: "0.9", changefreq: "daily" },
  { path: "/galeri", priority: "0.6", changefreq: "monthly" },
  { path: "/iletisim", priority: "0.7", changefreq: "monthly" },
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
    .select("slug, updated_at")
    .eq("is_active", true);

  for (const p of products ?? []) {
    const lastmod = (p.updated_at ?? today).split("T")[0];
    urls.push(
      `<url><loc>${SITE}/yedek-parca/${p.slug}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`,
    );
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("is_published", true);

  for (const p of posts ?? []) {
    const lastmod = (p.updated_at ?? today).split("T")[0];
    urls.push(
      `<url><loc>${SITE}/blog/${p.slug}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
