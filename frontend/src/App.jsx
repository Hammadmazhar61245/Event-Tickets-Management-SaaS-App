import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/MyEventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import MyEventsPage from './pages/MyEventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import MyTicketsPage from './pages/MyTicketsPage';
import OrdersPage from './pages/OrdersPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="checkout/:eventId" element={<CheckoutPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="my-tickets" element={<MyTicketsPage />} />
            <Route path="my-orders" element={<OrdersPage />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="organizer" />}>
            <Route path="organizer/events" element={<MyEventsPage />} />
            <Route path="organizer/events/create" element={<CreateEventPage />} />
            <Route path="organizer/events/:id/edit" element={<EditEventPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;