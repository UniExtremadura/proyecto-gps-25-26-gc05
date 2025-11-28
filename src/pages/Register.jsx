// /* global grecaptcha */
// import React, { useState } from "react";
// import { registerUser } from "../api/usersApi";

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const recaptchaToken = await grecaptcha.execute(
//         "6LfVjAosAAAAAAwLXxQHCLTsM_jUxL8eKw-4H53z", // TU SITE KEY
//         { action: "submit" }
//       );

//       const ok = await registerUser({
//         email,
//         password,
//         rol: "usuario",
//         recaptchaToken
//       });

//       if (ok) {
//         alert("Usuario creado correctamente");
//         window.location.href = "/login";
//       } else {
//         setError("El servidor rechazó el registro");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Error registrando usuario");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-white">
//       <form onSubmit={handleSubmit} className="w-80 p-6 shadow-lg rounded-lg bg-gray-50">
//         <h2 className="font-bold text-xl mb-4">Crear cuenta</h2>

//         <label>Email</label>
//         <input
//           type="email"
//           className="w-full p-2 border mb-3"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <label>Password</label>
//         <input
//           type="password"
//           className="w-full p-2 border mb-3"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-black text-white p-2 rounded-md"
//         >
//           {loading ? "Creando..." : "Registrarse"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;


import React, { useState } from "react";
import { registerUser, loginUser } from "../api/usersApi";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TOKEN PARA REGISTRO
      const recaptchaRegister = await grecaptcha.execute(
        "6LfVjAosAAAAAAwLXxQHCLTsM_jUxL8eKw-4H53z",
        { action: "submit" }
      );

      const ok = await registerUser({
        email,
        password,
        rol: "usuario",
        recaptchaToken: recaptchaRegister
      });

      if (!ok) {
        setError("Error registrando usuario");
        setLoading(false);
        return;
      }

      // TOKEN PARA LOGIN
      const recaptchaLogin = await grecaptcha.execute(
        "6LfVjAosAAAAAAwLXxQHCLTsM_jUxL8eKw-4H53z",
        { action: "login" }
      );

      // LOGIN AUTOMÁTICO
      const { token, userId } = await loginUser({
        email,
        password,
        recaptchaToken: recaptchaLogin
      });

      // GUARDAR SESIÓN
      login({ token, userId });

      // IR AL PERFIL
      navigate("/profile");

    } catch (err) {
      console.error(err);
      setError("Error registrando usuario");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="w-80 p-6 shadow-lg rounded-lg bg-gray-50">
        <h2 className="font-bold text-xl mb-4">Crear cuenta</h2>

        <label>Email</label>
        <input
          type="email"
          className="w-full p-2 border mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          className="w-full p-2 border mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded-md"
        >
          {loading ? "Creando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default Register;

