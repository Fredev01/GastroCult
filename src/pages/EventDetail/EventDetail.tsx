import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EventDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // El evento viene en location.state
    const evento = location.state;

    if (!evento) {
        return (
            <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32, textAlign: 'center' }}>
                <h2>No se encontró información del evento.</h2>
                <button onClick={() => navigate(-1)} style={{ marginTop: 24, padding: '0.5rem 1.5rem', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 4, fontSize: 16, cursor: 'pointer' }}>Volver</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 32 }}>
            <h1 style={{marginBottom:8}}>{evento.title}</h1>
            <p style={{margin:0}}><strong>Categoría:</strong> {evento.category}</p>
            <p style={{margin:0}}><strong>Fecha:</strong> {evento.start ? new Date(evento.start).toLocaleString() : 'N/A'}</p>
            <p style={{margin:0}}><strong>Ubicación:</strong> {evento.location?.join(', ')}</p>
            {evento.description && <p style={{marginTop:16, fontSize:16, color:'#555'}}>{evento.description}</p>}
        </div>
    );
};

export default EventDetail;