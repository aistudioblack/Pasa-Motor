import { ShoppingBag, Wrench, Package } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: ShoppingBag,
    title: "Motosiklet Satışı",
    description: "TVS, Hero, Falcon ve Işıldar markalarının en yeni modellerini showroom'umuzda keşfedin. Uygun fiyat ve taksit seçenekleri.",
    link: "/hizmetler",
  },
  {
    icon: Wrench,
    title: "Servis & Bakım",
    description: "Uzman teknisyenlerimiz ile periyodik bakım, motor tamiri, elektrik arızası ve genel onarım hizmetleri sunuyoruz.",
    link: "/hizmetler",
  },
  {
    icon: Package,
    title: "Yedek Parça",
    description: "Orijinal ve muadil yedek parçalar geniş stoğumuzda. Hızlı temin, uygun fiyat garantisi.",
    link: "/hizmetler",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-3">
            Hizmetlerimiz
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Motosiklet satışından servise, yedek parçadan aksesuara kadar tüm ihtiyaçlarınız için buradayız.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.link}
              className="glass-card rounded-xl p-6 md:p-8 group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
