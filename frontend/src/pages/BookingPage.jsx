import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function BookingPage() {
  const { trainId } = useParams();
  const [train, setTrain] = useState(null);
  const [step, setStep] = useState(1); // 1=Journey, 2=Passengers, 3=Payment, 4=Confirmation
  const [boarding, setBoarding] = useState('');
  const [destination, setDestination] = useState('');
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'Male' }]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/trains/${trainId}`).then(res => {
      setTrain(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [trainId]);

  const addPassenger = () => setPassengers([...passengers, { name: '', age: '', gender: 'Male' }]);
  const removePassenger = (i) => setPassengers(passengers.filter((_, idx) => idx !== i));
  const updatePassenger = (i, field, value) => {
    const updated = [...passengers];
    updated[i][field] = value;
    setPassengers(updated);
  };

  const handlePayment = async () => {
    setError('');
    for (const p of passengers) {
      if (!p.name || !p.age) { setError('All passenger fields are required'); return; }
    }
    setSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        trainId: parseInt(trainId),
        boardingStation: boarding,
        destinationStation: destination,
        passengers: passengers.map(p => ({ ...p, age: parseInt(p.age) }))
      });
      setResult(res.data.data);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
      setStep(2);
    }
    setSubmitting(false);
  };

  const downloadTicket = () => {
    if (!result) return;
    const ticketText = `
==========================================
        RAILRESERVE - E-TICKET
==========================================

PNR Number: ${result.pnr}
Status: ${result.status}

Train: ${result.trainName} (#${result.trainNumber})
From: ${result.boardingStation}
To: ${result.destinationStation}
Date: ${result.journeyDate}

Total Fare: Rs. ${result.totalFare}

PASSENGERS:
${result.passengers?.map((p, i) => `  ${i + 1}. ${p.name} (${p.gender}, Age: ${p.age}) - Seat: ${p.seatNumber}`).join('\n')}

==========================================
  Thank you for choosing RailReserve!
==========================================
    `.trim();

    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket_${result.pnr}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;
  if (!train) return <div className="page-container"><div className="empty-state"><h3>Train not found</h3></div></div>;

  const stations = train.stations?.sort((a, b) => a.stopNumber - b.stopNumber) || [];

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h1>Book Tickets</h1>
        <p>{train.trainName} (#{train.trainNumber}) &middot; {train.availableSeats} / {train.totalSeats} seats available</p>
      </div>

      {/* Stepper */}
      <div className="steps-container">
        {['Journey', 'Passengers', 'Payment', 'Ticket'].map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`step ${step >= i + 1 ? 'active' : ''} ${step > i + 1 ? 'completed' : ''}`}>
              <div className="step-number">{step > i + 1 ? '✓' : i + 1}</div>
              <span className="step-label">{label}</span>
            </div>
            {i < 3 && <div className={`step-connector ${step > i + 1 ? 'active' : ''}`}></div>}
          </div>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Step 1: Select Stations */}
      {step === 1 && (
        <div className="card-elevated">
          <h3 style={{ marginBottom: '1.25rem', fontWeight: 700 }}>Select Journey Stations</h3>
          <div className="form-group">
            <label>Boarding Station</label>
            <select className="form-control" value={boarding} onChange={e => setBoarding(e.target.value)}>
              <option value="">Select boarding station</option>
              {stations.map(s => <option key={s.id} value={s.stationName}>{s.stationName} (Stop #{s.stopNumber})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Destination Station</label>
            <select className="form-control" value={destination} onChange={e => setDestination(e.target.value)}>
              <option value="">Select destination station</option>
              {stations.filter(s => {
                const bs = stations.find(st => st.stationName === boarding);
                return bs ? s.stopNumber > bs.stopNumber : true;
              }).map(s => <option key={s.id} value={s.stationName}>{s.stationName} (Stop #{s.stopNumber})</option>)}
            </select>
          </div>
          <button className="btn btn-primary btn-block" disabled={!boarding || !destination}
            onClick={() => { setError(''); setStep(2); }}>
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Passenger Details */}
      {step === 2 && (
        <div className="card-elevated">
          <h3 style={{ marginBottom: '1.25rem', fontWeight: 700 }}>Passenger Details</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            One person can book multiple seats. Add all passengers below.
          </p>
          {passengers.map((p, i) => (
            <div key={i} className="card" style={{ marginBottom: '0.75rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Passenger {i + 1}</span>
                {passengers.length > 1 && (
                  <button className="btn btn-danger btn-sm" onClick={() => removePassenger(i)}>Remove</button>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-control" placeholder="Full name" value={p.name}
                    onChange={e => updatePassenger(i, 'name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input className="form-control" type="number" placeholder="25" value={p.age}
                    onChange={e => updatePassenger(i, 'age', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select className="form-control" value={p.gender}
                    onChange={e => updatePassenger(i, 'gender', e.target.value)}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-outline" style={{ marginBottom: '1rem' }} onClick={addPassenger}>
            + Add Another Passenger
          </button>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setError(''); setStep(3); }}>
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="card-elevated">
          <h3 style={{ marginBottom: '1.25rem', fontWeight: 700 }}>Payment Summary</h3>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Train</span><br />{train.trainName}</div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Route</span><br />{boarding} → {destination}</div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Passengers</span><br />{passengers.length}</div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</span><br />{train.date}</div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Total Amount</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary)' }}>
                Rs. {train.baseFare * passengers.length}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
            <button className="btn btn-success btn-lg" style={{ flex: 1 }} disabled={submitting}
              onClick={handlePayment}>
              <svg style={{width:18,height:18}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
              {submitting ? 'Processing...' : 'Complete My Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation & Ticket */}
      {step === 4 && result && (
        <div className="card-elevated" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem' }}>
            {result.status === 'CONFIRMED' ? (
              <svg style={{width:48,height:48,color:'var(--success)'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            ) : (
              <svg style={{width:48,height:48,color:'var(--warning)'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            )}
          </div>
          <h2 style={{ marginBottom: '0.25rem', fontWeight: 800 }}>
            {result.status === 'CONFIRMED' ? 'Booking Confirmed!' : 'Waitlisted'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {result.status === 'CONFIRMED'
              ? 'Your tickets have been booked successfully.'
              : 'You are on the waitlist. Tickets will be confirmed if seats become available.'}
          </p>

          {/* Ticket */}
          <div className="ticket-container" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <div className="ticket-watermark">RAILRESERVE</div>
            <div className="ticket-header">
              <h3 style={{ fontWeight: 800, color: 'var(--primary)' }}>E-TICKET</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{result.trainName}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>PNR Number</span><br /><strong>{result.pnr}</strong></div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Status</span><br />
                <span className={`badge badge-${result.status.toLowerCase()}`}>{result.status}</span>
              </div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>From</span><br />{result.boardingStation}</div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>To</span><br />{result.destinationStation}</div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Date</span><br />{result.journeyDate}</div>
              <div><span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 600 }}>Fare</span><br /><strong>Rs. {result.totalFare}</strong></div>
            </div>
            <hr style={{ border: 'none', borderTop: '1px dashed var(--border)', margin: '1rem 0' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Passengers</span>
            <div style={{ marginTop: '0.5rem' }}>
              {result.passengers?.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: i < result.passengers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span>{i + 1}. {p.name} ({p.gender}, {p.age})</span>
                  <strong style={{ color: 'var(--primary)' }}>{p.seatNumber}</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={downloadTicket}>
              <svg style={{width:16,height:16}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Ticket
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/my-bookings')}>
              My Bookings
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>
              Book Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
