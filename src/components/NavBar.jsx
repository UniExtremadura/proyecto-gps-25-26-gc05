import React, { useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { ShoppingCart } from "lucide-react";
import Button from "./Button"; // Importamos tu botón personalizado
import { useUser } from "../contexts/UserContext";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount] = useState(2); // Valor de prueba
  const [language, setLanguage] = useState("ES");
  
 
  const { user, logout, isAuthenticated } = useUser();
  
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
  };


  const scrollToTop = (path) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  };

  // Estilos para los enlaces del menú
  const linkStyles = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-white font-bold border-b-2 border-blue-500' : 'text-gray-300 hover:text-white'
    }`;

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 left-0 w-full z-50 h-20">
      <div className="container mx-auto flex items-center justify-between h-full px-4">
        
        {/* LOGO */}
        <Link to="/" onClick={() => scrollToTop("/")} className="flex items-center">
          <img
            src="/images/logoUnderSounds.png" 
            alt="UnderSounds"
            className="h-20 w-auto hover:opacity-80 transition"
            // Nota: Asegúrate de tener esta imagen en public/images/
          />
        </Link>

        {/* MENÚ DESKTOP (Centrado) */}
        <div className="hidden md:flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
          <NavLink to="/" end onClick={() => scrollToTop("/")} className={linkStyles}>Inicio</NavLink>
          <span className="text-gray-600">|</span>
          <NavLink to="/descubrir" onClick={() => scrollToTop("/descubrir")} className={linkStyles}>
              Descubrir
          </NavLink>
          <span className="text-gray-600">|</span>
          <NavLink to="/marketplace" onClick={() => scrollToTop("/marketplace")} className={linkStyles}>MarketPlace</NavLink>
          <span className="text-gray-600">|</span>
          <NavLink to="/newsletter" onClick={() => scrollToTop("/newsletter")} className={linkStyles}>NewsLetter</NavLink>
          <span className="text-gray-600">|</span>
          <NavLink to="/radio" onClick={() => scrollToTop("/radio")} className={linkStyles}>Radio</NavLink>
          <span className="text-gray-600">|</span>
          <NavLink to="/profile" onClick={() => scrollToTop("/profile")} className={linkStyles}>Perfil</NavLink>
        </div>

        {/* ZONA DERECHA (Carrito, Idioma, Auth) */}
        <div className="flex items-center space-x-4">
          
          {/* Selector de Idioma */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 text-white text-sm px-2 py-1 rounded border border-gray-700 focus:outline-none"
          >
            <option value="ES">🇪🇸 ES</option>
            <option value="EN">🇺🇸 EN</option>
            <option value="FR">🇫🇷 FR</option>
          </select>

          {/* Carrito */}
          <div className="relative group cursor-pointer">
            <Link to="/cart">
              <ShoppingCart className="text-gray-300 group-hover:text-white transition" size={24} />
            </Link>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </div>


          {/* Botones de Auth */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            {isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    Perfil
                  </Button>
                </Link>

                <Button variant="secondary" size="sm"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    Ingresar
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Registro
                  </Button>
                </Link>
              </>
            )}
          </div>



          {/* Botón Menú Móvil */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL (Desplegable) */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-2 border-t border-gray-700">
          <Link to="/" className="block py-2 hover:text-blue-400" onClick={toggleMenu}>Inicio</Link>
          <Link to="/marketplace" className="block py-2 hover:text-blue-400" onClick={toggleMenu}>MarketPlace</Link>
          <Link to="/newsletter" className="block py-2 hover:text-blue-400" onClick={toggleMenu}>NewsLetter</Link>
          <Link to="/radio" className="block py-2 hover:text-blue-400" onClick={toggleMenu}>Radio</Link>
          <Link to="/profile" className="block py-2 hover:text-blue-400" onClick={toggleMenu}>Perfil</Link>
          
          <div className="pt-4 border-t border-gray-700 flex flex-col gap-2">
            {user?.token ? (
              <Button variant="secondary" className="w-full"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Cerrar Sesión
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="w-full justify-start text-white" onClick={() => navigate("/login")}>
                  Iniciar Sesión
                </Button>
                <Button variant="primary" className="w-full" onClick={() => navigate("/register")}>
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;