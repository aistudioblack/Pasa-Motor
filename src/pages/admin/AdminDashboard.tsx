import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Package,
  FileText,
  MessageSquare,
  Image as ImageIcon,
  TrendingUp,
  Eye,
  Clock,
  Mail,
  Phone,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Stat {
  label: string;
  value: number;
  icon: any;
  link: string;
  color: string;
  bg: string;
}

interface RecentMessage {
  id: string;
  name: string;
  phone: string;
  subject: string;
  is_read: boolean;
  created_at: string;
}

interface RecentPost {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  created_at: string;
}

interface BrandStat {
  brand: string;
  count: number;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [brandStats, setBrandStats] = useState<BrandStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [products, posts, messages, gallery, unread, recentMsgs, recentPostsRes, allProducts] =
        await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("posts").select("*", { count: "exact", head: true }),
          supabase.from("messages").select("*", { count: "exact", head: true }),
          supabase.from("gallery_images").select("*", { count: "exact", head: true }),
          supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
          supabase
            .from("messages")
            .select("id,name,phone,subject,is_read,created_at")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("posts")
            .select("id,title,slug,is_published,created_at")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase.from("products").select("brand"),
        ]);

      setStats([
        { label: "Toplam Ürün", value: products.count || 0, icon: Package, link: "/admin/urunler", color: "text-primary", bg: "bg-primary/10" },
        { label: "Blog Yazısı", value: posts.count || 0, icon: FileText, link: "/admin/blog", color: "text-secondary", bg: "bg-secondary/10" },
        { label: "Toplam Mesaj", value: messages.count || 0, icon: MessageSquare, link: "/admin/mesajlar", color: "text-accent", bg: "bg-accent/10" },
        { label: "Galeri Görseli", value: gallery.count || 0, icon: ImageIcon, link: "/admin/galeri", color: "text-primary", bg: "bg-primary/10" },
      ]);
      setUnreadMessages(unread.count || 0);
      setRecentMessages((recentMsgs.data as RecentMessage[]) || []);
      setRecentPosts((recentPostsRes.data as RecentPost[]) || []);

      // Aggregate by brand client-side
      const counts = new Map<string, number>();
      (allProducts.data || []).forEach((p: { brand: string }) => {
        counts.set(p.brand, (counts.get(p.brand) || 0) + 1);
      });
      setBrandStats(
        Array.from(counts.entries())
          .map(([brand, count]) => ({ brand, count }))
          .sort((a, b) => b.count - a.count),
      );

      setLoading(false);
    };
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-2xl md:text-3xl text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Paşa Motor sitenizin genel durumu</p>
        </div>

        {unreadMessages > 0 && (
          <Link
            to="/admin/mesajlar"
            className="block mb-6 glass-card rounded-xl p-4 border border-primary/30 hover:border-primary transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{unreadMessages} okunmamış mesajınız var</p>
                <p className="text-xs text-muted-foreground">Görmek için tıklayın</p>
              </div>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </div>
          </Link>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="glass-card rounded-xl p-5 hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition" />
              </div>
              <p className="font-heading font-bold text-3xl text-foreground">
                {loading ? "..." : stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Recent messages */}
          <div className="glass-card rounded-xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-foreground">Son Mesajlar</h2>
              <Link to="/admin/mesajlar" className="text-xs text-primary hover:underline">
                Tümünü gör →
              </Link>
            </div>
            {loading ? (
              <p className="text-sm text-muted-foreground">Yükleniyor...</p>
            ) : recentMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz mesaj yok.</p>
            ) : (
              <div className="space-y-2">
                {recentMessages.map((m) => (
                  <Link
                    key={m.id}
                    to="/admin/mesajlar"
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition group"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${m.is_read ? "bg-muted-foreground/40" : "bg-primary"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{m.name}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(m.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{m.subject}</p>
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {m.phone}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Brand distribution */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-heading font-semibold text-foreground mb-4">Markaya Göre Ürünler</h2>
            {loading ? (
              <p className="text-sm text-muted-foreground">Yükleniyor...</p>
            ) : brandStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz ürün yok.</p>
            ) : (
              <div className="space-y-3">
                {brandStats.map((b) => {
                  const max = Math.max(...brandStats.map((x) => x.count));
                  const pct = (b.count / max) * 100;
                  return (
                    <div key={b.brand}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-foreground">{b.brand}</span>
                        <span className="text-muted-foreground">{b.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent posts */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-foreground">Son Blog Yazıları</h2>
              <Link to="/admin/blog" className="text-xs text-primary hover:underline">
                Tümünü gör →
              </Link>
            </div>
            {loading ? (
              <p className="text-sm text-muted-foreground">Yükleniyor...</p>
            ) : recentPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Henüz yazı yok.</p>
            ) : (
              <div className="space-y-2">
                {recentPosts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 p-3 rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDate(p.created_at)}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                        p.is_published
                          ? "bg-green-500/15 text-green-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.is_published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-heading font-semibold text-foreground mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/admin/urunler" className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-sm transition">
                <Plus className="w-4 h-4" /> Ürün
              </Link>
              <Link to="/admin/blog" className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-sm transition">
                <Plus className="w-4 h-4" /> Blog Yazısı
              </Link>
              <Link to="/admin/galeri" className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-sm transition">
                <Plus className="w-4 h-4" /> Galeri
              </Link>
              <Link to="/admin/faq" className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-sm transition">
                <Plus className="w-4 h-4" /> SSS
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-border space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Site
                </span>
                <a href="/" target="_blank" className="text-primary hover:underline text-xs">pasamotor.com.tr</a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Backend</span>
                <span className="text-green-500 text-xs">● Aktif</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Veritabanı</span>
                <span className="text-green-500 text-xs">● Bağlı</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
