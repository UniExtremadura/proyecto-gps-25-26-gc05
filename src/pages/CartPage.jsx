import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

//Carrito de la compra
const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Calcular total
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu cesta está vacía</h2>
            <p className="text-gray-500 mb-8">Parece que aún no has añadido música a tu colección.</p>
            <button 
                onClick={() => navigate("/marketplace")}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
                Ir al Marketplace
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cesta de Compra ({cart.length})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LISTA DE PRODUCTOS (Izquierda) */}
            <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-center transition-shadow hover:shadow-md">
                        {/* Imagen */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            <img 
                                src={item.img || 'https://placehold.co/100'} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">{item.title}</h3>
                            <p className="text-sm text-gray-500">Formato digital</p>
                            <p className="text-blue-600 font-bold mt-1">{item.price} €</p>
                        </div>

                        {/* Controles */}
                        <div className="flex flex-col items-end gap-3">
                            <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-400 hover:text-red-600 p-1"
                            >
                                <Trash2 size={18} />
                            </button>
                            
                            <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                                <button 
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-black disabled:opacity-50"
                                    disabled={item.quantity <= 1}
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                <button 
                                    onClick={() => updateQuantity(item.id, 1)}
                                    className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-black"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* RESUMEN DE PEDIDO (Derecha) */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-24">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen</h2>
                    
                    <div className="space-y-3 text-gray-600 mb-6 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{total.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Impuestos (21%)</span>
                            <span>{(total * 0.21).toFixed(2)} €</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span>{(total * 1.21).toFixed(2)} €</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate("/checkout")}
                        className="w-full bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all transform hover:scale-[1.02]"
                    >
                        Tramitar Pedido <ArrowRight size={18} />
                    </button>
                    
                    <p className="text-xs text-gray-400 text-center mt-4">
                        Pagos seguros encriptados con SSL
                    </p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default CartPage;