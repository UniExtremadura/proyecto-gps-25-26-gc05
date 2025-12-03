import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Datos de ejemplo para el banner
const bannerItems = [
  { image: "https://mercadeopop.com/wp-content/uploads/2021/04/directos8.jpg", title: "El mejor Rock en vivo" },
  { image: "https://i.ytimg.com/vi/-VnIClI6HPI/maxresdefault.jpg", title: "Nuevos lanzamientos de Electrónica" }
];


const HomeWindow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
    }, 5000); // Cambia cada 5 segundos
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto h-[400px] md:h-[500px] rounded-2xl overflow-hidden relative shadow-2xl">
        {/* Imagen de fondo */}
        <img
          src={bannerItems[currentIndex].image}
          alt={bannerItems[currentIndex].title}
          className="w-full h-full object-cover transition-all duration-1000 ease-in-out transform scale-105"
        />
        
        {/* Degradado negro para que se lea el texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        {/* Texto */}
        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{bannerItems[currentIndex].title}</h2>
          <p className="text-lg text-gray-300 mb-6">Descubre la colección completa en nuestro Marketplace.</p>
          <button 
            onClick={() => navigate("/marketplace")}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/50"
          >
            Ver más detalles
          </button>
        </div>

        {/* Indicadores (puntitos) */}
        <div className="absolute bottom-6 right-8 flex gap-2">
            {bannerItems.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-blue-500' : 'w-2 bg-white/50'}`}
                />
            ))}
        </div>
    </div>
  );
};

export default HomeWindow;