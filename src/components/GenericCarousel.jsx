import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Aceptamos una nueva prop: onItemClick
const GenericCarousel = ({ items, title, onItemClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = window.innerWidth < 768 ? 1 : 4; 
  const totalSlides = Math.ceil(items.length / itemsPerView);

  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));

  return (
    <div className="relative w-full py-8">
      {title && <h2 className="text-2xl font-bold text-gray-800 mb-6 px-4 border-l-4 border-blue-500">{title}</h2>}
      
      <div className="overflow-hidden px-4">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
             <div key={slideIndex} className="w-full flex-shrink-0 flex gap-6">
                {items.slice(slideIndex * itemsPerView, (slideIndex + 1) * itemsPerView).map((item) => (
                    <div 
                        key={item.id} 
                        // AQUI ESTÁ EL CAMBIO: Si hay función onItemClick, la ejecutamos
                        onClick={() => onItemClick && onItemClick(item)}
                        className="flex-1 min-w-0 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1"
                    >
                        <div className="h-48 overflow-hidden">
                            <img 
                                src={item.image || 'https://placehold.co/400x300?text=No+Image'} 
                                alt={item.name || item.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg truncate text-gray-900">{item.name || item.title}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description || item.price}</p>
                            {item.date && <p className="text-xs text-blue-600 mt-2 font-medium">{item.date}</p>}
                        </div>
                    </div>
                ))}
             </div>
          ))}
        </div>
      </div>

      <button onClick={prevSlide} className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white border border-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 transition-all">
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      <button onClick={nextSlide} className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white border border-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 transition-all">
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};

export default GenericCarousel;