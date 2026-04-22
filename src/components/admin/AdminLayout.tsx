import { useEffect, useState, ReactNode } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Package,
  FileText,
  MessageSquare,
  Image as ImageIcon,
  HelpCircle,
  LogOut,
  ShieldAlert,
  Loader2,
  Menu,
  X,
  Sparkles,
  Settings,
} from "lucide-react";
import logo from "@/assets/pasa-motor-logo.png";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/urunler", label: "Ürünler", icon: Package },
  { to: "/admin/blog", label: "Blog Yazıları", icon: FileText },
  { to: "/admin/mesajlar", label: "Mesajlar", icon: MessageSquare },
  { to: "/admin/galeri", label: "Galeri", icon: ImageIcon },
  { to: "/admin/faq", label: "SSS", icon: HelpCircle },
  { to: "/admin/animasyonlar", label: "Animasyonlar", icon: Sparkles },
  { to: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async (currentUser: User | null) => {
      if (!currentUser) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        navigate("/admin/giris");
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUser.id)
        .eq("role", "admin")
        .maybeSingle();
      if (mounted) {
        setIsAdmin(!!data);
        setLoading(false);
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkAccess(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkAccess(session?.user ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/giris");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="glass-card rounded-xl p-8 max-w-md text-center">
          <ShieldAlert className="w-12 h-12 mx-auto text-destructive mb-4" />
          <h1 className="font-heading font-bold text-xl text-foreground mb-2">Erişim Reddedildi</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Bu sayfayı görüntülemek için yönetici yetkisine sahip olmanız gerekiyor.
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  }

  const isActive = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <img src={logo} alt="Paşa Motor" className="h-10 w-auto" />
            <div>
              <p className="font-heading font-bold text-foreground">Paşa Motor</p>
              <p className="text-xs text-muted-foreground">Yönetim Paneli</p>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.to, item.end)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 truncate">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-20 bg-card border-b border-border px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-foreground"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-heading font-semibold text-foreground">Yönetim</span>
          <Link to="/" className="text-xs text-muted-foreground">Siteye dön</Link>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
