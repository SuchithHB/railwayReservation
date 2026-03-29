import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TrainTrackingPage() {
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingTrains, setFetchingTrains] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/trains').then(res => {
      setTrains(res.data.data || []);
      setFetchingTrains(false);
    }).catch(() => setFetchingTrains(false));
  }, []);

  const trackTrain = async (id) => {
    setSelectedTrain(trains.find(t => t.id === id));
    setLoading(true);
    try {
      const res = await api.get(`/trains/${id}/status`);
      setStatus(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!selectedTrain) return;
    const interval = setInterval(() => trackTrain(selectedTrain.id), 30000);
    return () => clearInterval(interval);
  }, [selectedTrain]);

  const statusColors = {
    NOT_STARTED: 'var(--text-muted)',
    EN_ROUTE: 'var(--info)',
    ARRIVED: 'var(--success)',
    COMPLETED: 'var(--accent)',
  };

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h1>Track Train</h1>
        <p>Real-time train location simulation</p>
      </div>

      <div className="card-elevated" style={{ marginBottom: '1.5rem' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Select Train</label>
          {fetchingTrains ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : (
            <select className="form-control" value={selectedTrain?.id || ''}
              onChange={e => e.target.value && trackTrain(parseInt(e.target.value))}>
              <option value="">Choose a train to track</option>
              {trains.map(t => (
                <option key={t.id} value={t.id}>
                  {t.trainName} (#{t.trainNumber}) -- {t.source} to {t.destination}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {loading && <div className="loading-container"><div className="spinner"></div></div>}

      {status && !loading && (
        <div className="card-elevated">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.15rem' }}>{status.trainName}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>#{status.trainNumber}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge" style={{
                background: `${statusColors[status.status]}15`,
                color: statusColors[status.status],
                border: `1px solid ${statusColors[status.status]}40`
              }}>
                {status.status?.replace('_', ' ')}
              </span>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/trains/${selectedTrain.id}`)}>
                Book Tickets
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${status.progressPercent}%` }}></div>
            </div>
            <div className="progress-info">
              <span>{selectedTrain?.source || status.currentStation}</span>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{status.progressPercent}%</span>
              <span>{selectedTrain?.destination || status.nextStation}</span>
            </div>
          </div>

          <div className="card" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Current / Last Station</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{status.currentStation || '--'}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Next Station</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{status.nextStation || 'Final destination'}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Estimated Arrival</span>
                <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>{status.estimatedArrival || '--'}</div>
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Auto-refreshes every 30 seconds
          </p>
        </div>
      )}
    </div>
  );
}
