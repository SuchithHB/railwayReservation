import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SearchPage from './pages/SearchPage';
import TrainDetailsPage from './pages/TrainDetailsPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import PnrStatusPage from './pages/PnrStatusPage';
import TrainTrackingPage from './pages/TrainTrackingPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/trains/:id" element={<TrainDetailsPage />} />
          <Route path="/book/:trainId" element={
            <ProtectedRoute><BookingPage /></ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
          } />
          <Route path="/bookings/:pnr" element={
            <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
          } />
          <Route path="/pnr" element={<PnrStatusPage />} />
          <Route path="/tracking" element={<TrainTrackingPage />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
