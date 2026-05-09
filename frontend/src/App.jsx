import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import MyTicketsPage from './pages/MyTicketsPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import BookmarksPage from './pages/BookmarksPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProtectedRoute from './components/ProtectedRoute';

// Organizer sidebar layout
import OrganizerLayout from './components/OrganizerLayout';
import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerEvents from './pages/OrganizerEvents';
import OrganizerCreateEvent from './pages/OrganizerCreateEvent';
import OrganizerAttendees from './pages/OrganizerAttendees';
import OrganizerTickets from './pages/OrganizerTickets';
import OrganizerSpeakers from './pages/OrganizerSpeakers';
import OrganizerVenues from './pages/OrganizerVenues';
import OrganizerAnalytics from './pages/AnalyticsPage'; // reuse existing analytics
import OrganizerSettings from './pages/OrganizerSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="verify-email/:token" element={<VerifyEmailPage />} />

          {/* Attendee protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="my-tickets" element={<MyTicketsPage />} />
            <Route path="my-orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="bookmarks" element={<BookmarksPage />} />
            <Route path="checkout/:eventId" element={<CheckoutPage />} />
          </Route>

          {/* Organizer routes with sidebar layout */}
          <Route element={<ProtectedRoute requiredRole="organizer" />}>
            <Route path="organizer" element={<OrganizerLayout />}>
              <Route path="dashboard" element={<OrganizerDashboard />} />
              <Route path="events" element={<OrganizerEvents />} />
              <Route path="events/create" element={<OrganizerCreateEvent />} />
              <Route path="attendees" element={<OrganizerAttendees />} />
              <Route path="tickets" element={<OrganizerTickets />} />
              <Route path="speakers" element={<OrganizerSpeakers />} />
              <Route path="venues" element={<OrganizerVenues />} />
              <Route path="analytics" element={<OrganizerAnalytics />} />
              <Route path="settings" element={<OrganizerSettings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;