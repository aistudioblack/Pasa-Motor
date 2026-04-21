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
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="Paşa Motor"
              className="h-11 md:h-14 w-auto drop-shadow-[0_4px_12px_hsl(0_85%_55%/0.35)] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden sm:block leading-tight">
              <span className="font-heading font-extrabold text-xl md:text-2xl block tracking-tight">
                <span className="bg-gradient-to-r from-primary via-amber-400 to-secondary bg-clip-text text-transparent">
                  PAŞA
                </span>{" "}
                <span className="text-foreground">MOTOR</span>
              </span>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
                Yetkili Servis Bayi
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+902125868598"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>0212 586 85 98</span>
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-foreground"
              aria-label="Menüyü aç"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden glass border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+902125868598"
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm"
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
