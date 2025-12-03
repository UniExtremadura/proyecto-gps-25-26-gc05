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
      const recaptchaToken = await getRecaptchaToken('login');
      const { token, userId } = await loginUser({ email, password, recaptchaToken });

      login({ token, userId });
      navigate("/profile");

    } catch (err) {
      console.error(err);
      setError('Login incorrecto o error en el servidor');
    } finally {
      setLoading(false);
    }
  };

  //Añadidas validaciones de formularios
  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg shadow-2xl rounded-2xl p-10 border border-gray-200"
      >
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 tracking-tight">
          Iniciar sesión
        </h1>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700 text-lg">Email</label>
          <input
            type="email"
            className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 focus:border-black focus:ring-2 focus:ring-black outline-none text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-8">
          <label className="block mb-2 font-medium text-gray-700 text-lg">Password</label>
          <input
            type="password"
            className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 focus:border-black focus:ring-2 focus:ring-black outline-none text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-red-600 text-center text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition active:scale-[0.98]"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>

  );
};

//git commit -m "GC05-103 UI botón “Cerrar sesión”"

export default Login;

