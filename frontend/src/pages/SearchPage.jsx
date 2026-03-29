import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const I = {
  search: <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  calendar: <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  seat: <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1H7v-1a2 2 0 0 0-4 0z"/><path d="M5 18v2M19 18v2"/></svg>,
  route: <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>,
  rupee: <svg style={{width:14,height:14}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12M6 8h12M6 13l8.5 8M14.5 13a4.65 4.65 0 0 0 .5-2 4.67 4.67 0 0 0-.5-2H6"/></svg>,
};

export default function SearchPage() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allTrains, setAllTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Load all trains on mount
  useEffect(() => {
    api.get('/trains').then(res => setAllTrains(res.data.data || [])).catch(() => {});
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!source || !destination) { setError('Source and destination are required'); return; }
    setError('');
    setLoading(true);
    try {
      const params = { source, destination };
      if (date) params.date = date;
      const res = await api.get('/trains/search', { params });
      setSearchResults(res.data.data || []);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    }
    setLoading(false);
  };

  const TrainCard = ({ train }) => (
    <div className="train-card" onClick={() => navigate(`/trains/${train.id}`)}>
      <div className="train-card-header">
        <div>
          <div className="train-name">{train.trainName}</div>
          <div className="train-number">#{train.trainNumber}</div>
        </div>
        <div className="train-fare">{I.rupee} {train.baseFare}</div>
      </div>
      <div className="train-route">
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
      <div className="train-meta">
        <span>{I.calendar} {train.date}</span>
        <span>{I.seat} {train.availableSeats} / {train.totalSeats} seats</span>
        <span>{I.route} {train.stations?.length || 0} stops</span>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="search-hero">
        <h1>Find Your Train</h1>
        <p>Search from hundreds of trains across India</p>
      </div>

      <div className="card-elevated" style={{ marginBottom: '2rem' }}>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label>From Station</label>
              <input className="form-control" placeholder="e.g. New Delhi"
                value={source} onChange={e => setSource(e.target.value)} />
            </div>
            <div className="form-group">
              <label>To Station</label>
              <input className="form-control" placeholder="e.g. Mumbai Central"
                value={destination} onChange={e => setDestination(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Date (Optional)</label>
              <input className="form-control" type="date" value={date}
                onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary btn-lg btn-block" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {I.search} {loading ? 'Searching...' : 'Search Trains'}
          </button>
        </form>
      </div>

      {/* Search Results */}
      {searched && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1rem' }}>
            {searchResults.length > 0 ? `${searchResults.length} Train${searchResults.length > 1 ? 's' : ''} Found` : 'No Matching Trains'}
          </h2>
          {searchResults.map(train => <TrainCard key={train.id} train={train} />)}
          {searchResults.length === 0 && (
            <div className="empty-state">
              <h3>No trains found for this route</h3>
              <p>Try different source, destination, or date</p>
            </div>
          )}
        </div>
      )}

      {/* All Trains */}
      <div>
        <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {I.route} All Available Trains
        </h2>
        {allTrains.length === 0 ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : (
          allTrains.map(train => <TrainCard key={train.id} train={train} />)
        )}
      </div>
    </div>
  );
}
