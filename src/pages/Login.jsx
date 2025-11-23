// src/pages/Login.jsx
import React, { useState } from 'react';
import { loginUser } from '../api/usersApi';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';


const RECAPTCHA_SITE_KEY = '6LfVjAosAAAAAAwLXxQHCLTsM_jUxL8eKw-4H53z';

const getRecaptchaToken = (action) =>
  new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      return reject(new Error('reCAPTCHA no cargado'));
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action })
        .then(resolve)
        .catch(reject);
    });
  });


const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        // 1) Obtener token de reCAPTCHA real
        const recaptchaToken = await getRecaptchaToken('login');

        // 2) Hacer login enviando el token al backend
        const { token, userId } = await loginUser({ email, password, recaptchaToken });
        //console.log("✅ LOGIN OK EN FRONT:", token, userId);    

        // 3) Guardar en contexto
        login({ token, userId });

        alert("Login correcto");
        

        // (Luego redirigiremos a /profile)
        navigate("/profile");
    } catch (err) {
        console.error(err);
        setError('Login incorrecto o error en el servidor');
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 max-w-sm w-full"
      >
        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>

        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
          <input
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block text-gray-700 text-sm font-bold mb-4">
          Password
          <input
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white font-bold py-2 px-4 rounded w-full"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
