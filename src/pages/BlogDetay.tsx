import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import { sanitizeHtml } from "@/lib/sanitize";
import type { Tables } from "@/integrations/supabase/types";

type Post = Tables<"posts">;

const BlogDetay = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();
      setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout>
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-8" />
            <div className="h-10 bg-muted rounded w-3/4 mb-4" />
            <div className="h-4 bg-muted rounded w-1/3 mb-8" />
            <div className="h-64 bg-muted rounded-xl mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/5" />
            </div>
          </div>
        </article>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <section className="py-16 md:py-24 text-center">
          <div className="container mx-auto px-4">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h1 className="font-heading font-bold text-2xl text-foreground mb-4">Yazı bulunamadı</h1>
            <Link to="/blog" className="text-primary hover:underline">Blog sayfasına dön</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.meta_description || "",
    image: post.cover_image || "https://pasamotor.com.tr/favicon.png",
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://pasamotor.com.tr/blog/${post.slug}`,
    },
    author: {
      "@type": "Organization",
      name: "Paşa Motor",
      url: "https://pasamotor.com.tr",
    },
    publisher: {
      "@type": "Organization",
      name: "Paşa Motor",
      url: "https://pasamotor.com.tr",
      logo: {
        "@type": "ImageObject",
        url: "https://pasamotor.com.tr/favicon.png",
      },
    },
  };

  return (
    <Layout>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || `${post.title} — Paşa Motor blog yazısı.`}
        canonical={`/blog/${post.slug}`}
        image={post.cover_image || undefined}
        type="article"
        publishedTime={post.published_at || undefined}
        modifiedTime={post.updated_at}
      />
      <JsonLd data={articleSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />
      <article className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Blog'a Dön
          </Link>

          <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Calendar className="w-4 h-4" />
            {formatDate(post.published_at)}
          </div>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full rounded-xl mb-8 max-h-[500px] object-cover"
            />
          )}

          {post.content && (
            <div
              className="prose prose-invert prose-lg max-w-none text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_a]:text-primary"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            />
          )}
        </div>
      </article>
    </Layout>
  );
};

export default BlogDetay;
