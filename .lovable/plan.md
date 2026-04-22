

# Plan: Admin yeniden oluşturma, animasyon galerisi, güvenlik & Vercel SPA fix

## 1. Admin hesabını yeniden oluştur + giriş güvenliği

- **Yeni admin kullanıcısı** oluşturulacak (Lovable Cloud Auth üzerinden, e-posta + şifre).
  - E-posta ve şifreyi sizden alacağım (aşağıda soru var).
  - `handle_new_user_role` trigger'ı zaten ilk kullanıcıyı otomatik `admin` yapıyor — silinen kullanıcı sonrası tablo boş kalmışsa yeni hesap admin olur. Tablo boş değilse manuel olarak `user_roles` tablosuna `admin` rolü eklenecek.
- **AdminLogin.tsx** güncellemeleri:
  - "Beni hatırla" checkbox eklenecek. İşaretli değilse `localStorage` yerine `sessionStorage` kullanılacak (sekme kapanınca çıkış).
  - Placeholder e-postası (`admin@pasamotor.com.tr`) kaldırılacak — sadece nötr `ornek@site.com` veya boş bırakılacak (bilgi sızıntısı önlemi).
  - Hata mesajları zaten genel ("E-posta veya şifre hatalı") — korunacak.

## 2. Şifre değiştirme (admin panel içi)

- Admin layout'a yeni route: `/admin/ayarlar` → `AdminSettings.tsx`.
  - Mevcut şifre + yeni şifre + yeni şifre tekrarı formu.
  - `supabase.auth.updateUser({ password })` ile değiştirilecek.
  - Min 8 karakter, büyük/küçük/rakam zorunluluğu (client-side hint, server zaten HIBP kontrolü için ayrıca tetiklenebilir).
- Header/sidebar'a "Ayarlar" linki eklenecek.

## 3. 20 logo animasyonu galerisi + admin'de seçim

- **`src/lib/logoAnimations.ts`**: 20 animasyonun listesi (id, isim, açıklama, CSS class, süre).
  Örnekler:
  1. Tornado (mevcut), 2. Heartbeat, 3. Bounce-from-box, 4. Flip-3D, 5. Pulse-glow, 6. Spin-slow, 7. Wobble, 8. Shake, 9. Zoom-pop, 10. Rotate-Y, 11. Swing, 12. Rubber-band, 13. Jello, 14. Tada, 15. Flash, 16. Roll-in, 17. Bounce-in-down, 18. Light-speed, 19. Hinge, 20. Magnetic-float.
- **`src/index.css`**: 20 `@keyframes` ve `.animate-logo-*` utility class.
- **`AdminAnimations.tsx`** yeni sayfa (`/admin/animasyonlar`):
  - Grid (4 kolon) — her kart logoyu o animasyonla çalıştırır (hover veya "Önizle" butonu ile tetik).
  - "Bunu Uygula" butonu → seçimi `site_content` tablosuna `page_key='hero_animation'` olarak kaydeder (`{ animation_id: '...' }` JSON).
- **HeroSection.tsx**: Mount'ta `site_content`'ten seçili animasyon ID'sini çeker ve `ANIM_CLASS` olarak kullanır. Sayfa yenilemede ve 5 dakikada bir tetiklenir (mevcut mantık korunur).
- Seçilen animasyon işaretli (badge) görünür; varsayılan: tornado.

## 4. Vercel SPA 404 düzeltmesi

- Proje kökünde **`vercel.json`** oluşturulacak:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- Bu, `/hakkimizda`, `/blog/...`, `/yedek-parca/...` gibi tüm derin linklerin React Router'a düşmesini sağlar.
- Ek olarak `headers` bölümünde güvenlik başlıkları (CSP, X-Frame-Options, Referrer-Policy) tanımlanacak.

## 5. Teknik notlar

- Admin oluşturma: Auth tools (`auth_create_user`) ile sunucu tarafında, e-posta doğrulaması atlanarak (`email_confirmed_at` set) — anında giriş yapılabilir.
- `user_roles` kontrolü: Hesap oluştuktan sonra rolün gerçekten 'admin' olduğunu doğrulamak için `supabase--read_query` çalıştırılacak; değilse INSERT ile düzeltilecek.
- `site_content` tablosunda zaten `page_key` ve `sections` (jsonb) alanları mevcut — şema değişikliği gerekmiyor.
- Animasyonlar GPU-friendly transform/opacity tabanlı yazılacak (`will-change`, `transform-origin`).
- `prefers-reduced-motion` desteği korunur.

## Dosya değişiklikleri özeti

**Yeni:** `src/lib/logoAnimations.ts`, `src/pages/admin/AdminSettings.tsx`, `src/pages/admin/AdminAnimations.tsx`, `vercel.json`
**Düzenlenen:** `src/pages/admin/AdminLogin.tsx`, `src/components/home/HeroSection.tsx`, `src/components/admin/AdminLayout.tsx`, `src/App.tsx`, `src/index.css`

## Sizden ihtiyacım olanlar

<lov-questions>
<lov-question header="Admin e-posta">
Yeni admin hesabı için kullanmak istediğiniz e-posta adresi nedir?
<lov-option>pasamotor@gmail.com</lov-option>
<lov-option>admin@pasamotor.com.tr</lov-option>
<lov-option>Diğer (chat'te yazacağım)</lov-option>
</lov-questions>

<lov-question header="Admin şifre">
Şifreyi nasıl belirleyelim?
<lov-option>Ben chat'te yazacağım (önerilen)</lov-option>
<lov-option>Güçlü rastgele şifre üret ve bana göster</lov-option>
</lov-questions>

<lov-question header="Login placeholder">
E-posta input placeholder'ı ne olsun (güvenlik için gerçek admin maili gizlenecek)?
<lov-option>"E-posta adresiniz" (etiket metni)</lov-option>
<lov-option>Boş bırak</lov-option>
<lov-option>"ornek@site.com"</lov-option>
</lov-questions>

