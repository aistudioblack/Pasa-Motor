import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/pasa-motor-logo.png";

const navLinks = [
  { label: "Ana Sayfa", path: "/" },
  { label: "Hakkımızda", path: "/hakkimizda" },
  { label: "Hizmetler", path: "/hizmetler" },
  { label: "Yedek Parça", path: "/yedek-parca" },
  { label: "Blog", path: "/blog" },
  { label: "Galeri", path: "/galeri" },
  { label: "İletişim", path: "/iletisim" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="Paşa Motor — Ana sayfa">
            <img
              src={logo}
              alt="Paşa Motor logosu"
              className="h-11 md:h-14 w-auto drop-shadow-[0_4px_12px_hsl(0_85%_55%/0.45)] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block leading-none">
              <span className="font-display tracking-[0.04em] text-2xl md:text-[1.7rem] block">
                <span className="text-primary">PAŞA</span>
                <span className="text-foreground"> MOTOR</span>
              </span>
              <span className="block mt-1 text-[10px] md:text-[11px] uppercase tracking-[0.28em] text-muted-foreground font-semibold">
                Yetkili Servis Bayi
              </span>
            </div>
          </Link>

          {/* Apple-style segmented nav */}
          <nav className="hidden lg:flex items-center" aria-label="Ana navigasyon">
            <div className="flex items-center gap-1 rounded-full bg-muted/40 backdrop-blur-md border border-border/50 px-1.5 py-1.5">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-tight transition-all duration-200 ${
                      active
                        ? "bg-primary text-primary-foreground shadow-[0_2px_10px_hsl(0_85%_55%/0.35)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:+902125868598"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-[13px] hover:bg-primary/90 transition-all shadow-[0_2px_12px_hsl(0_85%_55%/0.4)] hover:shadow-[0_4px_18px_hsl(0_85%_55%/0.55)]"
            >
              <Phone className="w-4 h-4" />
              <span>0212 586 85 98</span>
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-foreground rounded-full hover:bg-muted/50"
              aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden glass border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobil navigasyon">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+902125868598"
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
            >
              <Phone className="w-4 h-4" />
              0212 586 85 98
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
