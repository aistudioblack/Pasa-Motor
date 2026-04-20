import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, X, Loader2, Package } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const emptyForm = {
  title: "", slug: "", brand: "TVS", category: "yedek-parca",
  description: "", content: "", price: "", images: "",
  is_active: true, is_featured: false,
};

const AdminProducts = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, brand: p.brand, category: p.category,
      description: p.description || "", content: p.content || "",
      price: p.price?.toString() || "",
      images: (p.images || []).join("\n"),
      is_active: p.is_active, is_featured: p.is_featured,
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      brand: form.brand,
      category: form.category,
      description: form.description.trim() || null,
      content: form.content.trim() || null,
      price: form.price ? parseFloat(form.price) : null,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      is_active: form.is_active,
      is_featured: form.is_featured,
    };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing ? "Güncellendi" : "Eklendi" });
      setOpen(false);
      load();
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Silindi" }); load(); }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Ürünler</h1>
            <p className="text-sm text-muted-foreground">Yedek parça ve ürün yönetimi</p>
          </div>
          <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Yeni Ürün
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Henüz ürün eklenmedi.</p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="text-left p-3">Başlık</th>
                    <th className="text-left p-3">Marka</th>
                    <th className="text-left p-3">Fiyat</th>
                    <th className="text-left p-3">Durum</th>
                    <th className="text-right p-3">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-3 text-foreground font-medium">{p.title}</td>
                      <td className="p-3 text-muted-foreground">{p.brand}</td>
                      <td className="p-3 text-muted-foreground">
                        {p.price ? new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(p.price) : "-"}
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded ${p.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                          {p.is_active ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex gap-1">
                          <button onClick={() => openEdit(p)} className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => remove(p.id)} className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl text-foreground">{editing ? "Ürünü Düzenle" : "Yeni Ürün"}</h2>
              <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="text-xs text-muted-foreground">Başlık *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Slug (URL)</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Marka *</label>
                  <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm">
                    {["TVS", "Hero", "Falcon", "Işıldar", "Diğer"].map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Kategori *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm">
                    <option value="yedek-parca">Yedek Parça</option>
                    <option value="motosiklet">Motosiklet</option>
                    <option value="aksesuar">Aksesuar</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Kısa Açıklama</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Detaylı İçerik (HTML destekli)</label>
                <textarea rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm font-mono" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Fiyat (₺)</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Görsel URL'leri (her satıra bir tane)</label>
                <textarea rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm font-mono text-xs" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Aktif
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Öne Çıkan
                </label>
              </div>
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

export default AdminProducts;
