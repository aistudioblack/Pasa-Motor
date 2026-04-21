import { ChevronRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/pasa-motor-logo.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Paşa Motor showroom"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, hsl(220 20% 7% / 0.55) 0%, hsl(220 20% 7% / 0.85) 60%, hsl(220 20% 7%) 100%)" }}
        />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          {/* Left text */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              TVS • Hero • Falcon • Işıldar Yetkili Servis Bayi
            </div>

            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 animate-fade-in text-foreground" style={{ animationDelay: "0.1s" }}>
              İstanbul'un Güvenilir{" "}
              <span className="gradient-text">Motosiklet</span>{" "}
              Yetkili Servis Bayi
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Fatih'te 4 markanın yetkili satış ve servis noktası. Motosiklet satışı, profesyonel servis ve orijinal yedek parça hizmetleri.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all glow-red"
              >
                Bize Ulaşın
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+902125868598"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass text-foreground font-semibold text-sm hover:bg-muted/50 transition-all"
              >
                <Phone className="w-4 h-4" />
                Hemen Arayın
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {[
                { value: "4", label: "Yetkili Marka" },
                { value: "20+", label: "Yıllık Deneyim" },
                { value: "1000+", label: "Mutlu Müşteri" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading font-bold text-2xl md:text-3xl gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Animated Logo (transparent, tornado loop every 5 min) */}
          <div className="hidden lg:flex items-center justify-center relative min-h-[480px]">
            <div className="relative animate-logo-hero">
              <img
                src={logo}
                alt="Paşa Motor logosu"
                width={520}
                height={520}
                className="relative w-full max-w-md drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex justify-center mt-12">
          <div className="relative animate-logo-hero">
            <img src={logo} alt="Paşa Motor logosu" width={260} height={260} className="w-56 h-auto drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
