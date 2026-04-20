import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const brands = ["Tümü", "TVS", "Hero", "Falcon", "Işıldar"] as const;

const YedekParca = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBrand, setActiveBrand] = useState("Tümü");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase
        .from("products")
        .select("*")
        .eq("category", "yedek-parca")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (activeBrand !== "Tümü") {
        query = query.eq("brand", activeBrand);
      }

      if (search.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }

      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, [activeBrand, search]);

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">
              Yedek Parça
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              TVS, Hero, Falcon ve Işıldar motosikletleri için orijinal ve muadil yedek parçalar. Geniş stok ve hızlı temin.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Yedek parça ara..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setActiveBrand(brand)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeBrand === brand
                      ? "bg-primary text-primary-foreground"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                  <div className="w-full h-40 bg-muted rounded-lg mb-4" />
                  <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/yedek-parca/${product.slug}`}
                  className="glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300"
                >
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <Package className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="p-4">
                    <span className="text-xs font-medium text-primary mb-1 block">{product.brand}</span>
                    <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                    )}
                    {product.price && (
                      <p className="font-heading font-bold text-lg gradient-text">
                        {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(product.price)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg mb-2">Henüz yedek parça eklenmedi</p>
              <p className="text-sm text-muted-foreground">
                Yedek parça için bizi arayabilirsiniz:{" "}
                <a href="tel:+905348996817" className="text-primary hover:underline">
                  0534 899 68 17
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default YedekParca;
