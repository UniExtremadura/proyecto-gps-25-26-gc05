import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, Headphones, Star, AlertCircle } from "lucide-react";
import GenericCarousel from "../components/GenericCarousel";
import { motion } from "framer-motion";

// Importamos la API de recomendaciones Y la de contenidos (para los álbumes)
import { 
  getTopTracks, 
  getRecommendedTracksByGenre, 
  getRecommendedTracksByLike 
} from "../api/recommendationApi";

const Recommendations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Estados para almacenar las listas
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [genreRecommendations, setGenreRecommendations] = useState([]);
  const [likeRecommendations, setLikeRecommendations] = useState([]);
  
  // NUEVO: Estado para guardar los álbumes (para sacar las fotos)
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Top Global (Público)
        const topData = await getTopTracks();
        setTrendingTracks(mapTracksToCarousel(topData, "Éxito Global"));

        // 2. Por Género (Privado - Usa Cookie)
        // CAMBIO: Llamada sin argumentos
        const genreData = await getRecommendedTracksByGenre(); 
        setGenreRecommendations(mapTracksToCarousel(genreData, "Tu estilo favorito"));

        // 3. Por Likes (Privado - Usa Cookie)
        // CAMBIO: Llamada sin argumentos
        const likeData = await getRecommendedTracksByLike();
        setLikeRecommendations(mapTracksToCarousel(likeData, "Basado en tus likes"));

      } catch (error) {
        console.error("Error cargando recomendaciones:", error);
        // Si el backend devuelve 401 (no hay cookie o expiró), mandamos al login
        if (error.response && error.response.status === 401) {
             navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // Añadir navigate a dependencias es buena práctica

  // --- HELPER: Transformar datos de API a formato Visual ---
  const mapTracksToCarousel = (tracks, subtitleDefault) => {
    if (!tracks || !Array.isArray(tracks)) return [];

    return tracks.map((track) => {
        // Buscamos la portada real usando el ID del álbum de la canción
        const realCover = getAlbumCover(track.albumId || track.album_id, albumsList);
        
        return {
          id: track.id,
          title: track.title || `Track ${track.id}`,
          // Usamos la portada real, o un placeholder si no existe
          image: realCover || `https://placehold.co/400x400/222/fff?text=No+Cover`,
          description: track.genre 
            ? `${track.genre} • ${track.plays ? track.plays + ' reprod.' : subtitleDefault}` 
            : subtitleDefault
        };
    });
  };

  const handleItemClick = (item) => {
    // Al hacer clic, vamos a la radio y tocamos esa canción
    navigate(`/radio?trackId=${item.id}`); 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-emerald-500 animate-pulse text-xl font-bold flex items-center gap-2">
            <Sparkles className="animate-spin" /> Analizando tus gustos...
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
              Métricas en tiempo real calculadas para ti.
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
                <div className="px-4 py-8 text-gray-500 bg-white/5 rounded-xl mx-4 mt-4 text-center">
                    <p>Escucha música en la Radio para que detectemos tu género favorito.</p>
                </div>
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
                <h2 className="text-2xl font-bold">Tendencias Globales (Top Plays)</h2>
            </div>
            
            {trendingTracks.length > 0 ? (
                <GenericCarousel 
                    items={trendingTracks} 
                    onItemClick={handleItemClick}
                />
            ) : (
                <p className="px-4 text-gray-500 mt-4">Aún no hay datos de tendencias globales.</p>
            )}
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
                <div className="px-4 mt-4 flex items-center gap-2 text-gray-400 bg-yellow-900/20 p-4 rounded-lg mx-4 border border-yellow-900/50">
                    <AlertCircle size={20}/> 
                    <p>Dale 'Like' ❤️ a algunas canciones para desbloquear esta sección.</p>
                </div>
            )}
        </motion.section>

      </div>
    </div>
  );
};

export default Recommendations;