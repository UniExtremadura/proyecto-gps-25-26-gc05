import axios from 'axios';

// Instancia base apuntando a tu Microservicio de Contenidos
const apiContenidos = axios.create({
    baseURL: 'http://localhost:8081', // Puerto definido en tu arquitectura
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para debugging (opcional, ayuda a ver errores en consola)
apiContenidos.interceptors.response.use(
    response => response,
    error => {
        console.error("Error API Contenidos:", error.response?.status, error.message);
        return Promise.reject(error);
    }
);

const ContentService = {
    // --- ALBUMS (AlbumsApiController) ---
    
    /**
     * Obtiene todos los álbumes.
     * Soporta filtros opcionales definidos en tu Controller: page, size, title, genre
     */
    getAlbums: (params = {}) => {
        // params puede ser { page: 0, size: 10, title: 'rock', genre: 'pop' }
        return apiContenidos.get('/albums', { params });
    },

    getAlbumById: (idAlbum) => {
        return apiContenidos.get(`/albums/${idAlbum}`);
    },

    uploadTrackToAlbum: (idAlbum, trackData) => {
        return apiContenidos.post(`/albums/${idAlbum}/tracks`, trackData);
    },

    // --- ARTISTS (ArtistsApiController) ---

    /**
     * Obtiene lista de artistas.
     * Soporta filtros: page, size, name, genre
     */
    getArtists: (params = {}) => {
        return apiContenidos.get('/artists', { params });
    },

    getArtistById: (idArtist) => {
        return apiContenidos.get(`/artists/${idArtist}`);
    },

    createAlbum: (idArtist, albumData) => {
        return apiContenidos.post(`/artists/${idArtist}/albums`, albumData);
    },

    getArtistAlbums: (idArtist) => {
        return apiContenidos.get(`/artists/${idArtist}/albums`);
    },

    getArtistTracks: (idArtist) => {
        return apiContenidos.get(`/artists/${idArtist}/tracks`);
    },

    getArtistSubscribers: (idArtist) => {
        return apiContenidos.get(`/artists/${idArtist}/subscriptions`);
    },

    // --- TRACKS (TracksApiController) ---

    getTracks: () => {
        return apiContenidos.get('/tracks');
    },

    getTrackById: (idTrack) => {
        return apiContenidos.get(`/tracks/${idTrack}`);
    }
};

export default ContentService;