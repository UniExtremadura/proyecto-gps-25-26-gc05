import React from "react";
import { Link } from "react-router-dom";
// CAMBIO AQUÍ: De 'Cassette' a 'CassetteTape'
import { Disc, Mic, CassetteTape, Shirt } from "lucide-react"; 

const categories = [
  { id: 1, name: "Vinilo", icon: Disc, color: "bg-amber-100 text-amber-600" },
  { id: 2, name: "CD", icon: Mic, color: "bg-blue-100 text-blue-600" }, 
  { id: 3, name: "Cassette", icon: CassetteTape, color: "bg-pink-100 text-pink-600" },
  { id: 4, name: "Merch", icon: Shirt, color: "bg-purple-100 text-purple-600" },
];

const ProductCategories = () => {

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
      {categories.map((cat) => (
        // 2. Usamos Link directamente
        <Link
          key={cat.id}
          to={`/marketplace?category=${encodeURIComponent(cat.name)}`} // <--- Aquí va la ruta
          className="cursor-pointer group flex flex-col items-center"
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 mb-3 ${cat.color}`}>
             <cat.icon size={40} />
          </div>
          <p className="text-lg font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
            {cat.name}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ProductCategories;