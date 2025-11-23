import axios from 'axios';

const contentApi = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const getAlbums = async (page = 0, size = 8, title = '', genre = '') => {
    // 1. Creamos el objeto de parámetros
    const params = { 
        page, 
        size 
    };

    // 2. Añadimos título solo si tiene texto
    if (title && title.trim() !== '') {
        params.title = title;
    }

    // 3. Añadimos género solo si tiene texto y no es "Todas"
    if (genre && genre !== 'Todas' && genre.trim() !== '') {
        params.genre = genre;
    }

    // CHIVATO: Abre la consola del navegador (F12) para ver qué se está enviando
    console.log("📤 Enviando a Backend:", params);

    const response = await contentApi.get('/albums', { params });
    return response.data;
};

// ... (resto de funciones getArtists, getTracks igual) ...
export const getArtists = async () => {
    const response = await contentApi.get('/artists?size=100');
    return response.data;
};

export const getTracks = async () => {
    const response = await contentApi.get('/tracks?size=500');
    return response.data;
};

export default contentApi;