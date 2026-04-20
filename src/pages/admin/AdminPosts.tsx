import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, X, Loader2, FileText, Eye } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Post = Tables<"posts">;

const slugify = (text: string) =>
  text.toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyForm = {
  title: "", slug: "", excerpt: "", content: "", cover_image: "",
  meta_title: "", meta_description: "", is_published: false,
};

const AdminPosts = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };

  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt || "", content: p.content || "",
      cover_image: p.cover_image || "", meta_title: p.meta_title || "",
      meta_description: p.meta_description || "", is_published: p.is_published,
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: any = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      cover_image: form.cover_image.trim() || null,
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
      is_published: form.is_published,
      published_at: form.is_published ? (editing?.published_at || new Date().toISOString()) : null,
    };
    const { error } = editing
      ? await supabase.from("posts").update(payload).eq("id", editing.id)
      : await supabase.from("posts").insert(payload);
    setSaving(false);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: editing ? "Güncellendi" : "Eklendi" }); setOpen(false); load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Silindi" }); load(); }
  };

  const generateAI = async () => {
    if (!aiTopic.trim()) {
      toast({ title: "Konu girin", description: "AI için bir konu yazın.", variant: "destructive" });
      return;
    }
    setAiGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-blog-post", {
        body: { topic: aiTopic.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setForm({
        title: data.title || "",
        slug: slugify(data.title || ""),
        excerpt: data.excerpt || "",
        content: data.content || "",
        cover_image: "",
        meta_title: data.meta_title || data.title || "",
        meta_description: data.meta_description || data.excerpt || "",
        is_published: false,
      });
      setAiTopic("");
      toast({ title: "AI yazı oluşturdu", description: "İncele ve yayınla." });
    } catch (err: any) {
      toast({ title: "AI Hatası", description: err.message, variant: "destructive" });
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Blog Yazıları</h1>
            <p className="text-sm text-muted-foreground">Manuel veya AI ile yazı oluşturun</p>
          </div>
          <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Yeni Yazı
          </button>
        </div>

        {/* AI Generator */}
        <div className="glass-card rounded-xl p-5 mb-6 border border-secondary/30">
          <h2 className="font-heading font-semibold text-foreground mb-1 flex items-center gap-2">
            ✨ AI ile Otomatik Blog Üret
          </h2>
          <p className="text-xs text-muted-foreground mb-3">Bir konu girin, AI tam SEO uyumlu blog yazısı üretsin.</p>
          <div className="flex gap-2 flex-wrap">
            <input
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              placeholder="Örn: Motosiklet zincir bakımı nasıl yapılır?"
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm"
            />
            <button onClick={generateAI} disabled={aiGenerating} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 disabled:opacity-50 inline-flex items-center gap-2">
              {aiGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
              Üret
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Henüz yazı yok.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((p) => (
              <div key={p.id} className="glass-card rounded-xl p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{p.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${p.is_published ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                      {p.is_published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{p.excerpt || p.slug}</p>
                </div>
                {p.is_published && (
                  <a href={`/blog/${p.slug}`} target="_blank" className="p-2 rounded hover:bg-muted text-muted-foreground"><Eye className="w-4 h-4" /></a>
                )}
                <button onClick={() => openEdit(p)} className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => remove(p.id)} className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl text-foreground">{editing ? "Yazıyı Düzenle" : "Yeni Yazı"}</h2>
              <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="text-xs text-muted-foreground">Başlık *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Özet</label>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">İçerik (HTML)</label>
                <textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm font-mono text-xs" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Kapak Görseli URL</label>
                <input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} placeholder="https://..." className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">SEO Başlık</label>
                  <input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">SEO Açıklama</label>
                  <textarea rows={2} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
                Yayınla
              </label>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-lg bg-muted text-foreground text-sm font-medium">İptal</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPosts;
