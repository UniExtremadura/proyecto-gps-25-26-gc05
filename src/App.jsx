import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Marketplace from './pages/Marketplace';

// Componentes temporales para probar la navegación
const Home = () => <div className="p-10 text-3xl font-bold text-center">🏠 Página de Inicio</div>;
//const MarketPlace = () => <div className="p-10 text-3xl font-bold text-center">🛒 MarketPlace</div>;
const Login = () => <div className="p-10 text-3xl font-bold text-center">🔐 Página de Login</div>;

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* La NavBar siempre visible arriba */}
        <NavBar />
        
        {/* El contenido cambia según la ruta */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/newsletter" element={<div className="p-10">NewsLetter</div>} />
            <Route path="/radio" element={<div className="p-10">Radio</div>} />
            <Route path="/profile" element={<div className="p-10">Perfil de Usuario</div>} />
            <Route path="/cart" element={<div className="p-10">Carrito de Compras</div>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;