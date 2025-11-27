import axios from 'axios';

const contentApi = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const getAlbums = async (page = 0, size = 8, search = '', searchType = 'album', genre = '') => {
    const params = { page, size };

    // Si hay texto de búsqueda
    if (search && search.trim() !== '') {
        params.search = search;      // Enviamos el texto
        params.type = searchType;    // Enviamos el tipo (artist, album, track)
    }

    // Si hay género seleccionado
    if (genre && genre !== 'Todas' && genre.trim() !== '') {
        params.genre = genre;
    }

    console.log("📤 Enviando a Backend:", params);

    const response = await contentApi.get('/albums', { params });
    return response.data;
};

export const getArtists = async () => {
    const response = await contentApi.get('/artists?size=100');
    return response.data;
};

export const getTracks = async () => {
    const response = await contentApi.get('/tracks?size=500');
    return response.data;
};

// Funciones por ID
export const getArtistById = async (id) => {
    const response = await contentApi.get(`/artists/${id}`);
    return response.data;
};

export const getAlbumById = async (id) => {
    const response = await contentApi.get(`/albums/${id}`);
    return response.data;
};

export default contentApi;