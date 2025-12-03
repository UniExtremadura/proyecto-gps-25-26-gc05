import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { CartProvider } from './contexts/CartContext';
import Radio from './pages/Radio';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ScrollToTop from './components/ScrollToTop';
import Recommendations from './pages/Recommendations';
import Login from './pages/Login.jsx';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ArtistPage from './pages/ArtistPage';


// Páginas
import Home from './pages/Home';
import MarketPlace from './pages/MarketPlace';
import NewsLetter from './pages/NewsLetter';

// Temporales

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-gray-50">
          <NavBar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<MarketPlace />} />
              <Route path="/artist/:id" element={<ArtistPage />} />
              <Route path="/newsletter" element={<NewsLetter />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/descubrir" element={<Recommendations />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmacion" element={<ConfirmationPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

// git commit -m "GC05-68 Configurar API Gateway"

export default App;