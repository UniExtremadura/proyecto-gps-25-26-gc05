import React, { useState } from "react";
import { registerUser, loginUser } from "../api/usersApi";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState("");

  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const recaptchaRegister = await grecaptcha.execute(
        "6LfVjAosAAAAAAwLXxQHCLTsM_jUxL8eKw-4H53z",
        { action: "submit" }
      );

      const ok = await registerUser({
        email,
        password,
        rol,
        recaptchaToken: recaptchaRegister
      });

      if (!ok) {
        setError("Error registrando usuario");
        setLoading(false);
        return;
      }

      const recaptchaLogin = await grecaptcha.execute(
        "6LfVjAosAAAAAAwLXxQHCLTsM_jUxL8eKw-4H53z",
        { action: "login" }
      );

      const { token, userId } = await loginUser({
        email,
        password,
        recaptchaToken: recaptchaLogin
      });

      login({ token, userId });
      navigate("/profile");

    } catch (err) {
      console.error(err);
      setError("Error registrando usuario");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-20 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-2xl border border-gray-200"
      >
        <h2 className="font-extrabold text-4xl mb-8 text-center text-gray-900 tracking-tight">
          Crear cuenta
        </h2>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-lg">Email</label>
          <input
            type="email"
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-black focus:border-black text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-lg">Password</label>
          <input
            type="password"
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-black text-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-8">
          <label className="block mb-2 font-medium text-lg">Rol</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-black text-lg"
          >
            <option value="">Selecciona rol</option>
            <option value="usuario">Usuario</option>
            <option value="artista">Artista</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-center mb-4 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition active:scale-[0.98]"
        >
          {loading ? "Creando..." : "Registrarse"}
        </button>
      </form>
    </div>

  );
};

export default Register;

