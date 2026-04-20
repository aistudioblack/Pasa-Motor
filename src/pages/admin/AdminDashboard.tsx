import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, FileText, MessageSquare, Image as ImageIcon, TrendingUp, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface Stat {
  label: string;
  value: number;
  icon: any;
  link: string;
  color: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [products, posts, messages, gallery, unread] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("posts").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("gallery_images").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("is_read", false),
      ]);

      setStats([
        { label: "Toplam Ürün", value: products.count || 0, icon: Package, link: "/admin/urunler", color: "text-primary" },
        { label: "Blog Yazısı", value: posts.count || 0, icon: FileText, link: "/admin/blog", color: "text-secondary" },
        { label: "Toplam Mesaj", value: messages.count || 0, icon: MessageSquare, link: "/admin/mesajlar", color: "text-accent" },
        { label: "Galeri Görseli", value: gallery.count || 0, icon: ImageIcon, link: "/admin/galeri", color: "text-primary" },
      ]);
      setUnreadMessages(unread.count || 0);
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="glass-card rounded-xl p-5 hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <TrendingUp className="w-4 h-4 text-muted-foreground/50" />
              </div>
              <p className="font-heading font-bold text-3xl text-foreground">
                {loading ? "..." : stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-6">
            <h2 className="font-heading font-semibold text-foreground mb-4">Hızlı İşlemler</h2>
            <div className="space-y-2">
              <Link to="/admin/urunler" className="block px-4 py-3 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-sm transition">
                + Yeni Ürün Ekle
              </Link>
              <Link to="/admin/blog" className="block px-4 py-3 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-sm transition">
                + Yeni Blog Yazısı
              </Link>
              <Link to="/admin/galeri" className="block px-4 py-3 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-sm transition">
                + Galeriye Görsel Ekle
              </Link>
              <Link to="/admin/faq" className="block px-4 py-3 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-sm transition">
                + Yeni SSS Sorusu
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h2 className="font-heading font-semibold text-foreground mb-4">Site Durumu</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Site URL</span>
                <a href="/" target="_blank" className="text-primary hover:underline">pasamotor.com.tr</a>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Backend</span>
                <span className="text-green-500">● Aktif</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Veritabanı</span>
                <span className="text-green-500">● Bağlı</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
