import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext"; 
import { createPaymentMethod } from "../api/usersApi"; 
import PaymentMethods from "../components/PaymentMethods"; 
import { CreditCard, Lock, Save } from "lucide-react";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { clearCart, cart } = useCart();
  const { user } = useUser(); 

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSavedCard, setSelectedSavedCard] = useState(null); 
  const [saveNewCard, setSaveNewCard] = useState(false);

  const [newCard, setNewCard] = useState({
      name: "",
      numC: "",
      cadC: "",
      cvv: "",
      provider: "VISA" 
  });

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 1.21;

  // Protección de ruta
  useEffect(() => {
      if (cart.length === 0) {
          navigate("/cart");
      } else if (!user) { 
          if(window.confirm("Debes iniciar sesión para tramitar el pedido. ¿Ir al login?")) {
              navigate("/login?form=login");
          } else {
              navigate("/cart");
          }
      }
  }, [cart, user, navigate]);

  if (!user || cart.length === 0) return null;

  const handleInputChange = (e) => {
      if (selectedSavedCard) setSelectedSavedCard(null);
      setNewCard({ ...newCard, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
        if (!selectedSavedCard && saveNewCard) {
            // CAMBIO AQUÍ: Usamos user.userId
            await createPaymentMethod(user.userId, {
                provider: newCard.provider,
                numC: newCard.numC,
                cadC: newCard.cadC,
                cvv: newCard.cvv
            });
            console.log("💳 Tarjeta guardada para usuario:", user.userId);
        }

        setTimeout(() => {
          alert("¡Compra realizada correctamente! Gracias por tu pedido.");
          clearCart();
          navigate("/confirmacion");
        }, 2000);

    } catch (error) {
        console.error("Error en el pago:", error);
        alert("Hubo un error procesando el pago.");
        setIsProcessing(false);
    }
  };

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

            {/* Selector de Tarjetas Guardadas */}
            <div className="mb-8">
                <PaymentMethods 
                    userId={user.userId} // CAMBIO AQUÍ TAMBIÉN
                    selectedId={selectedSavedCard?.id}
                    onSelect={(card) => {
                        setSelectedSavedCard(card);
                        setNewCard({ ...newCard, numC: card.numC, cadC: card.cadC, cvv: "" });
                    }}
                />
            </div>

            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">O usa una nueva</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Formulario Nueva Tarjeta */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* ... (Inputs igual que antes) ... */}
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
                            required 
                            placeholder="123"
                        />
                    </div>
                </div>

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