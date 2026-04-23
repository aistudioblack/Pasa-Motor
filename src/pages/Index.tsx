import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import BrandsSection from "@/components/home/BrandsSection";
import ServicesSection from "@/components/home/ServicesSection";
import FAQ from "@/components/home/FAQ";
import CTASection from "@/components/home/CTASection";
import JsonLd, { motorcycleDealerSchema } from "@/components/seo/JsonLd";
import SEO from "@/components/seo/SEO";

const Index = () => {
  return (
    <Layout>
      <SEO
        title="Paşa Motor • İstanbul Fatih Motosiklet Yetkili Servis Bayi | TVS, Hero, Falcon, Işıldar"
        description="Paşa Motor — İstanbul Fatih'te TVS, Hero, Falcon ve Işıldar yetkili servis bayi. 20+ yıllık deneyim ile motosiklet satış, profesyonel servis ve orijinal yedek parça. ☎ 0212 586 85 98"
        canonical="/"
        keywords="paşa motor, motosiklet İstanbul, fatih motosiklet, tvs yetkili servis, hero yetkili servis, falcon yetkili servis, ışıldar yetkili servis, motosiklet servis fatih, yedek parça istanbul, kocamustafapaşa motosiklet"
      />
      <JsonLd data={motorcycleDealerSchema} />
      <HeroSection />
      <BrandsSection />
      <ServicesSection />
      <FAQ />
      <CTASection />
    </Layout>
  );
};

export default Index;
