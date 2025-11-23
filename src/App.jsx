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

// Páginas
import Home from './pages/Home';
import MarketPlace from './pages/MarketPlace';
import NewsLetter from './pages/NewsLetter'; // <--- IMPORTAR

// Temporales
const Login = () => <div className="p-20 text-center">🚧 Login en construcción</div>;

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
              <Route path="/newsletter" element={<NewsLetter />} /> {/* <--- USAR AQUÍ */}
              <Route path="/radio" element={<Radio />} />
              <Route path="/descubrir" element={<Recommendations />} />
              <Route path="/profile" element={<div className="p-20">Perfil</div>} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmacion" element={<ConfirmationPage />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;