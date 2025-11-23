import React, { useState, useEffect } from 'react';
import { Play, Heart, MoreHorizontal, Search, Disc, Mic, Music, AlertCircle, Loader, WifiOff, Calendar, Clock } from 'lucide-react';

// --- DEFINICIÓN DEL SERVICIO (INTEGRADA PARA PREVISUALIZACIÓN) ---
// NOTA: En tu proyecto real, usa: import ContentService from './api/content';

const ContentService = {
  baseURL: 'http://localhost:8081',

  async _request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        ...options
      });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn(`Fallo al conectar con ${endpoint}`, error);
      throw error;
    }
  },

  getAlbums: function() { return this._request('/albums'); },
  getArtists: function() { return this._request('/artists'); },
  getTracks: function() { return this._request('/tracks'); },
  getArtistById: function(id) { return this._request(`/artists/${id}`); },
  getAlbumById: function(id) { return this._request(`/albums/${id}`); },
  getTrackById: function(id) { return this._request(`/tracks/${id}`); },
};

// --- DATOS MOCK DE RESPALDO ---
const MOCK_DATA = {
  albums: [
    { id: "alb_1", title: "Midnight Echoes", artist_id: "art_1", cover_url: "", release_date: "2023-01-01" },
    { id: "alb_2", title: "Solar Flares", artist_id: "art_2", cover_url: "", release_date: "2024-05-12" },
    { id: "alb_3", title: "Urban Jungle", artist_id: "art_3", cover_url: "", release_date: "2022-11-20" },
    { id: "alb_4", title: "Deep Blue", artist_id: "art_4", cover_url: "", release_date: "2023-08-15" },
    { id: "alb_5", title: "Neon Horizon", artist_id: "art_2", cover_url: "", release_date: "2024-01-30" },
  ],
  artists: [
    { id: "art_1", name: "The Lunar Keys", genre: "Indie Rock" },
    { id: "art_2", name: "Cosmic Ray", genre: "Synthwave" },
    { id: "art_3", name: "Metro Pulse", genre: "Electronic" },
    { id: "art_4", name: "Oceanic", genre: "Ambient" },
  ],
  tracks: [
    { id: "trk_1", title: "Neon Lights", album_id: "alb_3", duration: "3:45", genre: "Electronic" },
    { id: "trk_2", title: "Silence", album_id: "alb_1", duration: "4:12", genre: "Indie Rock" },
    { id: "trk_3", title: "Heatwave", album_id: "alb_2", duration: "2:58", genre: "Synthwave" },
    { id: "trk_4", title: "Abyss", album_id: "alb_4", duration: "5:20", genre: "Ambient" },
    { id: "trk_5", title: "City Rain", album_id: "alb_3", duration: "3:30", genre: "Electronic" },
    { id: "trk_6", title: "Midnight Drive", album_id: "alb_2", duration: "3:10", genre: "Synthwave" },
  ]
};

// --- COMPONENTES UI ---

const SectionTitle = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-2">
    {Icon && <Icon className="w-6 h-6 text-emerald-400" />}
    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
  </div>
);

