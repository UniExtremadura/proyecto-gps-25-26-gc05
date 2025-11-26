import React, { useState, useEffect, useRef } from "react";
import { getTracks, getArtists, getAlbums } from "../api/contentApi";
import { addLike, registerPlay } from "../api/usersApi"; // <--- IMPORTANTE: Añadido registerPlay
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, ListMusic, Heart, Search, X } from "lucide-react";

// ID consistente con tu base de datos para que las métricas funcionen
const CURRENT_USER_ID = 1001; 

const Radio = () => {
  // --- ESTADOS DE DATOS ---
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  // --- ESTADOS DE FILTRO ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Todos");

  // --- ESTADOS DEL REPRODUCTOR ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const audioRef = useRef(null);

  // 1. Cargar Datos
  useEffect(() => {
    const loadData = async () => {
      try {
        const [tracksData, artistsData, albumsData] = await Promise.all([
            getTracks(), 
            getArtists(),
            getAlbums(0, 1000)
        ]);
        
        const validTracks = tracksData.map(t => ({
            ...t,
            fileUrl: t.fileUrl || t.file_url || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        }));
        
        setPlaylist(validTracks);
        setArtists(artistsData);
        setAlbums(albumsData);
        setLoading(false);
      } catch (error) {
        console.error("Error cargando radio:", error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Control Audio Y REGISTRO DE METRICAS (HU7)
  useEffect(() => {
    if (playlist.length > 0 && audioRef.current) {
      audioRef.current.volume = volume;
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // <--- AQUÍ ESTÁ EL CAMBIO CLAVE ---
                    // Registramos el play en el backend cuando empieza a sonar
                    const track = playlist[currentTrackIndex];
                    if (track) {
                        // Llamada asíncrona (no esperamos respuesta para no bloquear)
                        registerPlay(CURRENT_USER_ID, track.id);
                    }
                })
                .catch(error => console.warn("Auto-play prevenido:", error));
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrackIndex, isPlaying, playlist]); // Dependencias

  // 3. Resetear Like visual al cambiar canción
  useEffect(() => { setIsLiked(false); }, [currentTrackIndex]);

  // --- HELPERS ---
  const getArtistName = (albumId) => {
     if (!albumId || albums.length === 0) return "Cargando...";
     const album = albums.find(a => String(a.id) === String(albumId));
     if (!album) return "Desconocido";
     const realArtistId = album.artistId || album.artist_id;
     const artist = artists.find(a => String(a.id) === String(realArtistId));
     return artist ? artist.name : "Desconocido"; 
  };

  const getAlbumCover = (albumId) => {
     if (!albumId || albums.length === 0) return null;
     const album = albums.find(a => String(a.id) === String(albumId));
     // Probamos coverUrl (frontend) o cover_url (backend)
     return album ? (album.coverUrl || album.cover_url) : null;
  };

  // --- LÓGICA DE FILTRADO ---
  const getFilteredPlaylist = () => {
      return playlist.filter(track => {
          const artistName = getArtistName(track.albumId || track.album_id).toLowerCase();
          const title = track.title ? track.title.toLowerCase() : "";
          const query = searchQuery.toLowerCase();
          const matchesSearch = title.includes(query) || artistName.includes(query);

          const matchesGenre = selectedGenre === "Todos" || 
                               (track.genre && track.genre.toLowerCase() === selectedGenre.toLowerCase());

          return matchesSearch && matchesGenre;
      });
  };

  const filteredTracks = getFilteredPlaylist();

  // --- HANDLERS ---
  const handleTrackClick = (track) => {
      const originalIndex = playlist.findIndex(t => t.id === track.id);
      if (originalIndex !== -1) {
          setCurrentTrackIndex(originalIndex);
          setIsPlaying(true);
      }
  };

  const handleLike = async () => {
    if (!playlist[currentTrackIndex]) return;
    const currentTrack = playlist[currentTrackIndex];
    
    // Optimistic UI: Marcamos el like inmediatamente
    setIsLiked(true);
    
    try {
      // Usamos el ID real (1001) y Long para el track
      await addLike(CURRENT_USER_ID, currentTrack.id);
      console.log(`❤️ Like registrado: ${currentTrack.id}`);
    } catch (error) {
      console.error("Error like:", error);
      setIsLiked(false); // Revertimos si falla
    }
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
      setIsPlaying(true);
  };
  
  const handlePrev = () => {
      setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
      setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
      if(audioRef.current && audioRef.current.duration) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Sintonizando...</div>;
  if (playlist.length === 0) return <div className="min-h-screen bg-black text-white flex items-center justify-center">No hay canciones disponibles.</div>;

  const currentTrack = playlist[currentTrackIndex];
  const currentCover = getAlbumCover(currentTrack?.albumId || currentTrack?.album_id) || "https://placehold.co/400x400/10b981/ffffff?text=Vinyl";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center py-10 px-4">
      
      {/* HEADER */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold tracking-wider flex items-center justify-center gap-3">
          <Music className="text-emerald-500" size={40} /> RADIO <span className="text-emerald-500">UNDERSOUNDS</span>
        </h1>
      </div>

      {/* REPRODUCTOR */}
      <div className="w-full max-w-4xl bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-zinc-800 p-8 shadow-2xl flex flex-col md:flex-row gap-10 items-center mb-8">
        {/* Disco */}
        <div className="relative w-64 h-64 flex-shrink-0">
           <div className={`w-full h-full rounded-full border-4 border-zinc-800 overflow-hidden shadow-xl relative ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '10s' }}>
              <img 
                src={currentCover} 
                alt="Cover" 
                className="w-full h-full object-cover opacity-90"
                onError={(e) => e.target.src = "https://placehold.co/400x400/333/fff?text=No+Cover"}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-zinc-900 rounded-full border-2 border-zinc-700"></div>
           </div>
        </div>
        {/* Controles */}
        <div className="flex-1 w-full flex flex-col justify-center">
            <div className="text-center md:text-left mb-6">
                <h2 className="text-3xl font-bold text-white truncate">{currentTrack?.title}</h2>
                <p className="text-xl text-emerald-400 mt-1">{getArtistName(currentTrack?.albumId || currentTrack?.album_id)}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400 border border-zinc-700">{currentTrack?.genre || "Sin género"}</span>
            </div>
            {/* Barra */}
            <div className="mb-6">
                <div className="w-full bg-zinc-700 rounded-full h-2 mb-2 cursor-pointer relative"
                     onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        if(audioRef.current) audioRef.current.currentTime = pos * audioRef.current.duration;
                     }}>
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            {/* Botones */}
            <div className="flex items-center justify-center md:justify-start gap-6">
                <button onClick={handlePrev} className="text-zinc-400 hover:text-white"><SkipBack size={32}/></button>
                <button onClick={handlePlayPause} className="w-16 h-16 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                    {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" className="ml-1" />}
                </button>
                <button onClick={handleNext} className="text-zinc-400 hover:text-white"><SkipForward size={32}/></button>
                <button onClick={handleLike} className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ml-4 ${isLiked ? "bg-red-500 border-red-500 text-white" : "border-zinc-600 hover:bg-white/10"}`}>
                   <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
                </button>
                {/* Volumen */}
                <div className="flex items-center gap-2 ml-auto group">
                    <button onClick={() => setVolume(v => v === 0 ? 0.5 : 0)} className="text-zinc-400 group-hover:text-white">
                        {volume === 0 ? <VolumeX size={20}/> : <Volume2 size={20}/>}
                    </button>
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); if(audioRef.current) audioRef.current.volume = parseFloat(e.target.value); }} className="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"/>
                </div>
            </div>
        </div>
      </div>

      {/* --- BARRA DE FILTROS --- */}
      <div className="w-full max-w-4xl mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
         {/* Buscador */}
         <div className="relative w-full md:w-1/2 group">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-500" />
            <input 
                type="text" 
                placeholder="Buscar canción o artista..." 
                className="w-full bg-black border border-zinc-700 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500 transition-colors text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-zinc-500 hover:text-white">
                    <X size={16} />
                </button>
            )}
         </div>
         
         {/* Géneros */}
         <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-hide">
             {["Todos", "Rock", "Pop Rock", "Ballad", "Hard Rock", "Pop", "Indie", "Metal", "Jazz", "Electrónica", "Urbano", "Clásica"].map(genre => (
                 <button 
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${selectedGenre === genre ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"}`}
                 >
                    {genre}
                 </button>
             ))}
         </div>
      </div>

      {/* LISTA FILTRADA */}
      <div className="w-full max-w-4xl">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ListMusic className="text-emerald-500" /> 
            {searchQuery || selectedGenre !== "Todos" ? "Resultados de Búsqueda" : "Cola de Reproducción"}
        </h3>
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 overflow-hidden max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
            {filteredTracks.length > 0 ? filteredTracks.map((track) => {
                const originalIndex = playlist.findIndex(t => t.id === track.id);
                const isActive = originalIndex === currentTrackIndex;
                return (
                    <div 
                        key={track.id} 
                        onClick={() => handleTrackClick(track)}
                        className={`flex items-center p-4 border-b border-zinc-800 hover:bg-white/5 cursor-pointer transition-colors ${isActive ? 'bg-white/10 border-l-4 border-l-emerald-500' : ''}`}
                    >
                        <div className="w-8 text-center text-zinc-500 font-mono text-sm">
                            {isActive ? <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mx-auto"></div> : <Play size={14} className="mx-auto opacity-50" />}
                        </div>
                        <div className="flex-1 px-4 min-w-0">
                            <p className={`font-medium truncate ${isActive ? 'text-emerald-400' : 'text-white'}`}>{track.title}</p>
                            <p className="text-xs text-zinc-500 truncate">
                                {getArtistName(track.albumId || track.album_id)}
                            </p>
                        </div>
                        <div className="text-zinc-500 text-xs px-2 py-1 rounded border border-zinc-800 bg-black/30 mr-4 hidden sm:block">
                            {track.genre || "-"}
                        </div>
                        <div className="text-zinc-500 text-sm font-mono">{track.duration}</div>
                    </div>
                );
            }) : (
                <div className="p-8 text-center text-zinc-500 italic">
                    No se encontraron canciones.
                </div>
            )}
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack ? (currentTrack.fileUrl || currentTrack.file_url) : ""} onTimeUpdate={handleTimeUpdate} onEnded={() => handleNext()} />
    </div>
  );
};

export default Radio;