import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const slugify = (s: string) =>
  s.toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    .slice(0, 60) || "post";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!AI_GATEWAY_KEY) {
      console.error("LOVABLE_API_KEY missing");
      return json({ error: "Sunucu yapılandırma hatası: AI anahtarı eksik" }, 500);
    }

    // --- Auth: require valid JWT + admin role ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Yetkisiz erişim. Lütfen tekrar giriş yapın." }, 401);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      console.error("Auth claims error:", claimsError);
      return json({ error: "Oturum geçersiz. Tekrar giriş yapın." }, 401);
    }

    const userId = claimsData.claims.sub;
    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) {
      console.error("Role check failed:", roleError);
      return json({ error: "Bu işlem için admin yetkisi gerekli" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const { topic, generateImage = true } = body;
    if (!topic || typeof topic !== "string" || topic.length > 500) {
      return json({ error: "Geçerli bir konu gerekli (max 500 karakter)" }, 400);
    }

    // ---------------- 1) Generate blog text ----------------
    const systemPrompt = `Sen Paşa Motor için profesyonel bir motosiklet uzmanı blog yazarısın. Türkçe, SEO uyumlu ve detaylı blog yazıları üretirsin.
Çıktıyı SADECE şu JSON formatında ver, başka hiçbir şey yazma:
{
  "title": "akılda kalıcı, SEO uyumlu başlık (60 karakter altında)",
  "excerpt": "kısa özet (160 karakter civarı)",
  "meta_title": "SEO başlığı (60 karakter altı)",
  "meta_description": "meta açıklama (155 karakter altı)",
  "content": "<h2>...</h2><p>...</p> formatında HTML içerik. En az 800 kelime, alt başlıklar (h2,h3), paragraflar, listeler (ul/li) içersin. Türkçe ve düzgün noktalama.",
  "image_prompt": "kapak görseli için detaylı, fotorealistik İngilizce prompt (motosiklet odaklı, profesyonel atölye/yol/garaj atmosferi, sinematik aydınlatma, 16:9, blog cover photo)"
}`;

    console.log("[generate-blog-post] generating text for topic:", topic);
    const textResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_GATEWAY_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Konu: ${topic}\n\nBu konuda Paşa Motor blog'u için kapsamlı, SEO odaklı bir yazı üret. Hedef kitle: motosiklet sahipleri ve meraklıları. Türkiye/İstanbul bağlamı ekleyebilirsin.` },
        ],
      }),
    });

    if (!textResp.ok) {
      const errText = await textResp.text();
      console.error("AI text gen error:", textResp.status, errText);
      if (textResp.status === 429) return json({ error: "AI rate limit aşıldı. Biraz bekleyin." }, 429);
      if (textResp.status === 402) return json({ error: "AI kredisi tükendi. Cloud ayarlarından kredi ekleyin." }, 402);
      return json({ error: `AI metin üretemedi (${textResp.status})` }, 502);
    }

    const textData = await textResp.json();
    let raw = textData.choices?.[0]?.message?.content || "";
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("JSON parse error:", e, "raw:", raw.slice(0, 500));
      return json({ error: "AI cevabı işlenemedi. Tekrar deneyin." }, 502);
    }

    // ---------------- 2) Generate cover image (optional) ----------------
    let coverImageUrl: string | null = null;
    if (generateImage && parsed.image_prompt) {
      try {
        console.log("[generate-blog-post] generating image");
        const imgPrompt = `${parsed.image_prompt}. Professional motorcycle blog cover photo, cinematic lighting, sharp focus, 16:9 aspect, no text, no watermark, no logos.`;

        const imgResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${AI_GATEWAY_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [{ role: "user", content: imgPrompt }],
            modalities: ["image", "text"],
          }),
        });

        if (imgResp.ok) {
          const imgData = await imgResp.json();
          const dataUrl: string | undefined =
            imgData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

          if (dataUrl?.startsWith("data:image/")) {
            // data:image/png;base64,xxxxx
            const m = dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/i);
            if (m) {
              const mime = m[1];
              const ext = mime.split("/")[1] || "png";
              const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
              const fileName = `${Date.now()}-${slugify(parsed.title || topic)}.${ext}`;

              // Upload using service role to bypass RLS
              const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
              const { error: upErr } = await adminClient.storage
                .from("blog-images")
                .upload(fileName, bytes, { contentType: mime, upsert: false });

              if (upErr) {
                console.error("Storage upload error:", upErr);
              } else {
                const { data: pub } = adminClient.storage.from("blog-images").getPublicUrl(fileName);
                coverImageUrl = pub.publicUrl;
                console.log("[generate-blog-post] cover uploaded:", coverImageUrl);
              }
            }
          } else {
            console.warn("Image response did not contain data URL");
          }
        } else {
          const t = await imgResp.text();
          console.error("Image gen failed:", imgResp.status, t.slice(0, 300));
        }
      } catch (e) {
        console.error("Image generation exception:", e);
        // Non-fatal — still return blog content
      }
    }

    return json({
      title: parsed.title,
      excerpt: parsed.excerpt,
      meta_title: parsed.meta_title,
      meta_description: parsed.meta_description,
      content: parsed.content,
      cover_image: coverImageUrl,
    });
  } catch (e: any) {
    console.error("generate-blog-post fatal:", e?.message, e?.stack);
    return json({ error: e?.message || "İşlem başarısız oldu" }, 500);
  }
});
