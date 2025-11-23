import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full"
      >
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido Confirmado!</h1>
        <p className="text-gray-500 mb-8">
            Gracias por apoyar a los artistas independientes. Hemos enviado el recibo a tu correo electrónico.
        </p>

        <div className="space-y-3">
            <button 
                onClick={() => navigate("/")}
                className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
                Volver al Inicio
            </button>
            <button 
                onClick={() => navigate("/marketplace")}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
                Seguir comprando
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationPage;