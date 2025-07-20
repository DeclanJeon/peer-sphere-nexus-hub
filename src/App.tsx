import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Main from "@/pages/Main";
import Layout from "@/components/Layout";
import NotFound from "@/pages/NotFound";

// Peermall pages
import PeermallList from "@/pages/peermalls/PeermallList";
import PeermallDetail from "@/pages/peermalls/PeermallDetail";
import PeermallCreate from "@/pages/peermalls/PeermallCreate";
import NewPeermalls from "@/pages/peermalls/NewPeermalls";
import BestPeermalls from "@/pages/peermalls/BestPeermalls";

// Product pages
import ProductList from "@/pages/products/ProductList";
import ProductDetail from "@/pages/products/ProductDetail";
import ProductCreate from "@/pages/products/ProductCreate";
import NewProducts from "@/pages/products/NewProducts";
import BestProducts from "@/pages/products/BestProducts";

// Community pages
import Community from "@/pages/community/Community";
import BoardCreate from "@/pages/community/BoardCreate";
import BoardDetail from "@/pages/community/BoardDetail";

// Event pages
import Events from "@/pages/events/Events";
import EventCreate from "@/pages/events/EventCreate";
import EventDetail from "@/pages/events/EventDetail";

// My pages
import MyInfo from "@/pages/mypage/MyInfo";
import MyPage from "@/pages/mypage/MyPage";
import MyMall from "@/pages/mypage/MyMall";
import MyMallInfo from "@/pages/mypage/MyMallInfo";
import MyPosts from "@/pages/mypage/MyPosts";
import MyProducts from "@/pages/mypage/MyProducts";
import MyReviews from "@/pages/mypage/MyReviews";

// QR Code
import QRCode from "@/pages/QRCode";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <Layout>
              <Main />
            </Layout>
          } />
          
          {/* Peermall Routes */}
          <Route path="/peermalls" element={<Layout><PeermallList /></Layout>} />
          <Route path="/peermalls/new" element={<Layout><NewPeermalls /></Layout>} />
          <Route path="/peermalls/best" element={<Layout><BestPeermalls /></Layout>} />
          <Route path="/peermalls/create" element={<Layout><PeermallCreate /></Layout>} />
          <Route path="/peermall/:url" element={<Layout><PeermallDetail /></Layout>} />
          
          {/* Product Routes */}
          <Route path="/products" element={<Layout><ProductList /></Layout>} />
          <Route path="/products/new" element={<Layout><NewProducts /></Layout>} />
          <Route path="/products/best" element={<Layout><BestProducts /></Layout>} />
          <Route path="/products/create" element={<Layout><ProductCreate /></Layout>} />
          <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
          
          {/* Community Routes */}
          <Route path="/community" element={<Layout><Community /></Layout>} />
          <Route path="/community/create" element={<Layout><BoardCreate /></Layout>} />
          <Route path="/community/:id" element={<Layout><BoardDetail /></Layout>} />
          
          {/* Event Routes */}
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/events/create" element={<Layout><EventCreate /></Layout>} />
          <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
          
          {/* My Page Routes */}
          <Route path="/mypage" element={<Layout><MyPage /></Layout>} />
          <Route path="/mypage/info" element={<Layout><MyInfo /></Layout>} />
          <Route path="/mypage/mall" element={<Layout><MyMall /></Layout>} />
          <Route path="/mypage/mall-info" element={<Layout><MyMallInfo /></Layout>} />
          <Route path="/mypage/posts" element={<Layout><MyPosts /></Layout>} />
          <Route path="/mypage/products" element={<Layout><MyProducts /></Layout>} />
          <Route path="/mypage/reviews" element={<Layout><MyReviews /></Layout>} />
          
          {/* QR Code */}
          <Route path="/qr" element={<Layout><QRCode /></Layout>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
