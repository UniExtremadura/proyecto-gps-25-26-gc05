import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const scrollToTop = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-10 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Columna 1: Logo y Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <Link 
              to="/" 
              onClick={scrollToTop}
              className="cursor-pointer hover:opacity-80 transition-opacity mb-4"
            >
              {/* Si no tienes la imagen aún, saldrá el texto alt, no te preocupes */}
              <img 
                src="/images/logoUnderSounds.png" 
                alt="UnderSounds Logo" 
                className="h-20 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-400 text-center md:text-left">
              © 2025 UnderSounds.<br/>Todos los derechos reservados.
            </p>
          </div>

          {/* Columna 2: Enlaces de Información */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-lg mb-4 text-blue-500">Información</h4>
            <ul className="space-y-2 text-gray-400 text-sm text-center md:text-left">
              <li><Link to="/info#documentacion" className="hover:text-white transition">Documentación</Link></li>
              <li><Link to="/info#politica" className="hover:text-white transition">Política de privacidad</Link></li>
              <li><Link to="/info#ayuda" className="hover:text-white transition">Ayuda y Soporte</Link></li>
              <li><Link to="/info#terminos" className="hover:text-white transition">Términos de uso</Link></li>
              <li><Link to="/info#contacto" className="hover:text-white transition">Contáctanos</Link></li>
            </ul>
          </div>

          {/* Columna 3: Redes Sociales */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold text-lg mb-4 text-blue-500">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-300">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 hover:text-white transition duration-300">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition duration-300">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-blue-700 hover:text-white transition duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;