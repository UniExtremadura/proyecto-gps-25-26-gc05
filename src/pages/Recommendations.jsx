import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, Headphones, Star, AlertCircle } from "lucide-react";
import GenericCarousel from "../components/GenericCarousel";
import { motion } from "framer-motion";

// Importamos la API real
import { getTopTracks, getRecommendedTracks } from "../api/recommendationApi";

// ID de usuario hardcodeado para la demo (coincide con tus datos de prueba SQL: 1001)
const CURRENT_USER_ID = 1001; 

const Recommendations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Estados para las diferentes listas
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [genreRecommendations, setGenreRecommendations] = useState([]);
  const [likeRecommendations, setLikeRecommendations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Cargar Top Global (Métricas)
        const topData = await getTopTracks();
        setTrendingTracks(mapTracksToCarousel(topData, "Global Hit"));

        // 2. Cargar Recomendaciones por Género
        const genreData = await getRecommendedTracks(CURRENT_USER_ID, 'genre');
        setGenreRecommendations(mapTracksToCarousel(genreData, "Tu estilo"));

        // 3. Cargar Recomendaciones por Likes (Colaborativo)
        const likeData = await getRecommendedTracks(CURRENT_USER_ID, 'like');
        setLikeRecommendations(mapTracksToCarousel(likeData, "Basado en tus likes"));

      } catch (error) {
        console.error("Error cargando recomendaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper para transformar el objeto Track de la API al formato del Carrusel
  const mapTracksToCarousel = (tracks, subtitle) => {
    return tracks.map((track) => ({
      id: track.id,
      title: track.title || `Track ${track.id}`,
      // Generamos una imagen placeholder porque la API de métricas devuelve datos puros
      image: getPlaceholderImage(track.title, track.id), 
      description: track.genre 
        ? `${track.genre} • ${track.plays ? track.plays + ' plays' : subtitle}` 
        : `${track.plays || 0} reproducciones`
    }));
  };

  // Generador de imágenes chulas basado en texto (para que no quede gris)
  const getPlaceholderImage = (text, id) => {
    // Usamos un servicio de placeholders con estilo
    const seed = id || text.replace(/\s/g, '');
    return `https://picsum.photos/seed/${seed}/400/400`; 
  };

  const handleItemClick = (item) => {
    // Navegar al detalle o reproducir
    console.log("Click en track:", item.id);
    navigate(`/player/${item.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-emerald-500 animate-pulse text-xl font-bold flex items-center gap-2">
            <Sparkles className="animate-spin" /> Conectando con Python...
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
            <p className="text-xl text-gray-300">
              Métricas en tiempo real calculadas para el usuario 
              <span className="font-mono text-emerald-400 ml-2">#{CURRENT_USER_ID}</span>
            </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 space-y-12">
        
        {/* SECCIÓN 1: RECOMENDADO POR GÉNERO */}
        <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex items-center gap-2 px-4 mb-[-10px]">
                <Headphones className="text-emerald-400" />
                <h2 className="text-2xl font-bold">Según lo que escuchas</h2>
            </div>
            {genreRecommendations.length > 0 ? (
              <GenericCarousel 
                  items={genreRecommendations} 
                  onItemClick={handleItemClick}
              />
            ) : (
              <p className="px-4 text-gray-500 mt-4">Escucha más canciones para recibir recomendaciones por género.</p>
            )}
        </motion.section>

        {/* SECCIÓN 2: TENDENCIAS GLOBALES */}
        <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
        >
            <div className="flex items-center gap-2 px-4 mb-[-10px]">
                <TrendingUp className="text-red-400" />
                <h2 className="text-2xl font-bold">Lo más viral (Top Tracks)</h2>
            </div>
            <GenericCarousel 
                items={trendingTracks} 
                onItemClick={handleItemClick}
            />
        </motion.section>

        {/* SECCIÓN 3: PORQUE DISTE LIKE */}
        <motion.section 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
        >
            <div className="flex items-center gap-2 px-4 mb-[-10px]">
                <Star className="text-yellow-400" />
                <h2 className="text-2xl font-bold">Porque te gustaron tus canciones</h2>
            </div>
            {likeRecommendations.length > 0 ? (
              <GenericCarousel 
                  items={likeRecommendations} 
                  onItemClick={handleItemClick}
              />
            ) : (
              <div className="px-4 mt-4 flex items-center gap-2 text-gray-500">
                <AlertCircle size={18}/> 
                <p>Da 'Like' a canciones para ver recomendaciones colaborativas.</p>
              </div>
            )}
        </motion.section>

      </div>
    </div>
  );
};

export default Recommendations;