import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, Play, Sparkles } from "lucide-react";
import logo from "@/assets/pasa-motor-logo.png";
import { LOGO_ANIMATIONS, DEFAULT_ANIMATION_ID, type LogoAnimation } from "@/lib/logoAnimations";

const PAGE_KEY = "hero_animation";

const AnimationCard = ({
  anim,
  isSelected,
  onApply,
  applying,
}: {
  anim: LogoAnimation;
  isSelected: boolean;
  onApply: () => void;
  applying: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const trigger = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove(anim.className);
    void el.offsetWidth;
    el.classList.add(anim.className);
  };

  return (
    <div className="glass-card rounded-xl p-4 flex flex-col">
      <div className="aspect-square rounded-lg bg-muted/40 flex items-center justify-center overflow-hidden mb-3 relative">
        <div ref={ref} className="will-change-transform" style={{ transformOrigin: "center" }}>
          <img
            src={logo}
            alt={anim.name}
            className="w-28 h-28 select-none pointer-events-none"
            draggable={false}
          />
        </div>
        {isSelected && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            <Check className="w-3 h-3" /> Aktif
          </span>
        )}
      </div>
      <div className="flex-1 mb-3">
        <p className="font-heading font-semibold text-foreground text-sm">{anim.name}</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{anim.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={trigger}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-foreground text-xs font-medium hover:bg-muted/70"
        >
          <Play className="w-3 h-3" /> Önizle
        </button>
        <button
          onClick={onApply}
          disabled={applying || isSelected}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50"
        >
          {applying ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {isSelected ? "Seçili" : "Uygula"}
        </button>
      </div>
    </div>
  );
};

const AdminAnimations = () => {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_ANIMATION_ID);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("sections")
        .eq("page_key", PAGE_KEY)
        .maybeSingle();
      const id = (data?.sections as any)?.animation_id;
      if (typeof id === "string") setSelectedId(id);
      setLoading(false);
    })();
  }, []);

  const apply = async (anim: LogoAnimation) => {
    setApplyingId(anim.id);
    try {
      const { data: existing } = await supabase
        .from("site_content")
        .select("id")
        .eq("page_key", PAGE_KEY)
        .maybeSingle();

      const payload = {
        page_key: PAGE_KEY,
        title: "Hero Logo Animation",
        sections: { animation_id: anim.id } as any,
      };

      const { error } = existing
        ? await supabase.from("site_content").update(payload).eq("id", existing.id)
        : await supabase.from("site_content").insert(payload);

      if (error) throw error;
      setSelectedId(anim.id);
      toast({ title: "Uygulandı", description: `${anim.name} animasyonu aktif.` });
    } catch (e: any) {
      toast({ title: "Hata", description: e?.message ?? "Kaydedilemedi", variant: "destructive" });
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Logo Animasyonları</h1>
        <p className="text-sm text-muted-foreground">
          20 farklı animasyondan birini seçin. Seçim ana sayfa hero logosuna uygulanır.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {LOGO_ANIMATIONS.map((a) => (
            <AnimationCard
              key={a.id}
              anim={a}
              isSelected={selectedId === a.id}
              onApply={() => apply(a)}
              applying={applyingId === a.id}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAnimations;
