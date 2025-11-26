import axios from 'axios';

// Instancia para el Microservicio de Usuarios (Puerto 8080)
const usersApi = axios.create({
  baseURL: 'http://localhost:8080',
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
    console.log("🔥 Token enviado a backend:", `Bearer ${clean}`);
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

  const res = await usersApi.post(
    '/users/auth/register',
    body,
    {
      headers: {
        "X-Recaptcha-Token": recaptchaToken
      }
    }
  );

  return res.status === 201;
};


export const loginUser = async ({ email, password, recaptchaToken }) => {
  const res = await usersApi.post(
    "/users/auth/login",
    { email, password },
    {
      headers: {
        "X-Recaptcha-Token": recaptchaToken,
        "Accept": "*/*"
      }
    }
  );

    const tokenRaw = res.headers["authorization"] || res.headers["Authorization"];
    const userId = res.headers["x-user-id"] || res.headers["X-User-Id"];
    console.log("🔥 tokenRaw recibido desde backend:", tokenRaw);
    console.log("🔥 userId recibido:", userId);

    if (!tokenRaw || !userId) throw new Error("No token o userId");

    // formato
    const token = tokenRaw.startsWith("Bearer ")
    ? tokenRaw.substring(7)
    : tokenRaw;

    return { token, userId };

};





export const logoutUser = async () => {
  const res = await usersApi.post('/users/auth/logout');
  return res.status === 200;
};

/* ========= PERFIL ========= */

export const getUserProfile = async (userId) => {
  console.log("📡 GET PROFILE → userId:", userId);

  try {
    const res = await usersApi.get(`/users/${userId}/profile`);
    console.log("📡 RESPUESTA PERFIL:", res);
    return res.data;
  } catch (err) {
    console.error("❌ ERROR GET PROFILE:", err.response || err);
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
  console.log("📡 ADD LIKE → body:", body);
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
  console.log("📡 REGISTER PLAY → userId:", userId, "trackId:", trackId);
  const body = { idTrack: String(trackId) };
  const res = await usersApi.post(`/users/${userId}/play`, body);
  return res.status === 201;
};

export default usersApi;
