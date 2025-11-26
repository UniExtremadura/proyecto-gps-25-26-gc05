import axios from 'axios';

// Instancia para el Microservicio de Recomendaciones (Python - Puerto 8080)
const recommendationApi = axios.create({
    baseURL: 'http://localhost:8082', 
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * Obtiene el TOP 10 de canciones más escuchadas globalmente.
 * Endpoint: GET /recommendations/tracks/top
 */
export const getTopTracks = async () => {
    try {
        const response = await recommendationApi.get('/recommendations/tracks/top');
        return response.data;
    } catch (error) {
        console.error("Error al obtener top tracks:", error);
        return [];
    }
};

/**
 * Obtiene recomendaciones personalizadas para un usuario.
 * Endpoint: GET /recommendations/users/{idUser}/recommended-tracks?type=...
 * @param {number} userId - ID del usuario (BIGINT/Long)
 * @param {string} type - Tipo de filtro: 'genre', 'like', 'subscription'
 */
export const getRecommendedTracks = async (userId, type) => {
    try {
        const params = { type };
        const response = await recommendationApi.get(`/recommendations/users/${userId}/recommended-tracks`, { params });
        return response.data;
    } catch (error) {
        console.error(`Error al obtener recomendaciones (${type}):`, error);
        return [];
    }
};

/**
 * Obtiene el top de canciones de un artista específico.
 * Endpoint: GET /recommendations/artists/{idArtist}/top-tracks
 */
export const getArtistTopTracks = async (artistId) => {
    try {
        const response = await recommendationApi.get(`/recommendations/artists/${artistId}/top-tracks`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener top artista:", error);
        return [];
    }
};

export default recommendationApi;