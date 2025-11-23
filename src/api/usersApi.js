import axios from 'axios';

// Instancia para el Microservicio de Usuarios (Puerto 8080)
const usersApi = axios.create({
    baseURL: 'http://localhost:8080', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Función para dar Like
export const addLike = async (userId, trackId) => {
    try {
        // El backend espera un body: { "idTrack": "123" }
        const body = { idTrack: String(trackId) };
        
        const response = await usersApi.post(`/users/${userId}/likes`, body);
        return response.data;
    } catch (error) {
        console.error("Error al dar like:", error);
        throw error;
    }
};

export const registerPlay = async (userId, trackId) => {
    try {
        // OJO: Java espera números ahora (Long)
        const body = { idTrack: Number(trackId) };
        // El endpoint en Java es /users/{idUser}/play
        await usersApi.post(`/users/${userId}/play`, body);
        console.log(`📡 Play registrado en Backend: User ${userId} -> Track ${trackId}`);
    } catch (error) {
        console.error("Error registrando play:", error);
    }
};

export default usersApi;