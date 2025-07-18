import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PREDICTHQ_TOKEN = 'Fv8kpSdTVWGDbA7cqn_y0c12hTrllqgEZqP2_YtB'; // Reemplaza con tu API Key de PredictHQ

interface EventoPHQ {
  id: string;
  title: string;
  category: string;
  start: string;
  end: string;
  description?: string;
  entities?: { name: string }[];
  labels?: string[];
  location: [number, number]; // [lat, lon]
  rank?: number;
}

const CATEGORIAS = [
  { label: 'Cultural', value: 'festivals' },
  { label: 'Conciertos', value: 'concerts' },
  { label: 'Deportes', value: 'sports' },
  { label: 'Conferencias', value: 'conferences' },
  { label: 'Comunidad', value: 'community' },
  { label: 'Exhibiciones', value: 'exhibitions' },
  { label: 'Artes escénicas', value: 'performing_arts' },
];

// Mapeo de categoría a emoji/ícono
const categoriaIcono: Record<string, string> = {
  festivals: '🎭',
  concerts: '🎤',
  sports: '🏟️',
  conferences: '🎓',
  community: '🤝',
  exhibitions: '🖼️',
  performing_arts: '🎬',
  nightlife: '🌙',
  default: '📅',
};

const EventsPage: React.FC = () => {
  const [ciudad, setCiudad] = useState('');
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [eventos, setEventos] = useState<EventoPHQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [coords, setCoords] = useState<{ lat: string, lon: string } | null>(null);
  const navigate = useNavigate();

  // Buscar sugerencias en Nominatim
  const fetchSugerencias = async (query: string) => {
    if (!query) {
      setSugerencias([]);
      return;
    }
    const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(query)}&country=Mexico&format=json&addressdetails=1&limit=5`);
    const data = await res.json();
    setSugerencias(data);
  };

  // Buscar eventos en PredictHQ
  const fetchEventosPHQ = async () => {
    if (!coords) {
      setError('Selecciona una ciudad válida de las sugerencias.');
      return;
    }
    setLoading(true);
    setError(null);
    setEventos([]);
    try {
      const params = new URLSearchParams();
      params.append('within', `50km@${coords.lat},${coords.lon}`);
      params.append('limit', '20');
      params.append('sort', '-rank');
      params.append('rank.gte', '70');
      // Elimino los filtros de fecha
      // params.append('active.gte', fechaInicio);
      // params.append('active.lte', fechaFin);
      // Solicito los campos relevantes, incluyendo descripción
      params.append('fields', 'id,title,category,start,location,description');
      if (categorias.length > 0) {
        params.append('category', categorias.join(','));
      }
      // Elimino el filtro de beamId
      // if (beamId) {
      //   params.append('beam.analysis_id', beamId);
      // }
      const url = `https://api.predicthq.com/v1/events/?${params.toString()}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${PREDICTHQ_TOKEN}`,
          Accept: 'application/json'
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al obtener eventos');
      }
      setEventos(data.results || []);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCiudad(value);
    setShowSugerencias(true);
    fetchSugerencias(value);
  };

  const handleSugerenciaClick = (sug: any) => {
    setCiudad(sug.display_name);
    setShowSugerencias(false);
    if (sug.lat && sug.lon) {
      setCoords({ lat: sug.lat, lon: sug.lon });
    }
  };

  const handleCategoriaChange = (cat: string) => {
    setCategorias(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEventosPHQ();
  };

    return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32, alignItems: 'center', position: 'relative' }} onSubmit={handleSubmit}>
        <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>
          <input
            type="text"
            value={ciudad}
            onChange={handleInputChange}
            placeholder="Buscar por ciudad..."
            style={{ width: '100%', padding: '0.5rem 1rem', borderRadius: 4, border: '1px solid #ccc', fontSize: 16 }}
            onFocus={() => setShowSugerencias(true)}
            autoComplete="off"
          />
          {showSugerencias && sugerencias.length > 0 && (
            <ul style={{
              position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #ccc', zIndex: 10, listStyle: 'none', margin: 0, padding: 0, maxHeight: 180, overflowY: 'auto'
            }}>
              {sugerencias.map((sug, idx) => (
                <li
                  key={idx}
                  style={{ padding: 8, cursor: 'pointer' }}
                  onClick={() => handleSugerenciaClick(sug)}
                >
                  {sug.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          {CATEGORIAS.map(cat => (
            <label key={cat.value} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15 }}>
              <input
                type="checkbox"
                checked={categorias.includes(cat.value)}
                onChange={() => handleCategoriaChange(cat.value)}
              />
              {cat.label}
            </label>
          ))}
        </div>
        {/* Elimino el input de Beam Analysis ID */}
        <button type="submit" style={{ padding: '0.5rem 1.5rem', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer', marginTop: 8 }}>Buscar</button>
      </form>
      {loading && <p>Cargando eventos...</p>}
      {error && <p style={{ color: '#c62828', textAlign: 'center', marginBottom: 16 }}>{error}</p>}
      {!loading && eventos.length === 0 && !error && (
        <p style={{ color: '#c62828', textAlign: 'center', marginBottom: 16, fontSize: 15 }}>
          No se encontraron eventos para la búsqueda seleccionada.
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
        {eventos.map(evento => {
          const icono = categoriaIcono[evento.category] || categoriaIcono.default;
          return (
            <div
              key={evento.id}
              style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 100, cursor: 'pointer' }}
              onClick={() => navigate(`/event/${evento.id}`, { state: evento })}
            >
              <div style={{ fontSize: 48, textAlign: 'center', paddingTop: 16 }}>{icono}</div>
              <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ margin: 0 }}>{evento.title}</h3>
                <p style={{ margin: 0, color: '#666' }}><strong>Categoría:</strong> {evento.category}</p>
              </div>
            </div>
          );
        })}
      </div>
        </div>
    );
};

export default EventsPage;