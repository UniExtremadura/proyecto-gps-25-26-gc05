import React, { useState, useEffect } from 'react';
// IMPORTANTE: Usamos tus nombres de función
import { listPaymentMethods, deletePaymentMethod } from '../api/usersApi'; 
import { CreditCard, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

const PaymentMethods = ({ userId, onSelect, selectedId }) => {
    const [methods, setMethods] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadMethods = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const data = await listPaymentMethods(userId);
            setMethods(data || []);
        } catch (error) {
            console.error("Error cargando tarjetas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMethods();
    }, [userId]);

    const handleDelete = async (id) => {
        if(window.confirm("¿Borrar tarjeta?")) {
            const success = await deletePaymentMethod(userId, id);
            if (success) loadMethods(); // Recargamos la lista si se borró bien
        }
    };

    if (loading) return <p className="text-gray-500 text-sm">Cargando tarjetas...</p>;

    return (
        <div className="space-y-3">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <CreditCard size={20} /> Mis Tarjetas Guardadas
            </h3>
            
            {methods.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No tienes tarjetas guardadas.</p>
            ) : (
                <div className="grid gap-3">
                    {methods.map((method) => (
                        <div 
                            key={method.id} 
                            onClick={() => onSelect(method)}
                            // 2. CORRECCIÓN ACCESIBILIDAD: Hacemos que el div sea navegable
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    onSelect(method);
                                }
                            }}
                            className={`p-4 border rounded-xl cursor-pointer flex justify-between items-center transition-all ${
                                selectedId === method.id 
                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-600">
                                    {method.provider}
                                </div>
                                <div>
                                    <p className="font-mono text-sm font-bold text-gray-800">
                                        •••• {method.numC ? method.numC.slice(-4) : '****'}
                                    </p>
                                    <p className="text-xs text-gray-500">Caduca: {method.cadC}</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(method.id); }}
                                className="text-gray-400 hover:text-red-500 p-2"
                                aria-label="Eliminar tarjeta"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

PaymentMethods.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSelect: PropTypes.func,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PaymentMethods;