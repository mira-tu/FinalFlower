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

import { cartAPI } from './config/api';

function AppContent() {
  const location = useLocation();
  const isAuthRoute = ['/login', '/signup'].includes(location.pathname);
  const showNavbar = !isAuthRoute;
  const [user, setUser] = useState(null);
  const isLoggedIn = !!user;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentUser = localStorage.getItem('currentUser');
    if (token && currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart'); // Optional: clear cart on logout
    setUser(null);
    setCart([]); // Clear cart state
    navigate('/login');
  };

  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    } else {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, [isLoggedIn]);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get();
      if (response.data.success) {
        const apiItems = response.data.cart.items.map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.name,
          price: parseFloat(item.price),
          image: item.image_url,
          qty: item.quantity,
          stock: item.stock_quantity
        }));
        setCart(apiItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  const addToCart = async (name, price, image, productId) => {
    if (isLoggedIn) {
      try {
        await cartAPI.add({ product_id: productId, quantity: 1 });
        await fetchCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert(error.response?.data?.message || 'Failed to add to cart');
      }
    } else {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => (productId && item.productId === productId) || item.name === name);
        if (existingItem) {
          return prevCart.map(item =>
            ((productId && item.productId === productId) || item.name === name)
              ? { ...item, qty: (item.qty || 0) + 1 }
              : item
          );
        } else {
          return [...prevCart, { name, price, image, qty: 1, productId }];
        }
      });
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (isLoggedIn) {
      try {
        await cartAPI.update(itemId, { quantity });
        await fetchCart();
      } catch (error) {
        console.error('Error updating cart:', error);
        alert('Failed to update cart');
      }
    } else {
      setCart(prevCart => prevCart.map(item =>
        (item.id === itemId || item.productId === itemId) ? { ...item, qty: quantity } : item
      ));
    }
  };

  const removeFromCart = async (itemId) => {
    if (isLoggedIn) {
      try {
        await cartAPI.delete(itemId);
        await fetchCart();
      } catch (error) {
        console.error('Error removing from cart:', error);
        alert('Failed to remove item');
      }
    } else {
      setCart(prevCart => prevCart.filter(item => item.id !== itemId && item.productId !== itemId));
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + (item.qty || 0), 0);

  return (
    <>
      {showNavbar && (
        <Navbar cartCount={cartCount} user={user} logout={logout} />
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Wishlist cart={cart} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} updateCartItem={updateCartItem} removeFromCart={removeFromCart} />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/book-event" element={<BookEvent />} />
        <Route path="/customized" element={<Customized addToCart={addToCart} />} />
        <Route path="/special-order" element={<SpecialOrder />} />
        <Route path="/product/:productId" element={<ProductDetail addToCart={addToCart} />} />
        <Route path="/checkout" element={<Checkout setCart={setCart} user={user} />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
        <Route path="/profile" element={<Profile user={user} logout={logout} />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/events" element={<div className="container py-5"><h2>Events Page</h2></div>} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>

      {showNavbar && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
