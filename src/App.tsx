import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PeermallProvider } from "@/contexts/PeermallContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { SessionWarning } from "./components/SessionWarning";

import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

// Main Layout & Pages
import MainLayout from "@/components/layout/MainLayout";
import MainPage from "@/pages/main/MainPage";
import PeermallListMain from "@/pages/main/peermalls/PeermallList";

// User Peermall Layout & Pages
import UserPeermallPage from "@/pages/user-peermall/UserPeermallPage";
import UserPeermallHome from "@/pages/user-peermall/UserPeermallHome";

// Shared Pages (used by both main and user peermalls)
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
    <BrowserRouter>
      <AuthProvider>
        <PeermallProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <SessionWarning />
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              
              {/* Main Routes */}
              <Route path="/" element={<MainLayout><MainPage /></MainLayout>} />
              <Route path="/peermalls/new" element={<MainLayout><NewPeermalls /></MainLayout>} />
              <Route path="/peermalls/best" element={<MainLayout><BestPeermalls /></MainLayout>} />
              <Route path="/products" element={<MainLayout><ProductList /></MainLayout>} />
              <Route path="/products/new" element={<MainLayout><NewProducts /></MainLayout>} />
              <Route path="/products/best" element={<MainLayout><BestProducts /></MainLayout>} />
              <Route path="/products/create" element={<ProtectedRoute><MainLayout><ProductCreate /></MainLayout></ProtectedRoute>} />
              <Route path="/products/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
              <Route path="/community" element={<MainLayout><Community /></MainLayout>} />
              <Route path="/community/create" element={<ProtectedRoute><MainLayout><BoardCreate /></MainLayout></ProtectedRoute>} />
              <Route path="/community/:id" element={<MainLayout><BoardDetail /></MainLayout>} />
              <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
              <Route path="/events/create" element={<ProtectedRoute><MainLayout><EventCreate /></MainLayout></ProtectedRoute>} />
              <Route path="/events/:id" element={<MainLayout><EventDetail /></MainLayout>} />
              
              {/* Peermall List and Creation */}
              <Route path="/peermalls" element={<MainLayout><PeermallListMain /></MainLayout>} />
              <Route path="/peermalls/create" element={<ProtectedRoute><MainLayout><PeermallCreate /></MainLayout></ProtectedRoute>} />
              
              {/* User Peermall Routes */}
              <Route path="/home/:url" element={<UserPeermallPage />}>
                <Route index element={<UserPeermallHome />} />
                {/* TODO: Add other peermall routes like products, community, events when they are created */}
              </Route>

              {/* MyPage Routes - 로그인 필요 */}
              <Route 
                path="/mypage" 
                element={
                  <ProtectedRoute>
                    <MainLayout><MyPage /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mypage/info" 
                element={
                  <ProtectedRoute>
                    <MainLayout><MyInfo /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mypage/mall" 
                element={
                  <ProtectedRoute>
                    <MainLayout><MyMall /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mypage/mall-info" 
                element={
                  <ProtectedRoute>
                    <MainLayout><MyMallInfo /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mypage/posts" 
                element={
                  <ProtectedRoute>
                    <MainLayout><MyPosts /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mypage/products" 
                element={
                  <ProtectedRoute>
                    <MainLayout><MyProducts /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mypage/reviews" 
                element={
                  <ProtectedRoute>
                    <MainLayout><MyReviews /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* QR Code - 로그인 필요 */}
              <Route 
                path="/qr" 
                element={
                  <ProtectedRoute>
                    <MainLayout><QRCode /></MainLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </PeermallProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
