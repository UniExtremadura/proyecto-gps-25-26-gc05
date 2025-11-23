import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, Headphones, Star } from "lucide-react";
import GenericCarousel from "../components/GenericCarousel";
import { motion } from "framer-motion";

// --- DATOS MOCK (Simulando el Microservicio de Recomendaciones) ---
const mockForYou = [
  { id: 101, title: "Daily Mix 1", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9", description: "Extremoduro, Marea y más" },
  { id: 102, title: "Descubrimiento Semanal", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4", description: "Núsica nueva seleccionada para ti" },
  { id: 103, title: "Radar de Novedades", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745", description: "Lanzamientos de artistas que sigues" },
  { id: 104, title: "On Repeat", image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26", description: "Las que no paras de escuchar" },
  { id: 105, title: "Summer Flashback", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4", description: "Tus éxitos del verano pasado" },
];

const mockTrending = [
  { id: 201, title: "Top 50 España", image: "https://placehold.co/400x400/blue/white?text=Top+50", description: "Lo más escuchado en el país" },
  { id: 202, title: "Viral Global", image: "https://placehold.co/400x400/purple/white?text=Viral", description: "Tendencias mundiales" },
  { id: 203, title: "Éxitos de Hoy", image: "https://placehold.co/400x400/red/white?text=Hits", description: "Solo temazos" },
  { id: 204, title: "Rock Classics", image: "https://placehold.co/400x400/black/white?text=Rock", description: "Leyendas del rock" },
];

const mockBecauseYouListened = [
  { id: 301, title: "Platero y Tú", image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1", description: "Similar a Extremoduro" },
  { id: 302, title: "Sinkope", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d", description: "Rock urbano que te gustará" },
  { id: 303, title: "Rosendo", image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0", description: "Un clásico imprescindible" },
];

const Recommendations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simular carga de API
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleItemClick = (item) => {
    // Al hacer clic, podríamos ir a una playlist o al artista
    // Por ahora, vamos al marketplace simulando que buscamos ese término
    navigate(`/marketplace?category=${encodeURIComponent(item.title)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-emerald-500 animate-pulse text-xl font-bold flex items-center gap-2">
            <Sparkles className="animate-spin" /> Personalizando tu experiencia...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-gray-900 to-black text-white pb-20">
      
      {/* HERO HEADER */}
      <div className="pt-12 pb-8 px-6 md:px-12">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h1 className="text-4xl md:text-6xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="text-yellow-400 fill-yellow-400" size={40} /> 
                Descubrir
            </h1>
            <p className="text-xl text-gray-300">Música seleccionada especialmente para ti.</p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 space-y-12">
        
        {/* SECCIÓN 1: HECHO PARA TI */}
        <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex items-center gap-2 px-4 mb-[-10px]">
                <Headphones className="text-emerald-400" />
                <h2 className="text-2xl font-bold">Hecho para ti</h2>
            </div>
            <GenericCarousel 
                items={mockForYou} 
                onItemClick={handleItemClick}
            />
        </motion.section>

        {/* SECCIÓN 2: TENDENCIAS */}
        <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
        >
            <div className="flex items-center gap-2 px-4 mb-[-10px]">
                <TrendingUp className="text-red-400" />
                <h2 className="text-2xl font-bold">Tendencias Globales</h2>
            </div>
            <GenericCarousel 
                items={mockTrending} 
                onItemClick={handleItemClick}
            />
        </motion.section>

        {/* SECCIÓN 3: PORQUE ESCUCHASTE... */}
        <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
        >
            <div className="flex items-center gap-2 px-4 mb-[-10px]">
                <Star className="text-yellow-400" />
                <h2 className="text-2xl font-bold">Porque escuchaste "Extremoduro"</h2>
            </div>
            <GenericCarousel 
                items={mockBecauseYouListened} 
                onItemClick={handleItemClick}
            />
        </motion.section>

      </div>
    </div>
  );
};

export default Recommendations;