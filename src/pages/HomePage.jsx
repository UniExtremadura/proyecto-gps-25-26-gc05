import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <--- OJO: Importa esto
import { getArtists } from '../services/artistService';

function HomePage() {
  const [artistas, setArtistas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getArtists()
      .then(data => setArtistas(data))
      .catch(err => {
          console.error(err);
          setError("Error de conexión.");
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>BeatSphere - Artistas</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {artistas.map(artista => (
          // Usamos Link para que sea clicable
          <Link to={`/artist/${artista.id}`} key={artista.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', cursor: 'pointer' }}>
              <h3>{artista.name}</h3>
              <p>{artista.genre}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;