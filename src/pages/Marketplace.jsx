import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link} from "react-router-dom";
import { getAlbums, getArtists, getTracks } from "../api/contentApi";
import { useCart } from "../contexts/CartContext"; 
import { Search, Disc, Loader, AlertCircle, Filter } from 'lucide-react';

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
            src={album.cover_url || 'https://placehold.co/300x300?text=No+Cover'} 
            alt={album.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
            onError={(e) => e.target.src = 'https://placehold.co/300x300?text=Error'} 
        />
      </div>
      <h3 className={`font-semibold truncate mb-1 ${isActive ? 'text-emerald-400' : 'text-white'}`}>{album.title}</h3>
      <p className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
        <Link to={`/artist/${album.artistId || album.artist_id}`}>
            {artistName}
        </Link>
      </p>
      <p className="text-xs text-emerald-500 mt-2 font-bold">20.00 €</p>
    </div>
);

// Panel de Detalles (Derecha)
const AlbumDetailPanel = ({ album, artistName, tracks, onAddToCart }) => {
    if (!album) return <div className="h-full flex items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-2xl p-10">Selecciona un álbum para ver detalles</div>;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden sticky top-48 shadow-2xl max-h-[calc(100vh-200px)] flex flex-col">
            <div className="relative h-72 bg-zinc-800 flex-shrink-0">
                <img 
                    src={album.cover_url || 'https://placehold.co/300x300?text=No+Cover'} 
                    className="w-full h-full object-cover opacity-50" 
                    alt="Cover"
                    onError={(e) => e.target.src = 'https://placehold.co/300x300?text=Error'} 
                />
                <div className="absolute bottom-0 p-6 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent w-full">
                    <h2 className="text-3xl font-bold text-white line-clamp-1" title={album.title}>{album.title}</h2>
                    <p className="text-xl text-emerald-400 font-medium hover:underline cursor-pointer">
                        <Link to={`/artist/${album.artistId || album.artist_id}`}>
                            {artistName}
                        </Link>
                    </p>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                <div className="flex gap-2 mb-6">
                    <button onClick={() => onAddToCart(album)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-emerald-900/20 transform hover:scale-105">
                        Añadir al Carrito (20€)
                    </button>
                </div>
                
                <h3 className="text-xs font-bold text-zinc-500 uppercase mb-3 sticky top-0 bg-zinc-900 py-2 border-b border-zinc-800">
                    Lista de Canciones
                </h3>
                
                <div className="space-y-1">
                    {tracks.length > 0 ? tracks.map((t, i) => (
                        <div key={t.id} className="flex justify-between text-sm text-zinc-300 hover:bg-zinc-800 p-3 rounded-lg transition-colors cursor-default group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="text-zinc-600 font-mono w-4">{i+1}</span>
                                <span className="truncate group-hover:text-white">{t.title}</span>
                            </div>
                            <span className="font-mono text-zinc-500 text-xs">{t.duration}</span>
                        </div>
                    )) : (
                        <div className="text-zinc-500 text-sm italic text-center py-8 bg-zinc-800/30 rounded-xl">
                            No hay canciones disponibles.
                        </div>
                    )}
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
  
  // --- FILTROS ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("album"); // 'album' o 'artist'
  const [selectedGenre, setSelectedGenre] = useState(initialCategory);
  
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  // 1. Cargar datos base
  useEffect(() => {
    const loadBaseData = async () => {
        try {
            const [artistsData, tracksData] = await Promise.all([getArtists(), getTracks()]);
            setArtists(artistsData);
            setTracks(tracksData);
        } catch (err) {
            console.error("Error cargando datos base:", err);
        }
    };
    loadBaseData();
  }, []);

  // 2. Cargar Álbumes
  useEffect(() => {
    let isMounted = true;

    const fetchAlbums = async () => {
      setLoading(true);
      try {
        const newAlbums = await getAlbums(page, 8, searchQuery, searchType, selectedGenre);
        
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
  }, [page, searchQuery, searchType, selectedGenre]);

  const handleSearch = (e) => {
      setSearchQuery(e.target.value);
      setPage(0);
  };

  const handleCategoryClick = (cat) => {
      setSelectedGenre(cat === 'Todas' ? '' : cat);
      setPage(0);
  };

  const getArtistName = (idToCheck) => {
      if (!idToCheck) return "Desconocido";
      const artist = artists.find(a => String(a.id) === String(idToCheck));
      return artist ? artist.name : "Desconocido";
  };

  const getAlbumTracks = (albumId) => {
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
          img: album.cover_url
      });
      navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      
      {/* Navbar de Filtros */}
      <div className="sticky top-20 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* --- BUSCADOR MODIFICADO (Solo Álbum y Artista) --- */}
            <div className="relative w-full md:w-[600px] flex gap-2 items-center bg-zinc-900 rounded-full border border-zinc-700 p-1 focus-within:border-emerald-500 transition-colors">
                
            {/* Selector de Tipo */}
                <div className="relative border-r border-zinc-700">
                    <select 
                        value={searchType}
                        onChange={(e) => {
                            setSearchType(e.target.value);
                            setPage(0);
                        }}
                        // Clases actualizadas: bg-transparent (para el input cerrado) y text-white
                        className="appearance-none bg-transparent text-zinc-300 text-sm font-medium py-2 pl-4 pr-8 focus:outline-none cursor-pointer hover:text-white transition-colors"
                    >
                        {/* Opciones con fondo oscuro para que se vean bien en el desplegable */}
                        <option value="album" className="bg-zinc-900 text-white">Álbum</option>
                        <option value="artist" className="bg-zinc-900 text-white">Artista</option>
                    </select>
                    {/* Icono de filtro */}
                    <Filter className="absolute right-2 top-2.5 w-3 h-3 text-zinc-500 pointer-events-none" />
                </div>

                {/* Input de Texto */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" />
                    <input 
                        type="text" 
                        placeholder={`Buscar por ${searchType === 'artist' ? 'artista' : 'título'}...`} 
                        className="w-full bg-transparent border-none py-2 pl-10 pr-4 focus:ring-0 text-white placeholder:text-zinc-600 outline-none"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* --- LISTA DE GÉNEROS --- */}
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide max-w-full md:max-w-[60%] items-center">
                {["Todas", "Rock", "Pop Rock", "Ballad", "Hard Rock", "Pop", "Indie", "Metal", "Jazz", "Electrónica", "Urbano", "Clásica"].map(cat => (
                    <button 
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${
                            (selectedGenre === cat || (cat === 'Todas' && !selectedGenre)) 
                            ? "bg-emerald-500 text-black border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
                            : "bg-transparent border-zinc-700 text-zinc-400 hover:border-emerald-400 hover:text-emerald-400 hover:bg-zinc-800/50"
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
                    <div className="p-12 text-center border border-zinc-800 rounded-2xl bg-zinc-900/50">
                        <p className="text-zinc-500 text-lg mb-2">No se encontraron álbumes.</p>
                        <button onClick={() => {setSearchQuery(""); setSelectedGenre("");}} className="text-emerald-500 hover:underline">Limpiar filtros</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {albums.map(album => {
                            const realArtistId = album.artistId || album.artist_id;
                            return (
                                <AlbumCard 
                                    key={album.id} 
                                    album={album}
                                    artistName={getArtistName(realArtistId)}
                                    onClick={() => setSelectedAlbum(album)}
                                    isActive={selectedAlbum?.id === album.id}
                                />
                            );
                        })}
                    </div>
                )}

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
            <div className="hidden lg:block lg:col-span-4 h-full">
                <div className="sticky top-48">
                    <AlbumDetailPanel 
                        album={selectedAlbum}
                        artistName={selectedAlbum ? getArtistName(selectedAlbum.artistId || selectedAlbum.artist_id) : ''}
                        tracks={selectedAlbum ? getAlbumTracks(selectedAlbum.id) : []}
                        onAddToCart={handleAddToCart}
                    />
                </div>
            </div>

        </div>
      </main>
    </div>
  );
}

export default MarketPlace;