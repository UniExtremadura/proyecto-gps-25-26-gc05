import axios from 'axios';

// Instancia para el Microservicio de Usuarios (Puerto 8080)
const usersApi = axios.create({
  baseURL: 'http://localhost:8080',
  // CORRECCIÓN 1: withCredentials va AQUÍ, no dentro de headers
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/* ========= AUTH ========= */

export const registerUser = async ({ email, password, rol, recaptchaToken }) => {
  const body = {
    email,
    password,
    rol,
    recaptchaToken
  };

  await usersApi.post(
    '/users/auth/register',
    body,
    {
      headers: {
        "X-Recaptcha-Token": recaptchaToken
      }
    }
  );

  return true;
};

export const loginUser = async ({ email, password, recaptchaToken }) => {
  const headers = {};

  // Solo añadimos reCAPTCHA si realmente existe Y NO es null
  if (recaptchaToken && recaptchaToken !== "null") {
    headers["X-Recaptcha-Token"] = recaptchaToken;
  }

  const res = await usersApi.post(
    "/users/auth/login",
    { email, password },
    { headers }
  );

  // CORRECCIÓN 2: Ya no leemos el token (está oculto en la cookie)
  // Solo leemos el ID para saber que el login fue exitoso y quién es el usuario.
  const userId = res.headers["x-user-id"] || res.headers["X-User-Id"];

  if (!userId) {
      throw new Error("Login incompleto: El servidor no devolvió ID de usuario.");
  }

  // Devolvemos solo el ID. El token ya está guardado en el navegador.
  return { userId, success: true };
};

export const logoutUser = async () => {
  try {
    const res = await usersApi.post('/users/auth/logout');
    return res.status === 200;
  } catch (error) {
    console.error("Error en logout:", error);
    return false;
  }
};

/* ========= PERFIL ========= */

export const getUserProfile = async (userId) => {
  console.log("Intentando obtener perfil para ID:", userId); // <--- ¿Qué imprime esto?
  try {
    const res = await usersApi.get(`/users/${userId}/profile`);
    return res.data;
  } catch (err) {
    // Imprimimos el status y los datos para ver el error real
    console.error("❌ ERROR STATUS:", err.response?.status);
    console.error("❌ ERROR DATA:", err.response?.data);
    throw err;
  }
};

export const updateUserProfile = async (userId, { displayName, avatarUrl, bio }) => {
  const body = { displayName, avatarUrl, bio };
  const res = await usersApi.patch(`/users/${userId}/profile`, body);
  return res.status === 200;
};

/* ========= MÉTODOS DE PAGO ========= */

export const createPaymentMethod = async (userId, { provider, numC, cadC, cvv }) => {
  const body = { provider, numC, cadC, cvv };
  const res = await usersApi.post(`/users/${userId}/payment-methods`, body);
  return res.status === 201;
};

export const listPaymentMethods = async (userId) => {
  const res = await usersApi.get(`/users/${userId}/payment-methods`);
  return res.data;
};

export const deletePaymentMethod = async (userId, paymentMethodId) => {
  const res = await usersApi.delete(`/users/${userId}/payment-methods/${paymentMethodId}`);
  return res.status === 204;
};

/* ========= LIKES / SUSCRIPCIONES / PLAYS ========= */

export const addLike = async (userId, trackId) => {
  const body = { idUser: String(userId), idTrack: String(trackId) };
  const res = await usersApi.post(`/users/${userId}/likes`, body);
  return res.status === 201;
};

export const deleteLike = async (userId, likeId) => {
  const res = await usersApi.delete(`/users/${userId}/likes/${likeId}`);
  return res.status === 204;
};

export const addSubscription = async (userId, artistId) => {
  const body = { idArtist: String(artistId) };
  const res = await usersApi.post(`/users/${userId}/subscriptions`, body);
  return res.status === 201;
};

export const listSubscriptions = async (userId) => {
  const res = await usersApi.get(`/users/${userId}/subscriptions`);
  return res.data;
};

export const deleteSubscription = async (userId, artistId) => {
  const res = await usersApi.delete(`/users/${userId}/subscriptions/${artistId}`);
  return res.status === 204;
};

export const registerPlay = async (userId, trackId) => {
  // console.log("📡 REGISTER PLAY → userId:", userId, "trackId:", trackId);
  const body = { idTrack: String(trackId) };
  // Nota: Como 'usersApi' tiene withCredentials: true, la cookie viaja aquí automáticamente
  const res = await usersApi.post(`/users/${userId}/play`, body);
  return res.status === 201;
};

export default usersApi;