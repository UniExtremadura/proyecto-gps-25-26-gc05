import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { CreditCard, Lock } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { clearCart, cart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calcular total de nuevo para mostrarlo
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 1.21;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulamos un proceso de red de 2 segundos
    setTimeout(() => {
      clearCart(); // Vaciamos el carrito
      navigate("/confirmacion"); // Vamos a éxito
    }, 2000);
  };

  if (cart.length === 0) {
      navigate("/cart");
      return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center items-center">
      <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl">
        
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Pago Seguro</h1>
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                <Lock size={14} /> Encriptado
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre en la tarjeta</label>
                <input type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Ej. Juan Pérez" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                <div className="relative">
                    <input type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="0000 0000 0000 0000" />
                    <CreditCard className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caducidad</label>
                    <input type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="MM/AA" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input type="text" required className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="123" />
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-600">Total a pagar</span>
                    <span className="text-2xl font-bold text-gray-900">{total.toFixed(2)} €</span>
                </div>

                <button 
                    type="submit" 
                    disabled={isProcessing}
                    className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                        isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                    }`}
                >
                    {isProcessing ? 'Procesando...' : 'Pagar Ahora'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;