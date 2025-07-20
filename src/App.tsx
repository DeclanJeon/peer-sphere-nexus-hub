// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";

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
import { SessionWarning } from "./components/SessionWarning";

// QueryClient 설정 개선
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SessionWarning /> {/* 추가 */}
          <Routes>
            {/* Public Route - 로그인 페이지 */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* Public Routes - 누구나 접근 가능 */}
            <Route path="/" element={<Layout><Main /></Layout>} />
            <Route path="/peermalls" element={<Layout><PeermallList /></Layout>} />
            <Route path="/peermalls/new" element={<Layout><NewPeermalls /></Layout>} />
            <Route path="/peermalls/best" element={<Layout><BestPeermalls /></Layout>} />
            <Route path="/peermall/:url" element={<Layout><PeermallDetail /></Layout>} />
            
            <Route path="/products" element={<Layout><ProductList /></Layout>} />
            <Route path="/products/new" element={<Layout><NewProducts /></Layout>} />
            <Route path="/products/best" element={<Layout><BestProducts /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
            
            <Route path="/community" element={<Layout><Community /></Layout>} />
            <Route path="/community/:id" element={<Layout><BoardDetail /></Layout>} />
            
            <Route path="/events" element={<Layout><Events /></Layout>} />
            <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
            
            {/* Protected Routes - 로그인 필요 */}
            <Route 
              path="/peermalls/create" 
              element={
                <ProtectedRoute>
                  <Layout><PeermallCreate /></Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/products/create" 
              element={
                <ProtectedRoute>
                  <Layout><ProductCreate /></Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/community/create" 
              element={
                <ProtectedRoute>
                  <Layout><BoardCreate /></Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/events/create" 
              element={
                <ProtectedRoute>
                  <Layout><EventCreate /></Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* My Page Routes - 모두 로그인 필요 */}
            <Route 
              path="/mypage" 
              element={
                <ProtectedRoute>
                  <Layout><MyPage /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mypage/info" 
              element={
                <ProtectedRoute>
                  <Layout><MyInfo /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mypage/mall" 
              element={
                <ProtectedRoute>
                  <Layout><MyMall /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mypage/mall-info" 
              element={
                <ProtectedRoute>
                  <Layout><MyMallInfo /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mypage/posts" 
              element={
                <ProtectedRoute>
                  <Layout><MyPosts /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mypage/products" 
              element={
                <ProtectedRoute>
                  <Layout><MyProducts /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/mypage/reviews" 
              element={
                <ProtectedRoute>
                  <Layout><MyReviews /></Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* QR Code - 로그인 필요 */}
            <Route 
              path="/qr" 
              element={
                <ProtectedRoute>
                  <Layout><QRCode /></Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
