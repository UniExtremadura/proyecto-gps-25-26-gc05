import React, { useState } from "react";
import { Calendar, User, ArrowRight, Mail, CheckCircle } from "lucide-react";


// --- TUS DATOS NUEVOS ---
const mockNews = [
  { 
    id: 1, 
    title: "Nuevo Álbum de Extremoduro", 
    description: "La banda legendaria regresa con material inédito. Analizamos cada pista de este lanzamiento histórico.",
    image: "https://tiendawarnermusic.es/cdn/shop/files/5021732523617.webp?v=1737741122",
    author: "Robe Fan",
    date: "20 Nov 2025",
    category: "Lanzamientos"
  },
  { 
    id: 2, 
    title: "Entrevista Exclusiva", 
    description: "Hablamos con los productores del momento sobre el futuro de la industria musical independiente.",
    image: "https://i.ytimg.com/vi/5sOTynHnAIQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA3EE193Se6swL9GrUZAIppYu59qQ",
    author: "Carlos Ruiz",
    date: "18 Nov 2025",
    category: "Entrevistas"
  },
  { 
    id: 3, 
    title: "Top 10 Vinilos del Mes", 
    description: "Los discos más vendidos en nuestra tienda. Descubre qué joyas analógicas están marcando tendencia.",
    image: "https://i.ytimg.com/vi/yAoaunNXe54/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCmFvydHrTI_pKOCKBi1NgT13LzEw",
    author: "Laura M.",
    date: "15 Nov 2025",
    category: "Tendencias"
  },
  { 
    id: 4, 
    title: "Guía de Festivales 2025", 
    description: "Todo lo que necesitas saber para este verano. Fechas, carteles y consejos de supervivencia.",
    image: "https://musicanueva.es/wp-content/uploads/2025/07/Guia-de-festivales-agosto-Espana-y-Portugal.jpg",
    author: "David Tech",
    date: "10 Nov 2025",
    category: "Eventos"
  }
];

//Añadidos campos a la Newsletter, accesibilidad
const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.includes("@")) {
      console.log("Suscrito con:", email);
      setSubscribed(true);
      setEmail("");
    }
  };

  // La primera noticia será la destacada (grande)
  const featuredNews = mockNews[0];
  // El resto serán las secundarias
  const otherNews = mockNews.slice(1);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
      {/* CABECERA / NOTICIA DESTACADA */}
      <div className="bg-black text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <span className="text-emerald-500 font-bold tracking-wide uppercase text-sm">Noticia Destacada</span>
                <h1 className="text-4xl md:text-6xl font-bold mt-2 mb-6 leading-tight">{featuredNews.title}</h1>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                    <img 
                        src={featuredNews.image} 
                        alt={featuredNews.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-white">{featuredNews.category}</span>
                        <div className="flex items-center gap-1"><Calendar size={16}/> {featuredNews.date}</div>
                        <div className="flex items-center gap-1"><User size={16}/> {featuredNews.author}</div>
                    </div>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        {featuredNews.description}
                    </p>
                    <button className="flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors group">
                        Leer artículo completo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* GRID DE NOTICIAS SECUNDARIAS */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 border-l-4 border-blue-600 pl-4">Últimas Novedades</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherNews.map((news) => (
                <div key={news.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col h-full group cursor-pointer">
                    <div className="h-48 overflow-hidden">
                        <img 
                            src={news.image} 
                            alt={news.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    <div className="p-6 flex flex-col flex-grow justify-between">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-blue-600 text-xs font-bold uppercase">{news.category}</span>
                                <span className="text-gray-400 text-xs">{news.date}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{news.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-3">{news.description}</p>
                        </div>
                        <button className="text-sm font-semibold text-gray-900 mt-4 self-start hover:underline flex items-center gap-1">
                            Leer más <ArrowRight size={14}/>
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* FORMULARIO DE SUSCRIPCIÓN */}
      <div className="max-w-4xl mx-auto px-6 mt-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
                <Mail className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                <h2 className="text-3xl font-bold mb-4">Suscríbete a nuestra Newsletter</h2>
                <p className="text-blue-100 mb-8 max-w-lg mx-auto">
                    Recibe las últimas noticias, lanzamientos exclusivos y descuentos especiales directamente en tu bandeja de entrada.
                </p>

                {subscribed ? (
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl inline-flex items-center gap-3 text-white animate-bounce">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <span className="font-semibold">¡Gracias por suscribirte! Revisa tu correo.</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input 
                            type="email" 
                            placeholder="tucorreo@ejemplo.com" 
                            className="flex-1 px-5 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-shadow"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button 
                            type="submit" 
                            className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-lg"
                        >
                            Suscribirse
                        </button>
                    </form>
                )}
            </div>
        </div>
      </div>

    </div>
  );
};

export default NewsLetter;