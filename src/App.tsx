import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";

// Peermall pages
import PeermallList from "./pages/peermalls/PeermallList";
import PeermallDetail from "./pages/peermalls/PeermallDetail";
import PeermallCreate from "./pages/peermalls/PeermallCreate";
import NewPeermalls from "./pages/peermalls/NewPeermalls";
import BestPeermalls from "./pages/peermalls/BestPeermalls";

// Product pages
import ProductList from "./pages/products/ProductList";
import ProductDetail from "./pages/products/ProductDetail";
import ProductCreate from "./pages/products/ProductCreate";
import NewProducts from "./pages/products/NewProducts";
import BestProducts from "./pages/products/BestProducts";

// Community pages
import Community from "./pages/community/Community";
import BoardCreate from "./pages/community/BoardCreate";
import BoardDetail from "./pages/community/BoardDetail";

// Event pages
import Events from "./pages/events/Events";
import EventCreate from "./pages/events/EventCreate";
import EventDetail from "./pages/events/EventDetail";

// My pages
import MyInfo from "./pages/mypage/MyInfo";
import MyPage from "./pages/mypage/MyPage";
import MyMall from "./pages/mypage/MyMall";
import MyMallInfo from "./pages/mypage/MyMallInfo";
import MyPosts from "./pages/mypage/MyPosts";
import MyProducts from "./pages/mypage/MyProducts";
import MyReviews from "./pages/mypage/MyReviews";

// QR Code
import QRCode from "./pages/QRCode";

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
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Peermall Routes */}
          <Route path="/peermalls" element={<ProtectedRoute><Layout><PeermallList /></Layout></ProtectedRoute>} />
          <Route path="/peermalls/new" element={<ProtectedRoute><Layout><NewPeermalls /></Layout></ProtectedRoute>} />
          <Route path="/peermalls/best" element={<ProtectedRoute><Layout><BestPeermalls /></Layout></ProtectedRoute>} />
          <Route path="/peermalls/create" element={<ProtectedRoute><Layout><PeermallCreate /></Layout></ProtectedRoute>} />
          <Route path="/peermalls/:id" element={<ProtectedRoute><Layout><PeermallDetail /></Layout></ProtectedRoute>} />
          
          {/* Product Routes */}
          <Route path="/products" element={<ProtectedRoute><Layout><ProductList /></Layout></ProtectedRoute>} />
          <Route path="/products/new" element={<ProtectedRoute><Layout><NewProducts /></Layout></ProtectedRoute>} />
          <Route path="/products/best" element={<ProtectedRoute><Layout><BestProducts /></Layout></ProtectedRoute>} />
          <Route path="/products/create" element={<ProtectedRoute><Layout><ProductCreate /></Layout></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><Layout><ProductDetail /></Layout></ProtectedRoute>} />
          
          {/* Community Routes */}
          <Route path="/community" element={<ProtectedRoute><Layout><Community /></Layout></ProtectedRoute>} />
          <Route path="/community/create" element={<ProtectedRoute><Layout><BoardCreate /></Layout></ProtectedRoute>} />
          <Route path="/community/:id" element={<ProtectedRoute><Layout><BoardDetail /></Layout></ProtectedRoute>} />
          
          {/* Event Routes */}
          <Route path="/events" element={<ProtectedRoute><Layout><Events /></Layout></ProtectedRoute>} />
          <Route path="/events/create" element={<ProtectedRoute><Layout><EventCreate /></Layout></ProtectedRoute>} />
          <Route path="/events/:id" element={<ProtectedRoute><Layout><EventDetail /></Layout></ProtectedRoute>} />
          
          {/* My Page Routes */}
          <Route path="/mypage" element={<ProtectedRoute><Layout><MyPage /></Layout></ProtectedRoute>} />
          <Route path="/mypage/info" element={<ProtectedRoute><Layout><MyInfo /></Layout></ProtectedRoute>} />
          <Route path="/mypage/mall" element={<ProtectedRoute><Layout><MyMall /></Layout></ProtectedRoute>} />
          <Route path="/mypage/mall-info" element={<ProtectedRoute><Layout><MyMallInfo /></Layout></ProtectedRoute>} />
          <Route path="/mypage/posts" element={<ProtectedRoute><Layout><MyPosts /></Layout></ProtectedRoute>} />
          <Route path="/mypage/products" element={<ProtectedRoute><Layout><MyProducts /></Layout></ProtectedRoute>} />
          <Route path="/mypage/reviews" element={<ProtectedRoute><Layout><MyReviews /></Layout></ProtectedRoute>} />
          
          {/* QR Code */}
          <Route path="/qr" element={<ProtectedRoute><Layout><QRCode /></Layout></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
