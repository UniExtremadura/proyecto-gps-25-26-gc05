import axios from 'axios';

// Instancia para el Microservicio de Recomendaciones (Python - Puerto 8080)
const recommendationApi = axios.create({
    baseURL: 'http://localhost:8082', 
    withCredentials: true,
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
 * NUEVO: Ya no recibe userId.
 * Llama a /my/genre y el backend averigua el usuario por la cookie.
 */
export const getRecommendedTracksByGenre = async () => { // <--- Sin parámetros
    try {
        const response = await recommendationApi.get('/recommendations/my/genre');
        return response.data;
    } catch (error) {
        console.error("Error recomendaciones género:", error);
        return [];
    }
};

/**
 * NUEVO: Ya no recibe userId.
 */
export const getRecommendedTracksByLike = async () => { // <--- Sin parámetros
    try {
        const response = await recommendationApi.get('/recommendations/my/likes');
        return response.data;
    } catch (error) {
        console.error("Error recomendaciones likes:", error);
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