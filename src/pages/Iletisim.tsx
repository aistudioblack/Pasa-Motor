import Layout from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Iletisim = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Mesajınız alındı!", description: "En kısa sürede size dönüş yapacağız." });
    setForm({ name: "", phone: "", subject: "", message: "" });
  };

  return (
    <Layout>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">İletişim</h1>
            <p className="text-lg text-muted-foreground">Bize ulaşmak için aşağıdaki kanalları kullanabilirsiniz.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6">
                <h2 className="font-heading font-semibold text-lg text-foreground mb-4">İletişim Bilgileri</h2>
                <div className="space-y-4">
                  <a href="tel:+902125868598" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground font-medium">Telefon</p>
                      <p className="text-sm">0212 586 85 98</p>
                    </div>
                  </a>
                  <a href="tel:+905348996817" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground font-medium">GSM (Nihat KAN)</p>
                      <p className="text-sm">0534 899 68 17</p>
                    </div>
                  </a>
                  <a href="mailto:pasamotor@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground font-medium">E-posta</p>
                      <p className="text-sm">pasamotor@gmail.com</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground font-medium">Adres</p>
                      <p className="text-sm">Kızılelma Cad. No:66/A K.M.Paşa - Fatih/İST.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground font-medium">Çalışma Saatleri</p>
                      <p className="text-sm">Hİ: 09:00-19:00 | Cmt: 09:00-17:00 | Paz: Kapalı</p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/905348996817?text=Merhaba%2C%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{ backgroundColor: "#25D366", color: "#fff" }}
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp ile İletişime Geçin
              </a>

              {/* Google Maps */}
              <div className="rounded-xl overflow-hidden h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.5!2d28.926!3d41.008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzMwLjYiTiAyOMKwNTUnMzMuNiJF!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Paşa Motor Konum"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card rounded-xl p-6 md:p-8">
              <h2 className="font-heading font-semibold text-lg text-foreground mb-6">Bize Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Ad Soyad</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Telefon</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="05XX XXX XX XX"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Konu</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Mesaj konusu"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Mesajınız</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Mesajınızı yazın..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Gönder
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Iletisim;
