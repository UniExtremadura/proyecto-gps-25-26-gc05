import axios from 'axios';

// Creamos una instancia básica que apunte a tu Microservicio de Contenidos
const apiContenidos = axios.create({
    baseURL: 'http://localhost:8081', // Puerto de tu backend de contenidos
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default apiContenidos;