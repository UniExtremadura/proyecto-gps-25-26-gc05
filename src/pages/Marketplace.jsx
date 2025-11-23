import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAlbums, getArtists, getTracks } from "../api/contentApi";
import { useCart } from "../contexts/CartContext"; // Ahora sí importa del sitio correcto
import { Search, Disc, Mic, Loader, AlertCircle } from 'lucide-react';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// Tarjeta de Álbum
const AlbumCard = ({ album, artistName, onClick, isActive }) => (
    <div 
      onClick={onClick}
      className={`group p-4 rounded-xl transition-all duration-300 cursor-pointer border ${isActive ? 'bg-zinc-800 border-emerald-500/50 shadow-lg' : 'bg-zinc-900/50 hover:bg-zinc-800 border-transparent hover:border-zinc-700'}`}
    >
      <div className="relative w-full aspect-square rounded-lg mb-4 shadow-lg flex items-center justify-center overflow-hidden bg-zinc-800">
        <img 
            // Usamos placehold.co que es mucho más rápido y estable
            src={album.coverUrl || 'https://placehold.co/300x300?text=No+Cover'} 
            alt={album.title} 
            className="w-full h-full object-cover" 
            onError={(e) => e.target.src = 'https://placehold.co/300x300?text=Error'} 
        />
      </div>
      <h3 className={`font-semibold truncate mb-1 ${isActive ? 'text-emerald-400' : 'text-white'}`}>{album.title}</h3>
      <p className="text-sm text-zinc-400 truncate">{artistName || "Artista desconocido"}</p>
      <p className="text-xs text-emerald-500 mt-2 font-bold">20.00 €</p>
    </div>
);

// Panel de Detalles (Derecha)
const AlbumDetailPanel = ({ album, artistName, tracks, onAddToCart }) => {
    if (!album) return <div className="h-full flex items-center justify-center text-zinc-500">Selecciona un álbum</div>;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden sticky top-24 shadow-2xl">
            <div className="relative h-48 bg-zinc-800">
                <img src={album.coverUrl || 'https://placehold.co/300x300?text=No+Cover'} className="w-full h-full object-cover opacity-50" alt="Cover"/>
                <div className="absolute bottom-0 p-4 bg-gradient-to-t from-zinc-900 to-transparent w-full">
                    <h2 className="text-2xl font-bold text-white">{album.title}</h2>
                    <p className="text-emerald-400">{artistName}</p>
                </div>
            </div>
            <div className="p-4">
                <div className="flex gap-2 mb-4">
                    <button onClick={() => onAddToCart(album)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg font-bold transition">
                        Añadir al Carrito (20€)
                    </button>
                </div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2">Canciones</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {tracks.length > 0 ? tracks.map((t, i) => (
                        <div key={t.id} className="flex justify-between text-sm text-zinc-300 hover:bg-zinc-800 p-2 rounded">
                            <span>{i+1}. {t.title}</span>
                            <span className="font-mono text-zinc-500">{t.duration}</span>
                        </div>
                    )) : <p className="text-zinc-500 text-sm italic">No hay canciones disponibles.</p>}
                </div>
            </div>
        </div>
    );
};

