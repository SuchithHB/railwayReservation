import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/user');
      setBookings(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (pnr) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Refund will be processed.')) return;
    setCancelling(pnr);
    try {
      await api.put(`/bookings/${pnr}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    }
    setCancelling(null);
  };

  const downloadTicket = (b) => {
    const ticketText = `
==========================================
        RAILRESERVE - E-TICKET
==========================================

PNR Number: ${b.pnr}
Status: ${b.status}
Train: ${b.trainName} (#${b.trainNumber})
From: ${b.boardingStation}
To: ${b.destinationStation}
Date: ${b.journeyDate}
Fare: Rs. ${b.totalFare}

PASSENGERS:
${b.passengers?.map((p, i) => `  ${i + 1}. ${p.name} (${p.gender}, Age: ${p.age}) - Seat: ${p.seatNumber}`).join('\n')}

==========================================
    `.trim();
    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_${b.pnr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  const active = bookings.filter(b => b.status !== 'CANCELLED');
  const cancelled = bookings.filter(b => b.status === 'CANCELLED');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
      </div>

      {bookings.length === 0 && (
        <div className="empty-state">
          <h3>No bookings yet</h3>
          <p>Search and book your first train ticket!</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>
            Search Trains
          </button>
        </div>
      )}

      {active.length > 0 && (
        <>
          <h3 style={{ marginBottom: '0.75rem', fontWeight: 700, fontSize: '1rem' }}>Active Bookings</h3>
          {active.map(b => (
            <div key={b.id} className="card" style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{b.trainName} (#{b.trainNumber})</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PNR: {b.pnr}</div>
                </div>
                <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>From</span><br />{b.boardingStation}</div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>To</span><br />{b.destinationStation}</div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Date</span><br />{b.journeyDate}</div>
                <div><span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Passengers</span><br />{b.passengers?.length || 0}</div>
              </div>
              {b.passengers && b.passengers.length > 0 && (
                <div style={{ marginBottom: '0.75rem', fontSize: '0.82rem' }}>
                  {b.passengers.map((p, i) => (
                    <span key={i} style={{ marginRight: '0.75rem' }}>
                      {p.name} <span style={{ color: 'var(--primary)', fontWeight: 600 }}>({p.seatNumber})</span>
                    </span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 800, color: 'var(--primary)' }}>Rs. {b.totalFare}</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => downloadTicket(b)}>
                    <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </button>
                  <button className="btn btn-danger btn-sm" disabled={cancelling === b.pnr}
                    onClick={() => handleCancel(b.pnr)}>
                    {cancelling === b.pnr ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      {cancelled.length > 0 && (
        <>
          <h3 style={{ margin: '1.5rem 0 0.75rem', fontWeight: 700, fontSize: '1rem', color: 'var(--text-muted)' }}>Cancelled Bookings</h3>
          {cancelled.map(b => (
            <div key={b.id} className="card" style={{ marginBottom: '0.75rem', opacity: 0.65 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{b.trainName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>PNR: {b.pnr}</div>
                </div>
                <span className="badge badge-cancelled">CANCELLED</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                {b.boardingStation} → {b.destinationStation} &middot; Refund: Rs. {b.refundAmount?.toFixed(2) || '0.00'}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
