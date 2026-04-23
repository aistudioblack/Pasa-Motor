import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import JsonLd from "@/components/seo/JsonLd";

type Post = Tables<"posts">;

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Paşa Motor Blog",
    url: "https://pasamotor.com.tr/blog",
    publisher: { "@type": "Organization", name: "Paşa Motor" },
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://pasamotor.com.tr/blog/${p.slug}`,
      datePublished: p.published_at,
      image: p.cover_image || undefined,
    })),
  };

  return (
    <Layout>
      <SEO
        title="Blog — Motosiklet Bakım İpuçları ve Sektör Haberleri"
        description="Paşa Motor blog: motosiklet bakım rehberleri, TVS, Hero, Falcon, Işıldar model incelemeleri, periyodik bakım ipuçları ve sektör haberleri."
        canonical="/blog"
        keywords="motosiklet blog, motor bakım ipuçları, motosiklet rehber, tvs hero falcon ışıldar"
      />
      <JsonLd data={blogSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Motosiklet bakım ipuçları, sektörel haberler ve Paşa Motor'dan güncel paylaşımlar.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-card rounded-xl overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="glass-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300"
                >
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.published_at)}
                    </div>
                    <h2 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium">
                      Devamını Oku
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg mb-2">Henüz blog yazısı yayınlanmadı</p>
              <p className="text-sm text-muted-foreground">Yakında motosiklet bakım ipuçları ve haberler burada olacak.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
