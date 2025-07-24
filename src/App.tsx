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

// User Peermall Layout & Pages
import UserPeermallPage from "@/pages/user-peermall/UserPeermallPage";
import UserPeermallHome from "@/pages/user-peermall/UserPeermallHome";

// Shared Pages (used by both main and user peermalls)

// Community pages
import BoardDetail from "@/components/common/community/BoardDetail";

// My pages
import ManagePage from "@/pages/main/mypage/ManagePage";

// QR Code
import QRCode from "@/pages/QRCode";
import ProductPage from "@/pages/common/ProductPage";
import CommunityPage from "@/pages/common/CommunityPage";
import PeermallCreate from "@/components/common/peermall/PeermallCreate";
import PeermallPage from "@/pages/main/peermalls/PeermallPage";
import BoardCreate from "@/components/common/community/BoardCreate";
import EventDetail from "@/components/common/event/EventDetail";
import EventCreate from "@/components/common/event/EventCreate";
import EventPage from "@/pages/common/EventPage";
import ProductDetail from "./components/common/product/ProductDetail";
import { ProfileManagement } from "./components/admin/ProfileManagement";
import { PeermallManagement } from "./components/admin/PeermallManagement";
import { ProductManagement } from "./components/admin/ProductManagement";
import { CommunityManagement } from "./components/admin/CommunityManagement";
import { EventManagement } from "./components/admin/EventManagement";
import { OverviewSection } from "./components/admin/OverviewSection";
import { CommentManagement } from "./components/admin/CommentManagement";
import { ReviewManagement } from "./components/admin/ReviewManagement";

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
              <Route path="/peermalls" element={<MainLayout><PeermallPage /></MainLayout>} />
              <Route path="/peermalls/create" element={<ProtectedRoute><PeermallCreate /></ProtectedRoute>} />

              <Route path="/products" element={<MainLayout><ProductPage /></MainLayout>} />
              <Route path="/community" element={<MainLayout><CommunityPage /></MainLayout>} />
              <Route path="/events" element={<MainLayout><EventPage /></MainLayout>} />
              
              {/* User Peermall Routes */}
              <Route path="/home/:url" element={<UserPeermallPage />}>
                <Route index element={<UserPeermallHome />} />
                <Route path="products" element={<ProductPage />} />
                <Route path="product/:id" element={<ProductDetail />} />
                
                <Route path="community" element={<CommunityPage />} />
                <Route path="community/create" element={<ProtectedRoute><BoardCreate /></ProtectedRoute>} />
                <Route path="community/:id" element={<BoardDetail />} />
                <Route path="events" element={<EventPage />} />
                <Route path="event/create" element={<ProtectedRoute><EventCreate /></ProtectedRoute>} />
                <Route path="event/:id" element={<EventDetail />} />
              </Route>

              {/* MyPage Routes - 로그인 필요 */}
              <Route 
                path="/mypage/manage"
                element={
                  <ProtectedRoute>
                    <ManagePage />
                  </ProtectedRoute>
                }
              >
                <Route index element={<OverviewSection />} />
                <Route path="overview" element={<OverviewSection />} />
                <Route path="profile" element={<ProfileManagement />} />
                <Route path="peermall" element={<PeermallManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="community" element={<CommunityManagement />} />
                <Route path="events" element={<EventManagement />} />
                <Route path="comments" element={<CommentManagement />} />
                <Route path="reviews" element={<ReviewManagement />} />
              </Route>
              
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
