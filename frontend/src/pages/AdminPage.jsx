import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminPage() {
  const [tab, setTab] = useState('trains');
  const [trains, setTrains] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    trainNumber: '', trainName: '', source: '', destination: '',
    totalSeats: '', baseFare: '', departureTime: '', arrivalTime: '', date: '',
    stations: [{ stationName: '', arrivalTime: '', departureTime: '', stopNumber: 1 }]
  });

  useEffect(() => { fetchData(); }, [tab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === 'trains') {
        const res = await api.get('/admin/trains');
        setTrains(res.data.data || []);
      } else {
        const res = await api.get('/admin/bookings');
        setBookings(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const addStation = () => {
    setForm({
      ...form,
      stations: [...form.stations, { stationName: '', arrivalTime: '', departureTime: '', stopNumber: form.stations.length + 1 }]
    });
  };

  const removeStation = (i) => {
    const updated = form.stations.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, stopNumber: idx + 1 }));
    setForm({ ...form, stations: updated });
  };

  const updateStation = (i, field, value) => {
    const updated = [...form.stations];
    updated[i][field] = value;
    setForm({ ...form, stations: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.post('/admin/trains', {
        ...form,
        totalSeats: parseInt(form.totalSeats),
        baseFare: parseFloat(form.baseFare),
        stations: form.stations.map(s => ({ ...s, stopNumber: parseInt(s.stopNumber) }))
      });
      setSuccess('Train created successfully!');
      setShowForm(false);
      setForm({
        trainNumber: '', trainName: '', source: '', destination: '',
        totalSeats: '', baseFare: '', departureTime: '', arrivalTime: '', date: '',
        stations: [{ stationName: '', arrivalTime: '', departureTime: '', stopNumber: 1 }]
      });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create train');
    }
    setSubmitting(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage trains and view all bookings</p>
      </div>

      <div className="admin-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-value">{trains.length || '--'}</div>
          <div className="stat-label">Total Trains</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{bookings.length || '--'}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button className={`btn ${tab === 'trains' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('trains')}>
          <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 11h16"/></svg>
          Trains
        </button>
        <button className={`btn ${tab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setTab('bookings')}>
          <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
          Bookings
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {tab === 'trains' && (
        <>
          <button className="btn btn-primary" style={{ marginBottom: '1rem' }}
            onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close Form' : '+ Add New Train'}
          </button>

          {showForm && (
            <form className="card-elevated" style={{ marginBottom: '1.5rem' }} onSubmit={handleSubmit}>
              <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Create New Train</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Train Number</label>
                  <input className="form-control" placeholder="e.g. 12345" value={form.trainNumber}
                    onChange={e => setForm({ ...form, trainNumber: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Train Name</label>
                  <input className="form-control" placeholder="e.g. Rajdhani Express" value={form.trainName}
                    onChange={e => setForm({ ...form, trainName: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Source</label>
                  <input className="form-control" placeholder="e.g. New Delhi" value={form.source}
                    onChange={e => setForm({ ...form, source: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Destination</label>
                  <input className="form-control" placeholder="e.g. Mumbai" value={form.destination}
                    onChange={e => setForm({ ...form, destination: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total Seats</label>
                  <input className="form-control" type="number" placeholder="500" value={form.totalSeats}
                    onChange={e => setForm({ ...form, totalSeats: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Base Fare (Rs.)</label>
                  <input className="form-control" type="number" placeholder="1000" value={form.baseFare}
                    onChange={e => setForm({ ...form, baseFare: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Departure Time</label>
                  <input className="form-control" type="time" value={form.departureTime}
                    onChange={e => setForm({ ...form, departureTime: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Arrival Time</label>
                  <input className="form-control" type="time" value={form.arrivalTime}
                    onChange={e => setForm({ ...form, arrivalTime: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input className="form-control" type="date" value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>

              <h4 style={{ margin: '1.25rem 0 0.75rem', fontWeight: 700 }}>Stations / Route</h4>
              {form.stations.map((s, i) => (
                <div key={i} className="card" style={{ padding: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Stop #{s.stopNumber}</span>
                    {form.stations.length > 1 && (
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => removeStation(i)}>Remove</button>
                    )}
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Station Name</label>
                      <input className="form-control" placeholder="Station name" value={s.stationName}
                        onChange={e => updateStation(i, 'stationName', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Arrival</label>
                      <input className="form-control" type="time" value={s.arrivalTime}
                        onChange={e => updateStation(i, 'arrivalTime', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Departure</label>
                      <input className="form-control" type="time" value={s.departureTime}
                        onChange={e => updateStation(i, 'departureTime', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-outline" style={{ marginBottom: '1rem' }} onClick={addStation}>
                + Add Station
              </button>
              <br />
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Train'}
              </button>
            </form>
          )}

          {loading ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Name</th>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Seats (Avail / Total)</th>
                    <th>Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {trains.map(t => (
                    <tr key={t.id}>
                      <td>#{t.trainNumber}</td>
                      <td style={{ fontWeight: 600 }}>{t.trainName}</td>
                      <td>{t.source} → {t.destination}</td>
                      <td>{t.date}</td>
                      <td>{t.availableSeats} / {t.totalSeats}</td>
                      <td>Rs. {t.baseFare}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === 'bookings' && (
        loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : bookings.length === 0 ? (
          <div className="empty-state"><h3>No bookings yet</h3></div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>PNR</th>
                  <th>Train</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Passengers</th>
                  <th>Fare</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.pnr}</td>
                    <td>{b.trainName}</td>
                    <td>{b.boardingStation} → {b.destinationStation}</td>
                    <td>{b.journeyDate}</td>
                    <td>{b.passengers?.length || 0}</td>
                    <td>Rs. {b.totalFare}</td>
                    <td><span className={`badge badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
