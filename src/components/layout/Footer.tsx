import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-xl text-foreground mb-3">Paşa Motor</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              İstanbul Fatih'te TVS, Hero, Falcon ve Işıldar yetkili bayii. Motosiklet satış, servis ve yedek parça hizmetleri.
            </p>
            <div className="flex gap-2">
              {["TVS", "Hero", "Falcon", "Işıldar"].map((brand) => (
                <span key={brand} className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Hızlı Bağlantılar</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Ana Sayfa", path: "/" },
                { label: "Hakkımızda", path: "/hakkimizda" },
                { label: "Hizmetler", path: "/hizmetler" },
                { label: "Galeri", path: "/galeri" },
                { label: "İletişim", path: "/iletisim" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">İletişim</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+902125868598" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                0212 586 85 98
              </a>
              <a href="tel:+905348996817" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                0534 899 68 17
              </a>
              <a href="mailto:pasamotor@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                pasamotor@gmail.com
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Kızılelma Cad. No:66/A K.M.Paşa - Fatih/İST.</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Çalışma Saatleri</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-foreground">Pazartesi - Cuma</p>
                  <p className="text-muted-foreground">09:00 - 19:00</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-foreground">Cumartesi</p>
                  <p className="text-muted-foreground">09:00 - 17:00</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-foreground">Pazar</p>
                  <p className="text-destructive">Kapalı</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Paşa Motor. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-muted-foreground">
            Yetkili: Nihat KAN
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
