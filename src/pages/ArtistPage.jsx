import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// 1. API Contenidos (Datos estáticos y Fallback)
import { getArtistById, getArtistAlbums, getArtistTracks } from '../api/contentApi';

// 2. API Recomendaciones (Datos inteligentes)
import { getArtistTopTracks } from '../api/recommendationApi';

import { User } from 'lucide-react';

const ArtistPage = () => {
    const { id } = useParams(); 
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadArtistData = async () => {
            try {
                setLoading(true);
                
                // --- 1. CARGA BÁSICA (Contenidos) ---
                const artistData = await getArtistById(id);
                setArtist(artistData);

                const albumsData = await getArtistAlbums(id);
                setAlbums(albumsData);

                // --- 2. CARGA DE TOP TRACKS (Inteligente) ---
                let tracksData = [];
                
                try {
                    // Intento A: Pedir los más escuchados a Recomendaciones (Python)
                    // (Esto devolverá la lista con el campo 'score' o 'plays')
                    tracksData = await getArtistTopTracks(id);
                } catch (err) {
                    console.warn("Microservicio recomendaciones falló, usando fallback.");
                }

                // Si Python devuelve vacío (nadie lo ha escuchado) o falló la petición...
                if (!tracksData || tracksData.length === 0) {
                    console.log("⚠️ Sin métricas. Mostrando canciones por defecto.");
                    // Intento B: Pedir todas las canciones a Contenidos (Java) como respaldo
                    tracksData = await getArtistTracks(id);
                }

                // Guardamos las 10 primeras (ya sean las top o las normales)
                setTopTracks(tracksData ? tracksData.slice(0, 10) : []);
                
                setLoading(false);

            } catch (error) {
                console.error("Error cargando datos del artista:", error);
                setLoading(false);
            }
        };

        if (id) {
            loadArtistData();
        }
    }, [id]);

    if (loading) return <div className="p-10 text-white text-center">Cargando perfil...</div>;
    if (!artist) return <div className="p-10 text-white text-center">Artista no encontrado</div>;

    // Lógica de foto de perfil (usar la del primer álbum si no hay avatar)
    const artistImage = albums.length > 0 ? (albums[0].cover_url || albums[0].coverUrl) : null;

    return (
        <div className="min-h-screen bg-black text-white font-sans pb-20">
            
            {/* --- CABECERA DEL ARTISTA --- */}
            <div className="relative h-80 bg-gradient-to-b from-zinc-800 to-black flex items-end p-8">
                <div className="flex items-end gap-6 z-10">
                     
                     {/* Avatar Circular */}
                     <div className="w-52 h-52 rounded-full overflow-hidden shadow-2xl bg-zinc-700 flex items-center justify-center border-4 border-black relative">
                        {artistImage ? (
                            <img 
                                src={artistImage} 
                                alt={artist.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex'; 
                                }}
                            />
                        ) : null}
                        {/* Icono de respaldo si falla la imagen */}
                        <div className={`absolute inset-0 flex items-center justify-center bg-zinc-700 ${artistImage ? 'hidden' : ''}`}>
                             <User size={80} className="text-zinc-500" />
                        </div>
                    </div>

                    {/* Info de Texto */}
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">Verificado</span>
                            Artista
                        </p>
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">{artist.name}</h1>
                        <p className="text-zinc-400 text-lg max-w-2xl line-clamp-2">
                            {artist.genre} • {artist.description || "Sin descripción disponible."}
                        </p>
                    </div>
                </div>
                 
                 {/* Fondo difuminado (Efecto visual) */}
                 {artistImage && (
                    <div className="absolute inset-0 opacity-30 blur-3xl">
                        <img src={artistImage} className="w-full h-full object-cover" alt="" />
                    </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-8 space-y-12 relative z-10">
                
                {/* --- SECCIÓN POPULARES --- */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Populares</h2>
                    <div className="bg-zinc-900/50 rounded-xl p-2">
                        {topTracks.length > 0 ? (
                            topTracks.map((track, index) => (
                                <div key={track.id} className="flex items-center p-3 hover:bg-white/10 rounded-md group transition-colors cursor-default">
                                    <span className="w-8 text-center text-zinc-500 font-mono group-hover:text-white">{index + 1}</span>
                                    
                                    <div className="flex-1 px-4 font-medium text-white flex items-center gap-3">
                                        <img 
                                            src={artistImage || 'https://placehold.co/40'} 
                                            className="w-10 h-10 rounded object-cover opacity-80" 
                                            alt="" 
                                        />
                                        {track.title}
                                    </div>
                                    
                                    {/* Si viene de Python, tiene 'score' o 'plays'. Si no, no mostramos nada extra. */}
                                    {(track.score || track.plays) && (
                                        <span className="text-xs text-emerald-500 mr-4 font-mono hidden sm:block">
                                            {track.score || track.plays} reprod.
                                        </span>
                                    )}
                                    
                                    <span className="text-zinc-500 text-sm font-mono">{track.duration || "--:--"}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-500 italic p-4">Este artista aún no tiene canciones.</p>
                        )}
                    </div>
                </section>

                {/* --- SECCIÓN DISCOGRAFÍA --- */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Discografía</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {albums.map(album => (
                            <div key={album.id} className="bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 transition-all cursor-pointer group hover:-translate-y-1 duration-300">
                                <div className="relative aspect-square mb-4 rounded-lg overflow-hidden shadow-lg bg-zinc-800 flex items-center justify-center">
                                     <img 
                                        src={album.cover_url || album.coverUrl || 'https://placehold.co/300x300?text=No+Cover'} 
                                        alt={album.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => e.target.src = 'https://placehold.co/300x300?text=Error'} 
                                    />
                                </div>
                                <h3 className="font-bold text-white truncate">{album.title}</h3>
                                <p className="text-zinc-500 text-sm mt-1 flex justify-between">
                                    <span>{album.release_date ? album.release_date.substring(0, 4) : 'Año desc.'}</span>
                                    <span>• Álbum</span>
                                </p>
                            </div>
                        ))}
                    </div>
                     {albums.length === 0 && <p className="text-zinc-500 italic">Este artista aún no tiene álbumes publicados.</p>}
                </section>

            </div>
        </div>
    );
};

export default ArtistPage;