import axios from 'axios';

const usersApi = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});



// === Gestión del token JWT ===
export const setAuthToken = (token) => {
  if (token) {
    const clean = token.replace(/^Bearer\s+/i, "");
    usersApi.defaults.headers.common['Authorization'] = `Bearer ${clean}`;
    console.log("Token enviado a backend:", `Bearer ${clean}`);
  } else {
    delete usersApi.defaults.headers.common['Authorization'];
  }
};


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

  if (recaptchaToken && recaptchaToken !== "null") {
    headers["X-Recaptcha-Token"] = recaptchaToken;
  }

  const res = await usersApi.post(
    "/users/auth/login",
    { email, password },
    { headers }
  );

  const userId = res.headers["x-user-id"] || res.headers["X-User-Id"];
  const role = res.headers["x-user-role"] || res.headers["X-User-Role"];

  if (!userId) {
      throw new Error("Login incompleto: El servidor no devolvió ID de usuario.");
  }

  return { userId, role, success: true };
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
  console.log("GET PROFILE → userId:", userId);

  try {
    const res = await usersApi.get(`/users/${userId}/profile`);
    console.log("RESPUESTA PERFIL:", res);
    return res.data;
  } catch (err) {
    console.error("ERROR GET PROFILE:", err.response || err);

    throw err;
  }
};


export const updateUserProfile = async (userId, form) => {
  const body = {
    display_name: form.displayName,
    avatar_url: form.avatarUrl,
    bio: form.bio
  };

  const res = await usersApi.patch(`/users/${userId}`, body);
  return res.status === 200;
};


/* ========= MÉTODOS DE PAGO ========= */

export const getPaymentMethods = async (userId) => {
    try {
        const response = await usersApi.get(`/users/${userId}/payment-methods`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo métodos de pago:", error);
        return [];
    }
};

// Alias para mantener compatibilidad si lo usas como listPaymentMethods
export const listPaymentMethods = getPaymentMethods;

export const createPaymentMethod = async (userId, paymentData) => {
    try {
        const response = await usersApi.post(`/users/${userId}/payment-methods`, paymentData);
        return response.data;
    } catch (error) {
        console.error("Error añadiendo método de pago:", error);
        throw error;
    }
};

// Alias para compatibilidad
export const addPaymentMethod = createPaymentMethod;

export const deletePaymentMethod = async (userId, paymentId) => {
    try {
        await usersApi.delete(`/users/${userId}/payment-methods/${paymentId}`);
        return true;
    } catch (error) {
        console.error("Error borrando método de pago:", error);
        return false;
    }
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
  // console.log("REGISTER PLAY → userId:", userId, "trackId:", trackId);
  const body = { idTrack: String(trackId) };
  // Nota: Como 'usersApi' tiene withCredentials: true, la cookie viaja aquí automáticamente
  const res = await usersApi.post(`/users/${userId}/play`, body);
  return res.status === 201;
};

export default usersApi;