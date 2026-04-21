import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY_KEY = Deno.env.get("LOVABLE_API_KEY"); // Lovable AI Gateway credential (env-only, not exposed)

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    if (!topic || typeof topic !== "string") {
      return new Response(JSON.stringify({ error: "topic gerekli" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Sen Paşa Motor için profesyonel bir motosiklet uzmanı blog yazarısın. Türkçe, SEO uyumlu ve detaylı blog yazıları üretirsin. 
Çıktıyı SADECE şu JSON formatında ver, başka hiçbir şey yazma:
{
  "title": "akılda kalıcı, SEO uyumlu başlık (60 karakter altında)",
  "excerpt": "kısa özet (160 karakter civarı)",
  "meta_title": "SEO başlığı (60 karakter altı)",
  "meta_description": "meta açıklama (155 karakter altı)",
  "content": "<h2>...</h2><p>...</p> formatında HTML içerik. En az 800 kelime, alt başlıklar (h2,h3), paragraflar, listeler (ul/li) içersin. Türkçe ve düzgün noktalama."
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
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

    if (!response.ok) {
      const errText = await response.text();
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "AI rate limit aşıldı. Biraz bekleyin." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI kredisi tükendi. Cloud ayarlarından kredi ekleyin." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI hatası: ${errText}`);
    }

    const data = await response.json();
    let raw = data.choices?.[0]?.message?.content || "";
    // strip markdown code fences if present
    raw = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    const parsed = JSON.parse(raw);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("generate-blog-post error:", e);
    return new Response(JSON.stringify({ error: e.message || "Bilinmeyen hata" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
