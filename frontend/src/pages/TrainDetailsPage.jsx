import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function TrainDetailsPage() {
  const { id } = useParams();
  const [train, setTrain] = useState(null);
  const [seats, setSeats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      api.get(`/trains/${id}`),
      api.get(`/trains/${id}/seats`)
    ]).then(([trainRes, seatsRes]) => {
      setTrain(trainRes.data.data);
      setSeats(seatsRes.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!train) return <div className="page-container"><div className="empty-state"><h3>Train not found</h3></div></div>;

  const sortedStations = train.stations?.sort((a, b) => a.stopNumber - b.stopNumber) || [];

  return (
    <div className="page-container" style={{ maxWidth: '900px' }}>
      {/* Train Header */}
      <div className="card-elevated" style={{ marginBottom: '1.5rem' }}>
        <div className="train-card-header">
          <div>
            <div className="train-name" style={{ fontSize: '1.4rem' }}>{train.trainName}</div>
            <div className="train-number">Train #{train.trainNumber}</div>
          </div>
          <div className="train-fare" style={{ fontSize: '1.5rem' }}>
            <svg style={{width:18,height:18,verticalAlign:'middle'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12M6 8h12M6 13l8.5 8M14.5 13a4.65 4.65 0 0 0 .5-2 4.67 4.67 0 0 0-.5-2H6"/></svg>
            {train.baseFare}
          </div>
        </div>

        <div className="train-route" style={{ margin: '1.5rem 0' }}>
          <div className="train-station-info">
            <div className="time">{train.departureTime}</div>
            <div className="name">{train.source}</div>
          </div>
          <div className="train-route-line"></div>
          <div className="train-station-info">
            <div className="time">{train.arrivalTime}</div>
            <div className="name">{train.destination}</div>
          </div>
        </div>

        <div className="train-meta" style={{ fontSize: '0.85rem' }}>
          <span>
            <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Journey Date: {train.date}
          </span>
          <span>
            <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1H7v-1a2 2 0 0 0-4 0z"/><path d="M5 18v2M19 18v2"/></svg>
            {train.availableSeats} / {train.totalSeats} seats available
          </span>
          <span>
            <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
            {sortedStations.length} stops
          </span>
        </div>
      </div>

      {/* Route / Stations */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg style={{width:18,height:18}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
          Route & Stops
        </h3>
        <div className="station-timeline">
          {sortedStations.map(station => (
            <div key={station.id} className="station-item">
              <div className="station-name">{station.stationName}</div>
              <div className="station-time">
                Arrival: {station.arrivalTime} &middot; Departure: {station.departureTime} &middot; Stop #{station.stopNumber}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Map */}
      {seats && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg style={{width:18,height:18}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1H7v-1a2 2 0 0 0-4 0z"/><path d="M5 18v2M19 18v2"/></svg>
            Seat Availability
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {seats.availableSeats} of {seats.totalSeats} seats available &middot; {seats.bookedSeats} booked
          </p>
          <div className="seat-grid">
            {Array.from({ length: Math.min(seats.totalSeats, 100) }, (_, i) => {
              const seatNum = `S${i + 1}`;
              const isBooked = seats.bookedSeatNumbers?.includes(seatNum);
              return (
                <div key={seatNum} className={`seat ${isBooked ? 'seat-booked' : 'seat-available'}`}
                     title={isBooked ? `${seatNum} - Booked` : `${seatNum} - Available`}>
                  {seatNum}
                </div>
              );
            })}
          </div>
          {seats.totalSeats > 100 && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Showing first 100 of {seats.totalSeats} seats
            </p>
          )}
          <div className="seat-legend">
            <div className="seat-legend-item">
              <div className="seat-legend-dot" style={{ background: 'var(--success-bg)', border: '1px solid #a7f3d0' }}></div>
              Available
            </div>
            <div className="seat-legend-item">
              <div className="seat-legend-dot" style={{ background: 'var(--danger-bg)', border: '1px solid #fecaca' }}></div>
              Booked
            </div>
          </div>
        </div>
      )}

      {/* Book Button */}
      {user ? (
        <button className="btn btn-primary btn-lg btn-block" onClick={() => navigate(`/book/${train.id}`)}>
          <svg style={{width:18,height:18}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
          Book Tickets
        </button>
      ) : (
        <button className="btn btn-outline btn-lg btn-block" onClick={() => navigate('/login')}>
          <svg style={{width:18,height:18}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
          Login to Book Tickets
        </button>
      )}
    </div>
  );
}