function MarketPlace() {
  const query = useQuery();
  const initialCategory = query.get("category") || ""; 
  
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // ESTOS SON LOS FILTROS QUE SE MANDAN AL BACKEND
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(initialCategory);
  
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  // 1. Cargar datos base (Artistas y Tracks) para resolver nombres
  useEffect(() => {
    const loadBaseData = async () => {
        try {
            const [artistsData, tracksData] = await Promise.all([getArtists(), getTracks()]);
            
            console.log("🎵 Canciones recibidas del backend:", tracksData); // <--- AÑADE ESTO
            
            setArtists(artistsData);
            setTracks(tracksData);
        } catch (err) {
            console.error("Error cargando datos base:", err);
        }
    };
    loadBaseData();
  }, []);

  // 2. Cargar Álbumes (USANDO FILTROS DE SERVIDOR)
  useEffect(() => {
    console.log("🔄 useEffect disparado. Query:", searchQuery); // <--- AÑADE ESTO
    
    let isMounted = true;

    const fetchAlbums = async () => {
      setLoading(true);
      try {
        // AQUI ES DONDE USAMOS TUS ENDPOINTS:
        // Se envían page, size, title (searchQuery) y genre (selectedGenre) al servidor
        const newAlbums = await getAlbums(page, 8, searchQuery, selectedGenre);
        
        if (isMounted) {
            const isNewFilter = page === 0;
            if (isNewFilter) {
                setAlbums(newAlbums);
                if (newAlbums.length > 0) setSelectedAlbum(newAlbums[0]);
                else setSelectedAlbum(null);
            } else {
                setAlbums(prev => [...prev, ...newAlbums]);
            }
            setError(null);
        }
      } catch (err) {
        console.error("Error fetching albums:", err);
        if (isMounted) setError("Error conectando con el servidor.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAlbums();

    return () => { isMounted = false; };
  }, [page, searchQuery, selectedGenre]); // Se ejecuta cuando cambias filtros

  // Manejadores de Filtros
  const handleSearch = (e) => {
      const texto = e.target.value;
      console.log("⌨️ Escribiendo en React:", texto); // <--- AÑADE ESTO
      setSearchQuery(texto);
      setPage(0);
  };

  const handleCategoryClick = (cat) => {
      setSelectedGenre(cat === 'Todas' ? '' : cat); // Esto dispara el useEffect
      setPage(0);
  };

  // Helpers de visualización
  const getArtistName = (idToCheck) => {
      // CHIVATO: Si ves "Buscando nombre para: undefined", es que pasamos mal el parámetro
      // console.log("🔍 Buscando artista con ID:", idToCheck); 

      if (!idToCheck) return "Desconocido (ID null)";

      // Convertimos a String para comparar "1" con 1 sin problemas
      const artist = artists.find(a => String(a.id) === String(idToCheck));
      
      return artist ? artist.name : "Desconocido (No encontrado)";
  };

  const getAlbumTracks = (albumId) => {
      // CORRECCIÓN: El backend envía "album_id", pero por si acaso miramos "albumId" también
      return tracks.filter(t => {
          const trackAlbumId = t.album_id || t.albumId; 
          return String(trackAlbumId) === String(albumId);
      });
  };

  const handleAddToCart = (album) => {
      addToCart({
          id: album.id,
          title: album.title,
          price: 20.00, 
          img: album.coverUrl
      });
      navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      
      {/* Navbar de Filtros */}
      <div className="sticky top-20 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Buscador (Filtra por Título en Backend) */}
            <div className="relative w-full md:w-96 group">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500" />
                <input 
                    type="text" 
                    placeholder="Buscar por título..." 
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500 transition-colors text-white"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {/* Categorías (Filtra por Género en Backend) */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {["Todas", "Rock", "Pop", "Indie", "Metal"].map(cat => (
                    <button 
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                            (selectedGenre === cat || (cat === 'Todas' && !selectedGenre)) 
                            ? "bg-emerald-600 text-white" 
                            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-lg mb-6 flex items-center gap-3">
                <AlertCircle /> {error}
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Lista de Álbumes */}
            <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-6">
                    <Disc className="text-emerald-500" />
                    <h2 className="text-2xl font-bold">Catálogo</h2>
                </div>

                {albums.length === 0 && !loading ? (
                    <p className="text-zinc-500 italic">No se encontraron álbumes.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {albums.map(album => {
                            // INTELIGENCIA: Miramos si viene como 'artistId' o 'artist_id'
                            const realArtistId = album.artistId || album.artist_id;
                            
                            return (
                                <AlbumCard 
                                    key={album.id} 
                                    album={album}
                                    // Pasamos el ID corregido
                                    artistName={getArtistName(realArtistId)}
                                    onClick={() => setSelectedAlbum(album)}
                                    isActive={selectedAlbum?.id === album.id}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Botón Paginación (Llama a la siguiente página del Backend) */}
                <div className="mt-8 text-center">
                    {loading ? (
                        <div className="flex justify-center"><Loader className="animate-spin text-emerald-500" /></div>
                    ) : (
                        <button 
                            onClick={() => setPage(p => p + 1)}
                            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm font-medium transition-colors text-white"
                        >
                            Cargar más resultados
                        </button>
                    )}
                </div>
            </div>

            {/* Panel de Detalle */}
            <div className="hidden lg:block lg:col-span-4 animate-in fade-in slide-in-from-right-10 duration-500">
                <AlbumDetailPanel 
                    album={selectedAlbum}
                    // Aquí también aplicamos la lógica del ID
                    artistName={selectedAlbum ? getArtistName(selectedAlbum.artistId || selectedAlbum.artist_id) : ''}
                    tracks={selectedAlbum ? getAlbumTracks(selectedAlbum.id) : []}
                    onAddToCart={handleAddToCart}
                />
            </div>

        </div>
      </main>
    </div>
  );
}

export default MarketPlace;