import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar, Footer } from './components';
import { Home, Login, Register, Restaurants, RestaurantDetail, Cart, Checkout, Orders } from './pages';
import './index.css';

// Protected route wrapper
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f6]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#fc8019] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#686b78] text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

// Layout with Navbar and Footer
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Auth pages without Navbar/Footer
function AuthLayout() {
  return <Outlet />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              {/* Auth routes (no navbar/footer) */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Main routes with layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurants/:id" element={<RestaurantDetail />} />
                <Route path="/cart" element={<Cart />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
