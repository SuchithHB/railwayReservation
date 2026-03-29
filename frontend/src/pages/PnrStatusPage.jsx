import { useState } from 'react';
import api from '../api/axios';

export default function PnrStatusPage() {
  const [pnr, setPnr] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!pnr.trim()) { setError('Enter a PNR number'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await api.get(`/bookings/${pnr.trim()}`);
      setBooking(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking not found');
      setBooking(null);
    }
    setLoading(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: '700px' }}>
      <div className="page-header">
        <h1>PNR Status</h1>
        <p>Check your booking status using PNR number</p>
      </div>

      <div className="card-elevated">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>PNR Number</label>
            <input className="form-control" placeholder="e.g. PNR123456" value={pnr}
              onChange={e => setPnr(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-block" disabled={loading}>
            <svg style={{width:16,height:16}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            {loading ? 'Checking...' : 'Check Status'}
          </button>
        </form>
      </div>

      {booking && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700 }}>PNR: {booking.pnr}</h3>
            <span className={`badge badge-${booking.status.toLowerCase()}`}>{booking.status}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Train</span><br />{booking.trainName} (#{booking.trainNumber})</div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Journey Date</span><br />{booking.journeyDate}</div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>From</span><br />{booking.boardingStation}</div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>To</span><br />{booking.destinationStation}</div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Total Fare</span><br />Rs. {booking.totalFare}</div>
            {booking.refundAmount != null && (
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Refund</span><br />Rs. {booking.refundAmount?.toFixed(2)}</div>
            )}
          </div>

          <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Passengers</h4>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>Seat</th></tr>
              </thead>
              <tbody>
                {booking.passengers?.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.age}</td>
                    <td>{p.gender}</td>
                    <td><span style={{ color: 'var(--primary)', fontWeight: 700 }}>{p.seatNumber}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