// Modificado para aceptar onClick y mostrar estado activo
const AlbumCard = ({ album, artistName, onClick, isActive }) => {
  const hasImage = album.cover_url && album.cover_url.startsWith('http');
  
  return (
    <div 
      onClick={onClick}
      className={`group p-4 rounded-xl transition-all duration-300 cursor-pointer border ${isActive ? 'bg-zinc-800 border-emerald-500/50 shadow-emerald-900/20 shadow-lg' : 'bg-zinc-900/50 hover:bg-zinc-800 border-transparent hover:border-zinc-700'}`}
    >
      <div className={`relative w-full aspect-square rounded-lg mb-4 shadow-lg flex items-center justify-center overflow-hidden bg-zinc-800`}>
        {hasImage ? (
          <img src={album.cover_url} alt={album.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-zinc-900 flex items-center justify-center">
            <Disc className="w-12 h-12 text-white/20 group-hover:scale-110 transition-transform duration-500" />
          </div>
        )}
        {/* Botón Play solo visible en hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl hover:bg-emerald-400 transform scale-90 group-hover:scale-100 transition-transform">
                <Play className="w-6 h-6 text-black fill-black ml-1" />
             </div>
        </div>
      </div>
      <h3 className={`font-semibold truncate mb-1 ${isActive ? 'text-emerald-400' : 'text-white'}`} title={album.title}>{album.title}</h3>
      <p className="text-sm text-zinc-400 truncate">
        {artistName || "Desconocido"}
      </p>
    </div>
  );
};

const ArtistCircle = ({ artist }) => (
  <div className="group flex flex-col items-center cursor-pointer min-w-[100px]">
    <div className={`w-24 h-24 bg-zinc-800 rounded-full mb-3 overflow-hidden border-2 border-transparent group-hover:border-emerald-500/50 transition-all shadow-lg flex items-center justify-center relative`}>
       <div className="absolute inset-0 bg-gradient-to-b from-zinc-700 to-zinc-900 flex items-center justify-center">
          <span className="text-xl font-bold text-zinc-600 group-hover:text-emerald-500 transition-colors">
            {artist.name ? artist.name.charAt(0).toUpperCase() : '?'}
          </span>
       </div>
    </div>
    <h3 className="font-medium text-white text-sm text-center group-hover:text-emerald-400 transition-colors truncate w-full px-1">
      {artist.name}
    </h3>
  </div>
);

const TrackRow = ({ track, index, artistName }) => (
  <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700/50">
    <div className="w-6 text-center text-zinc-600 group-hover:text-emerald-500 font-mono text-xs">
      {index + 1}
    </div>
    
    <div className="flex-1 min-w-0">
      <h4 className="text-white font-medium truncate text-sm group-hover:text-emerald-400 transition-colors">{track.title}</h4>
      <p className="text-xs text-zinc-500 truncate">{artistName}</p>
    </div>
    
    <div className="text-xs text-zinc-500 font-mono">
      {track.duration}
    </div>
  </div>
);

// --- COMPONENTE DETALLE LATERAL ---
const AlbumDetailPanel = ({ album, artistName, tracks }) => {
  if (!album) return (
    <div className="h-full flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800 p-8">
      <Disc className="w-16 h-16 mb-4 opacity-20" />
      <p>Selecciona un álbum para ver detalles</p>
    </div>
  );

  const hasImage = album.cover_url && album.cover_url.startsWith('http');

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden sticky top-24 shadow-2xl shadow-black/50">
      {/* Cabecera con imagen grande */}
      <div className="relative aspect-square w-full bg-zinc-800">
         {hasImage ? (
           <img src={album.cover_url} alt={album.title} className="w-full h-full object-cover" />
         ) : (
           <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-zinc-900 flex items-center justify-center">
             <Disc className="w-32 h-32 text-white/10" />
           </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-90" />
         
         <div className="absolute bottom-0 left-0 p-6 w-full">
            <h2 className="text-3xl font-bold text-white mb-1 leading-tight">{album.title}</h2>
            <p className="text-xl text-emerald-400 font-medium mb-4">{artistName}</p>
            
            <div className="flex gap-3 mb-2">
               <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-4 rounded-full flex items-center justify-center gap-2 transition-colors">
                  <Play className="w-5 h-5 fill-current" /> Reproducir
               </button>
               <button className="w-12 h-12 rounded-full border border-zinc-600 flex items-center justify-center hover:bg-white/10 hover:border-white text-white transition-all">
                  <Heart className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>

      {/* Información Meta */}
      <div className="px-6 py-4 flex items-center gap-6 text-sm text-zinc-400 border-b border-zinc-800">
         <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{album.release_date || 'N/A'}</span>
         </div>
         <div className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span>{tracks.length} canciones</span>
         </div>
      </div>

      {/* Lista de canciones del álbum */}
      <div className="p-4">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-2">Lista de Canciones</h3>
        <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
           {tracks.length > 0 ? (
             tracks.map((track, idx) => (
               <TrackRow key={track.id} track={track} index={idx} artistName={artistName} />
             ))
           ) : (
             <p className="text-sm text-zinc-500 px-2 italic py-4">No hay canciones disponibles para este álbum.</p>
           )}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export default function Marketplace() {
  const [data, setData] = useState({ albums: [], artists: [], tracks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  
  // Nuevo estado para el álbum seleccionado
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // HELPERS
  const getArtistName = (artistId) => {
    if (!artistId || !data.artists.length) return null;
    const artist = data.artists.find(a => a.id === artistId);
    return artist ? artist.name : "Desconocido";
  };

  const resolveArtistNameForAlbum = (album) => {
     if (!album) return "";
     const id = album.artist_id || album.artistId; 
     return getArtistName(id);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setUsingFallback(false);

        const [albumsRes, artistsRes, tracksRes] = await Promise.all([
          ContentService.getAlbums(),
          ContentService.getArtists(),
          ContentService.getTracks()
        ]);

        const albums = Array.isArray(albumsRes) ? albumsRes : albumsRes.data || [];
        const artists = Array.isArray(artistsRes) ? artistsRes : artistsRes.data || [];
        const tracks = Array.isArray(tracksRes) ? tracksRes : tracksRes.data || [];

        setData({ albums, artists, tracks });

        // Seleccionar el primer álbum por defecto si hay datos
        if (albums.length > 0) {
          setSelectedAlbum(albums[0]);
        }
        
      } catch (err) {
        console.warn("Backend no disponible, usando datos de demostración.", err);
        setData(MOCK_DATA);
        setUsingFallback(true);
        // Fallback selección
        if (MOCK_DATA.albums.length > 0) {
            setSelectedAlbum(MOCK_DATA.albums[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30 pb-20">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-2xl shadow-black/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-emerald-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            UnderSounds
          </span>
        </div>
        
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-8 relative group">
          <Search className="absolute left-3 w-4 h-4 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600 text-zinc-200"
          />
        </div>

        <div className="flex items-center gap-4">
           {usingFallback && (
             <div className="flex items-center gap-2 text-xs text-amber-500 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-900/50" title="No se detectó backend">
                <WifiOff className="w-3 h-3" />
                <span className="hidden lg:inline">Offline</span>
             </div>
           )}
           <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden cursor-pointer hover:border-zinc-500 transition-colors">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
           </div>
        </div>
      </nav>

      {/* Main Content con Grid Layout */}
      <main className="p-6 md:p-8 max-w-[1600px] mx-auto">
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Marketplace</h1>
          <p className="text-zinc-400">Descubre y apoya a los artistas emergentes.</p>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-zinc-500 gap-4">
            <Loader className="w-10 h-10 animate-spin text-emerald-500" />
            <p className="animate-pulse font-medium">Cargando catálogo...</p>
          </div>
        ) : (
          /* GRID PRINCIPAL: 12 columnas en escritorio */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA (LISTAS): Ocupa 8 de 12 columnas */}
            <div className="lg:col-span-8 space-y-12 animate-in fade-in slide-in-from-left-4 duration-700">
              
              {/* Sección Álbumes */}
              <section>
                <SectionTitle title="Explorar Álbumes" icon={Disc} />
                {data.albums.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {data.albums.map(album => (
                      <AlbumCard 
                        key={album.id} 
                        album={album} 
                        artistName={resolveArtistNameForAlbum(album)}
                        onClick={() => setSelectedAlbum(album)}
                        isActive={selectedAlbum?.id === album.id}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500 italic">No hay álbumes disponibles.</p>
                )}
              </section>

              {/* Sección Artistas */}
              <section>
                <SectionTitle title="Artistas Destacados" icon={Mic} />
                <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-2xl">
                    {data.artists.length > 0 ? (
                        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700">
                        {data.artists.map(artist => (
                            <ArtistCircle key={artist.id} artist={artist} />
                        ))}
                        </div>
                    ) : (
                        <p className="text-zinc-500 italic">No hay artistas registrados.</p>
                    )}
                </div>
              </section>

            </div>

            {/* COLUMNA DERECHA (DETALLE): Ocupa 4 de 12 columnas */}
            <div className="lg:col-span-4 animate-in fade-in slide-in-from-right-4 duration-700 delay-100">
                <AlbumDetailPanel 
                    album={selectedAlbum} 
                    artistName={resolveArtistNameForAlbum(selectedAlbum)}
                    // Filtramos las canciones que pertenecen a este álbum
                    tracks={selectedAlbum ? data.tracks.filter(t => (t.album_id || t.albumId) === selectedAlbum.id) : []}
                />
            </div>

          </div>
        )}
      </main>

    </div>
  );
}