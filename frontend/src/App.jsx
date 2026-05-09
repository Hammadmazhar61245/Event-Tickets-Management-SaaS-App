import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';                     // top navbar (public only)
import AttendeeLayout from './components/AttendeeLayout';     // attendee sidebar
import OrganizerLayout from './components/OrganizerLayout';   // organizer sidebar

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

import AttendeeDashboard from './pages/AttendeeDashboard';
import MyTicketsPage from './pages/MyTicketsPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import BookmarksPage from './pages/BookmarksPage';
import CheckoutPage from './pages/CheckoutPage';

import OrganizerDashboard from './pages/OrganizerDashboard';
import OrganizerEvents from './pages/OrganizerEvents';
import OrganizerCreateEvent from './pages/OrganizerCreateEvent';
import OrganizerAttendees from './pages/OrganizerAttendees';
import OrganizerTickets from './pages/OrganizerTickets';
import OrganizerSpeakers from './pages/OrganizerSpeakers';
import OrganizerVenues from './pages/OrganizerVenues';
import OrganizerAnalytics from './pages/AnalyticsPage';
import OrganizerSettings from './pages/OrganizerSettings';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ───── Public routes (top navbar) ───── */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="verify-email/:token" element={<VerifyEmailPage />} />
        </Route>

        {/* ───── Attendee routes (sidebar layout) ───── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AttendeeLayout />}>
            <Route path="dashboard" element={<AttendeeDashboard />} />
            <Route path="my-tickets" element={<MyTicketsPage />} />
            <Route path="my-orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="bookmarks" element={<BookmarksPage />} />
            <Route path="checkout/:eventId" element={<CheckoutPage />} />
          </Route>
        </Route>

        {/* ───── Organizer routes (sidebar layout) ───── */}
        <Route element={<ProtectedRoute requiredRole="organizer" />}>
          <Route element={<OrganizerLayout />}>
            <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
            <Route path="/organizer/events" element={<OrganizerEvents />} />
            <Route path="/organizer/events/create" element={<OrganizerCreateEvent />} />
            <Route path="/organizer/attendees" element={<OrganizerAttendees />} />
            <Route path="/organizer/tickets" element={<OrganizerTickets />} />
            <Route path="/organizer/speakers" element={<OrganizerSpeakers />} />
            <Route path="/organizer/venues" element={<OrganizerVenues />} />
            <Route path="/organizer/bookmarks" element={<BookmarksPage />} />
            <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />
            <Route path="/organizer/settings" element={<OrganizerSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

