import React from "react";
import { motion } from "framer-motion";
import HomeWindow from "../components/HomeWindow";
import ProductCategories from "../components/ProductCategories"; // Asegúrate de tener este (si no, quítalo)
import GenericCarousel from "../components/GenericCarousel";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// --- DATOS DE PRUEBA ---
const mockEvents = [
  { id: 1, title: "Rock Fest 2025", image: "https://es.concerts-metal.com/images/flyers/202505/1747391630--Rock-Fest-Barcelona-2025.webp", date: "15 JUL", description: "Barcelona, España" },
  { id: 2, title: "Jazz Night", image: "https://m.media-amazon.com/images/I/51oUc+Io4BL._UXNaN_FMjpg_QL85_.jpg", date: "22 AGO", description: "Madrid, España" },
  { id: 3, title: "Indie Sessions", image: "https://www.lhmagazin.com/wp-content/uploads/2022/02/unnamed-2022-02-03T091031.557-scaled.jpg", date: "10 SEP", description: "Valencia, España" },
  { id: 4, title: "Techno Rave", image: "https://i1.sndcdn.com/artworks-uH3GoncX2FXEKZsd-CdkjIg-t500x500.jpg", date: "05 OCT", description: "Ibiza, España" }
];

const mockNews = [
  { id: 1, title: "Nuevo Álbum de Extremoduro", image: "https://tiendawarnermusic.es/cdn/shop/files/5021732523617.webp?v=1737741122", description: "La banda legendaria regresa con material inédito." },
  { id: 2, title: "Entrevista Exclusiva", image: "https://i.ytimg.com/vi/5sOTynHnAIQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA3EE193Se6swL9GrUZAIppYu59qQ", description: "Hablamos con los productores del momento." },
  { id: 3, title: "Top 10 Vinilos del Mes", image: "https://i.ytimg.com/vi/yAoaunNXe54/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCmFvydHrTI_pKOCKBi1NgT13LzEw", description: "Los discos más vendidos en nuestra tienda." },
  { id: 4, title: "Guía de Festivales 2025", image: "https://musicanueva.es/wp-content/uploads/2025/07/Guia-de-festivales-agosto-Espana-y-Portugal.jpg", description: "Todo lo que necesitas saber para este verano." },
];

//Home
const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 2. INICIALIZAR NAVEGACIÓN
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* HERO SECTION (Bienvenida con animación) */}
      <section className="relative bg-white py-20 text-center overflow-hidden">
        <div className="container mx-auto px-4 z-10 relative">
            <motion.h1 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-4"
            >
                UNDER<span className="text-blue-600">SOUNDS</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl text-gray-500 max-w-2xl mx-auto"
            >
                Descubre, compra y comparte la música que te mueve. <br/>
                El marketplace definitivo para artistas independientes.
            </motion.p>
        </div>
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <div className="container mx-auto px-4 py-8 space-y-16">
        
        {/* Banner */}
        <section>
            <HomeWindow />
        </section>

        {/* Categorías (Si tienes el componente hecho, si no, comenta esta línea) */}
        {/* <ProductCategories /> */}

        {/* Próximos Eventos */}
        <section>
            <GenericCarousel items={mockEvents} title="📅 Próximos Eventos" onItemClick={() => navigate("/newsletter")}/>
        </section>

        {/* Noticias */}
        <section>
            <GenericCarousel items={mockNews} title="📰 Últimas Noticias" onItemClick={() => navigate("/newsletter")}/>
        </section>

      </div>
    </div>
  );
};

export default Home;