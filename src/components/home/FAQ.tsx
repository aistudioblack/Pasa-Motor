import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import JsonLd from "@/components/seo/JsonLd";

const faqs = [
  {
    question: "Paşa Motor hangi markaların yetkili bayisidir?",
    answer: "Paşa Motor, TVS, Hero, Falcon ve Işıldar markalarının İstanbul Fatih bölgesindeki yetkili satış ve servis bayisidir.",
  },
  {
    question: "Motosiklet servis ve bakım hizmeti veriyor musunuz?",
    answer: "Evet, uzman teknisyenlerimiz ile periyodik bakım, motor tamiri, elektrik arızaları ve genel onarım dahil tüm servis hizmetlerini sunuyoruz.",
  },
  {
    question: "Yedek parça stoğunuz var mı?",
    answer: "Geniş orijinal ve muadil yedek parça stoğumuz mevcuttur. Stoğumuzda bulunmayan parçaları kısa sürede temin edebiliyoruz.",
  },
  {
    question: "Çalışma saatleriniz nedir?",
    answer: "Hafta içi 09:00 - 19:00, Cumartesi 09:00 - 17:00 arası hizmet veriyoruz. Pazar günleri kapalıyız.",
  },
  {
    question: "Taksitli ödeme seçeneğiniz var mı?",
    answer: "Evet, motosiklet alımlarında kredi kartına taksit ve banka kredisi seçenekleri sunuyoruz. Detaylı bilgi için bizi arayabilirsiniz.",
  },
  {
    question: "Adresiniz nerede?",
    answer: "Showroom ve servisimiz Kızılelma Cad. No:66/A K.M.Paşa - Fatih/İstanbul adresindedir.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const FAQ = () => {
  return (
    <section className="py-16 md:py-24 border-t border-border">
      <JsonLd data={faqSchema} />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-3">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-muted-foreground">
              Merak ettiğiniz soruların cevaplarını burada bulabilirsiniz.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="glass-card rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="text-left font-heading font-medium text-foreground hover:text-primary hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
