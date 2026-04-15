import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import BrandsSection from "@/components/home/BrandsSection";
import ServicesSection from "@/components/home/ServicesSection";
import FAQ from "@/components/home/FAQ";
import CTASection from "@/components/home/CTASection";
import JsonLd, { motorcycleDealerSchema } from "@/components/seo/JsonLd";

const Index = () => {
  return (
    <Layout>
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
