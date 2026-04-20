import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Hakkimizda from "./pages/Hakkimizda.tsx";
import Hizmetler from "./pages/Hizmetler.tsx";
import Galeri from "./pages/Galeri.tsx";
import Iletisim from "./pages/Iletisim.tsx";
import YedekParca from "./pages/YedekParca.tsx";
import YedekParcaDetay from "./pages/YedekParcaDetay.tsx";
import Blog from "./pages/Blog.tsx";
import BlogDetay from "./pages/BlogDetay.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminPosts from "./pages/admin/AdminPosts.tsx";
import AdminMessages from "./pages/admin/AdminMessages.tsx";
import AdminGallery from "./pages/admin/AdminGallery.tsx";
import AdminFAQ from "./pages/admin/AdminFAQ.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hakkimizda" element={<Hakkimizda />} />
          <Route path="/hizmetler" element={<Hizmetler />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/iletisim" element={<Iletisim />} />
          <Route path="/yedek-parca" element={<YedekParca />} />
          <Route path="/yedek-parca/:slug" element={<YedekParcaDetay />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetay />} />
          <Route path="/admin/giris" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/urunler" element={<AdminProducts />} />
          <Route path="/admin/blog" element={<AdminPosts />} />
          <Route path="/admin/mesajlar" element={<AdminMessages />} />
          <Route path="/admin/galeri" element={<AdminGallery />} />
          <Route path="/admin/faq" element={<AdminFAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
