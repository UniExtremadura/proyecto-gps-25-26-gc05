// src/components/Button.js
import React from 'react';
import PropTypes from 'prop-types';

//Botones
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '', 
  icon: Icon, 
  ...props 
}) => {
  
  // Definición de estilos según el diseño de UnderSounds
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md border border-transparent', // Acciones principales
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 border border-transparent', // Botones secundarios/cancelar
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md border border-transparent', // Eliminar del carrito
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-md border border-transparent', // Botón de comprar/pagar
    dark: 'bg-gray-900 hover:bg-gray-800 text-white shadow-md border border-transparent', // Estilo navbar/footer
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-transparent', // Botones sutiles (perfil/editar)
    outline: 'bg-transparent border-2 border-gray-300 hover:border-blue-500 text-gray-500 hover:text-blue-500' // Estilo UploadCard
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base', // Tamaño estándar
    lg: 'px-6 py-3 text-lg'     // Usado en Login y Carrito
  };

  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center 
        font-semibold rounded-lg transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary} 
        ${sizes[size] || sizes.md} 
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className={`w-5 h-5 ${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'dark', 'ghost', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  icon: PropTypes.elementType,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

export default Button;