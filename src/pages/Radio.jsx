import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { createPaymentMethod } from "../api/usersApi"; // Tu función de API
import PaymentMethods from "../components/PaymentMethods"; // Tu componente de lista
import { CreditCard, Lock, Save } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { clearCart, cart } = useCart();
  
  // --- 1. OBTENER USUARIO REAL ---
  const currentUserId = localStorage.getItem("userId");

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSavedCard, setSelectedSavedCard] = useState(null); 
  const [saveNewCard, setSaveNewCard] = useState(false);

  // Formulario de nueva tarjeta
  const [newCard, setNewCard] = useState({
      name: "",
      numC: "",
      cadC: "",
      cvv: "",
      provider: "VISA" 
  });

  // Calculamos total con IVA
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 1.21;

  // --- 2. PROTECCIÓN DE RUTA ---
  useEffect(() => {
      if (cart.length === 0) {
          navigate("/cart");
      } else if (!currentUserId) {
          // Si no está logueado, mandamos al login y luego que vuelva aquí
          if(window.confirm("Debes iniciar sesión para tramitar el pedido. ¿Ir al login?")) {
              navigate("/login?form=login");
          } else {
              navigate("/cart");
          }
      }
  }, [cart, currentUserId, navigate]);

  if (!currentUserId || cart.length === 0) return null; // Evita renderizar si no hay datos

  const handleInputChange = (e) => {
      if (selectedSavedCard) setSelectedSavedCard(null);
      setNewCard({ ...newCard, [e.target.name]: e.target.value });
  };

  const goToArtistProfile = (albumId) => {
     if (!albumId || albums.length === 0) return;
     
     // Buscamos el álbum para sacar el ID del artista
     const album = albums.find(a => String(a.id) === String(albumId));
     
     if (album) {
         const realArtistId = album.artistId || album.artist_id;
         if (realArtistId) {
             navigate(`/artist/${realArtistId}`);
         }
     }
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
    // 1. Validación de seguridad
    if (!user?.userId) {
      alert("Debes iniciar sesión para dar Like ❤️");
      return;
    }

    if (!playlist[currentTrackIndex]) return;
    const currentTrack = playlist[currentTrackIndex];

    // 2. Si ya está marcado visualmente, no hacemos nada (doble seguridad)
    if (isLiked) return;

    // 3. Optimistic UI: Lo marcamos INMEDIATAMENTE
    setIsLiked(true);

    try {
      await addLike(user.userId, currentTrack.id);
      console.log(`❤️ Like registrado: ${currentTrack.id}`);
    } catch (error) {
      console.error("El like ya existía o hubo error:", error);
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-start">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* COLUMNA IZQUIERDA: DATOS DE PAGO */}
        <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Pago Seguro</h1>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                    <Lock size={14} /> SSL Encrypted
                </div>
            </div>

            {/* Selector de Tarjetas Guardadas (Con ID Real) */}
            <div className="mb-8">
                <PaymentMethods 
                    userId={currentUserId} 
                    selectedId={selectedSavedCard?.id}
                    onSelect={(card) => {
                        setSelectedSavedCard(card);
                        // Rellenamos visualmente (el CVV no se rellena por seguridad)
                        setNewCard({ ...newCard, numC: card.numC, cadC: card.cadC, cvv: "" });
                    }}
                />
            </div>

            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">O usa una nueva</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titular</label>
                    <input 
                        type="text" name="name"
                        value={newCard.name} onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                        required={!selectedSavedCard} 
                        disabled={!!selectedSavedCard}
                        placeholder="Nombre Apellidos"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                    <div className="relative">
                        <input 
                            type="text" name="numC"
                            value={newCard.numC} onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 outline-none" 
                            required={!selectedSavedCard}
                            disabled={!!selectedSavedCard}
                            placeholder="0000 0000 0000 0000"
                        />
                        <CreditCard className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Caducidad</label>
                        <input 
                            type="text" name="cadC"
                            value={newCard.cadC} onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                            required={!selectedSavedCard}
                            disabled={!!selectedSavedCard}
                            placeholder="MM/AA"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input 
                            type="text" name="cvv"
                            value={newCard.cvv} onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                            required // Siempre pedimos el CVV
                            placeholder="123"
                        />
                    </div>
                </div>

                {/* Checkbox Guardar (Solo si es nueva) */}
                {!selectedSavedCard && (
                    <div className="flex items-center gap-2 mt-2">
                        <input 
                            type="checkbox" 
                            id="saveCard" 
                            checked={saveNewCard} 
                            onChange={(e) => setSaveNewCard(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="saveCard" className="text-sm text-gray-700 cursor-pointer flex items-center gap-1">
                            <Save size={14} /> Guardar esta tarjeta para futuras compras
                        </label>
                    </div>
                )}

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isProcessing}
                        className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform hover:scale-[1.02] ${
                            isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isProcessing ? 'Procesando...' : `Pagar ${total.toFixed(2)} €`}
                    </button>
                </div>
            </form>
        </div>

        {/* COLUMNA DERECHA: RESUMEN */}
        <div className="bg-gray-100 p-8 rounded-2xl h-fit border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Tu Pedido</h2>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                            <span className="bg-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-gray-500 shadow-sm">
                                {item.quantity}
                            </span>
                            <span className="text-gray-700 truncate max-w-[150px]">{item.title}</span>
                        </div>
                        <span className="font-mono font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-300 pt-4 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total (inc. IVA)</span>
                <span className="text-2xl font-bold text-blue-600">{total.toFixed(2)} €</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;