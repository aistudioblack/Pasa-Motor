const brands = [
  { name: "TVS", desc: "Hindistan'ın lider motosiklet üreticisi" },
  { name: "Hero", desc: "Dünyanın en büyük iki tekerlekli araç üreticisi" },
  { name: "Falcon", desc: "Güvenilir ve ekonomik motosikletler" },
  { name: "Işıldar", desc: "Kaliteli Türk motosiklet markası" },
];

const BrandsSection = () => {
  return (
    <section className="py-16 md:py-20 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
            Yetkili Bayii Markalarımız
          </h2>
          <p className="text-muted-foreground">
            4 büyük markanın İstanbul Fatih yetkili satış ve servis noktası
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="glass-card rounded-xl p-6 md:p-8 text-center hover:scale-105 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <span className="font-heading font-bold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
                  {brand.name}
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">{brand.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
