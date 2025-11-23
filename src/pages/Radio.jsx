import React, { useState, useEffect, useRef } from "react";
import { getTracks, getArtists, getAlbums } from "../api/contentApi";
import { addLike } from "../api/usersApi"; // Importamos la API de usuarios
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, ListMusic, Heart } from "lucide-react";

const Radio = () => {
  // --- ESTADOS DE DATOS ---
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  // --- ESTADOS DEL REPRODUCTOR ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  
  // --- ESTADOS DE UI ---
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false); // Estado del corazón

  // Referencia al audio HTML5
  const audioRef = useRef(null);

  // 1. Cargar TODO al iniciar (Tracks, Artists, Albums)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Pedimos size=1000 para traer todos los datos
        const [tracksData, artistsData, albumsData] = await Promise.all([
            getTracks(), 
            getArtists(),
            getAlbums(0, 1000)
        ]);
        
        // Filtramos canciones que tengan archivo
        const validTracks = tracksData.filter(t => t.fileUrl || t.file_url);
        
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

  // 2. Controlar el audio cuando cambia la canción o el estado
  useEffect(() => {
    if (playlist.length > 0 && audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        // Promesa para evitar errores de "play() failed because user didn't interact"
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => console.warn("Auto-play prevenido por el navegador:", error));
        }
      }
    }
  }, [currentTrackIndex, playlist]);

  // 3. Resetear el corazón cuando cambia la canción
  useEffect(() => {
      setIsLiked(false); 
      // (Aquí podríamos consultar al backend si ya le dio like, pero por ahora reseteamos)
  }, [currentTrackIndex]);

  // --- HELPERS ---
  const getArtistName = (albumId) => {
     if (!albumId) return "Cargando...";
     if (albums.length === 0 || artists.length === 0) return "Cargando...";

     // 1. Buscar álbum
     const album = albums.find(a => String(a.id) === String(albumId));
     if (!album) return "Álbum desconocido";

     // 2. Buscar artista
     const realArtistId = album.artistId || album.artist_id;
     const artist = artists.find(a => String(a.id) === String(realArtistId));
     
     return artist ? artist.name : "Artista desconocido"; 
  };

  // --- ACCIONES DE USUARIO ---

  const handleLike = async () => {
    // Si no hay canción sonando, no hacemos nada
    if (!playlist[currentTrackIndex]) return;

    const currentTrack = playlist[currentTrackIndex];
    const userId = "1"; // ID temporal hasta que tengamos Login real

    try {
      setIsLiked(true); // Feedback visual inmediato
      await addLike(userId, currentTrack.id);
      console.log(`❤️ Like guardado: Usuario ${userId} -> Canción ${currentTrack.id}`);
    } catch (error) {
      console.error("Error guardando like:", error);
      setIsLiked(false); // Revertimos si falla
      // alert("No se pudo conectar con el servicio de Usuarios (8080)");
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleTimeUpdate = () => {
    if(audioRef.current) {
        const current = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        if(duration > 0) setProgress((current / duration) * 100);
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  // --- RENDERIZADO ---
  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Sintonizando...</div>;
  if (playlist.length === 0) return <div className="min-h-screen bg-black text-white flex items-center justify-center">No hay canciones disponibles.</div>;

  const currentTrack = playlist[currentTrackIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center py-10 px-4">
      
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold tracking-wider flex items-center justify-center gap-3">
          <Music className="text-emerald-500" size={40} /> 
          RADIO <span className="text-emerald-500">UNDERSOUNDS</span>
        </h1>
        <p className="text-zinc-400 mt-2">La mejor música independiente, 24/7</p>
      </div>

      <div className="w-full max-w-4xl bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-zinc-800 p-8 shadow-2xl flex flex-col md:flex-row gap-10 items-center">
        
        {/* Disco Giratorio */}
        <div className="relative w-64 h-64 flex-shrink-0">
           <div className={`w-full h-full rounded-full border-4 border-zinc-800 overflow-hidden shadow-xl relative ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '10s' }}>
              <img 
                src="https://placehold.co/400x400/10b981/ffffff?text=Vinyl" 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-zinc-900 rounded-full border-2 border-zinc-700"></div>
           </div>
        </div>

        {/* Info y Controles */}
        <div className="flex-1 w-full flex flex-col justify-center">
            <div className="text-center md:text-left mb-6">
                <h2 className="text-3xl font-bold text-white truncate">{currentTrack.title}</h2>
                
                <p className="text-xl text-emerald-400 mt-1">
                    {getArtistName(currentTrack.albumId || currentTrack.album_id)}
                </p>
                
                <span className="inline-block mt-2 px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400 border border-zinc-700">
                    {currentTrack.genre || "Sin género"}
                </span>
            </div>

            <div className="mb-6">
                <div className="w-full bg-zinc-700 rounded-full h-2 mb-2 cursor-pointer relative">
                    <div className="bg-emerald-500 h-2 rounded-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between text-xs text-zinc-500 font-mono">
                    <span>0:00</span>
                    <span>{currentTrack.duration}</span>
                </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-6">
                <button onClick={handlePrev} className="text-zinc-400 hover:text-white transition-colors"><SkipBack size={32}/></button>
                
                <button onClick={handlePlayPause} className="w-16 h-16 bg-emerald-500 hover:bg-emerald-400 text-black rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105">
                    {isPlaying ? <Pause size={32} fill="black" /> : <Play size={32} fill="black" ml-1 />}
                </button>
                
                <button onClick={handleNext} className="text-zinc-400 hover:text-white transition-colors"><SkipForward size={32}/></button>
                
                {/* Botón de LIKE */}
                <button 
                   onClick={handleLike}
                   className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all ml-4 ${
                       isLiked 
                       ? "bg-red-500 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
                       : "border-zinc-600 hover:bg-white/10 hover:border-white text-white"
                   }`}
                   title="Me gusta"
                >
                   <Heart className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} />
                </button>

                {/* Volumen */}
                <div className="flex items-center gap-2 ml-auto group">
                    <button onClick={() => setVolume(v => v === 0 ? 0.5 : 0)} className="text-zinc-400 group-hover:text-white">
                        {volume === 0 ? <VolumeX size={20}/> : <Volume2 size={20}/>}
                    </button>
                    <input 
                        type="range" min="0" max="1" step="0.01" 
                        value={volume} 
                        onChange={(e) => {
                            setVolume(parseFloat(e.target.value));
                            if(audioRef.current) audioRef.current.volume = parseFloat(e.target.value);
                        }}
                        className="w-20 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Lista "A continuación" */}
      <div className="w-full max-w-4xl mt-12">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ListMusic className="text-emerald-500" /> A continuación
        </h3>
        <div className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 overflow-hidden max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
            {playlist.map((track, index) => (
                <div 
                    key={track.id} 
                    onClick={() => { setCurrentTrackIndex(index); setIsPlaying(true); }}
                    className={`flex items-center p-4 border-b border-zinc-800 hover:bg-white/5 cursor-pointer transition-colors ${index === currentTrackIndex ? 'bg-white/10 border-l-4 border-l-emerald-500' : ''}`}
                >
                    <div className="w-8 text-center text-zinc-500 font-mono text-sm">
                        {index === currentTrackIndex ? <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mx-auto"></div> : index + 1}
                    </div>
                    <div className="flex-1 px-4">
                        <p className={`font-medium ${index === currentTrackIndex ? 'text-emerald-400' : 'text-white'}`}>{track.title}</p>
                        <p className="text-xs text-zinc-500">
                            {getArtistName(track.albumId || track.album_id)}
                        </p>
                    </div>
                    <div className="text-zinc-500 text-sm font-mono">{track.duration}</div>
                </div>
            ))}
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack ? (currentTrack.fileUrl || currentTrack.file_url) : ""} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
    </div>
  );
};

export default Radio;