import apiContenidos from '../api/axiosConfig';

export const getArtists = async () => {
    try {
        // Esto llama a GET http://localhost:8081/artists
        const response = await apiContenidos.get('/artists');
        return response.data;
    } catch (error) {
        console.error("Error al obtener artistas:", error);
        throw error;
    }
};