import Layout from "@/components/layout/Layout";
import { useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import serviceImg from "@/assets/service.jpg";

const images = [
  { src: heroBg, title: "Showroom", category: "showroom" },
  { src: serviceImg, title: "Servis Atölyesi", category: "servis" },
];

const categories = ["Tümü", "showroom", "servis"];

const Galeri = () => {
  const [active, setActive] = useState("Tümü");
  const filtered = active === "Tümü" ? images : images.filter((img) => img.category === active);

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">Galeri</h1>
            <p className="text-muted-foreground">Showroom ve servisimizden kareler</p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active === cat ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "Tümü" ? cat : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((img, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden aspect-video">
                <img src={img.src} alt={img.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="font-heading font-medium text-foreground">{img.title}</p>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">Bu kategoride henüz fotoğraf bulunmuyor.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Galeri;
