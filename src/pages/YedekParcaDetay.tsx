import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Phone, MessageCircle, Package } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const YedekParcaDetay = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <section className="py-16 md:py-24 text-center">
          <div className="container mx-auto px-4">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h1 className="font-heading font-bold text-2xl text-foreground mb-4">Ürün bulunamadı</h1>
            <Link to="/yedek-parca" className="text-primary hover:underline">
              Yedek Parça sayfasına dön
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Link to="/yedek-parca" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Yedek Parçaya Dön
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div>
              <div className="rounded-xl overflow-hidden bg-muted aspect-square mb-4">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-muted-foreground/20" />
                  </div>
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                {product.brand}
              </span>
              <h1 className="font-heading font-bold text-2xl md:text-4xl text-foreground mb-4">
                {product.title}
              </h1>
              {product.price && (
                <p className="font-heading font-bold text-3xl gradient-text mb-6">
                  {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(product.price)}
                </p>
              )}
              {product.description && (
                <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
              )}
              {product.content && (
                <div className="prose prose-invert max-w-none mb-8 text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.content }} />
              )}

              <div className="flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/905348996817?text=${encodeURIComponent(`Merhaba, ${product.title} hakkında bilgi almak istiyorum.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all"
                  style={{ backgroundColor: "#25D366", color: "#fff" }}
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp ile Sorun
                </a>
                <a
                  href="tel:+905348996817"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Hemen Arayın
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default YedekParcaDetay;
