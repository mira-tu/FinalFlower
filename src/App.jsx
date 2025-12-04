import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Customized from './pages/Customized'
import BookEvent from './pages/BookEvent'
import SpecialOrder from './pages/SpecialOrder'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import OrderTracking from './pages/OrderTracking'
import Profile from './pages/Profile'
import MyOrders from './pages/MyOrders'
import Notifications from './pages/Notifications'
import AdminDashboard from './pages/AdminDashboard'
import AdminSyncWrapper from './components/AdminSyncWrapper'

function AppContent() {
  const location = useLocation();
  const isAuthRoute = ['/login', '/signup'].includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith('/admin');
  const showNavbar = !isAuthRoute && !isAdminRoute;

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });


  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (name, price, image) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === name);
      if (existingItem) {
        return prevCart.map(item =>
          item.name === name ? { ...item, qty: (item.qty || 0) + 1 } : item
        );
      } else {
        return [...prevCart, { name, price, image, qty: 1 }];
      }
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + (item.qty || 0), 0);

return (
  <>
    {showNavbar && (
      <Navbar cartCount={cartCount} />
    )}

    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home addToCart={addToCart} />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/wishlist" element={<Wishlist cart={cart} setCart={setCart} />} />
      <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/book-event" element={<BookEvent />} />
      <Route path="/customized" element={<Customized addToCart={addToCart} />} />
      <Route path="/special-order" element={<SpecialOrder />} />
      <Route path="/product/:productId" element={<ProductDetail addToCart={addToCart} />} />
      <Route path="/checkout" element={<Checkout setCart={setCart} />} />
      <Route path="/order-success/:orderId" element={<OrderSuccess />} />
      <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/events" element={<div className="container py-5"><h2>Events Page</h2></div>} />
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>

    {showNavbar && <Footer />}
  </>
);
}

function App() {
  // Set your API endpoint here or use environment variable
  const API_ENDPOINT = import.meta.env.VITE_API_URL || 'https://your-api.com/api';
  
  return (
    <AdminSyncWrapper apiEndpoint={API_ENDPOINT}>
      <Router>
        <AppContent />
      </Router>
    </AdminSyncWrapper>
  )
}

export default App
