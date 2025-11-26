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
 * Obtiene recomendaciones basadas en el género favorito reciente.
 * Endpoint: GET /recommendations/users/{idUser}/recommended-tracks/genre
 * @param {number} userId - ID del usuario
 */
export const getRecommendedTracksByGenre = async (userId) => {
    try {
        // Ya no enviamos params, la ruta define la lógica
        const response = await recommendationApi.get(`/recommendations/users/${userId}/recommended-tracks/genre`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener recomendaciones por GÉNERO para usuario ${userId}:`, error);
        return [];
    }
};

/**
 * Obtiene recomendaciones basadas en filtrado colaborativo (Likes).
 * Endpoint: GET /recommendations/users/{idUser}/recommended-tracks/like
 * @param {number} userId - ID del usuario
 */
export const getRecommendedTracksByLike = async (userId) => {
    try {
        const response = await recommendationApi.get(`/recommendations/users/${userId}/recommended-tracks/like`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener recomendaciones por LIKE para usuario ${userId}:`, error);
        return [];
    }
};

// --------------------------------------------------------------------------

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