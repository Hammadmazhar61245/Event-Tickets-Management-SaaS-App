import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ eventId, tiers, clientSecret, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/dashboard` },
      redirect: 'if_required'
    });

    if (confirmError) {
      setError(confirmError.message);
      setProcessing(false);
    } else if (paymentIntent?.status === 'succeeded') {
      // Create order in backend
      const selectedTiers = JSON.parse(localStorage.getItem(`cart_${eventId}`)) || [];
      try {
        await api.post('/orders', {
          eventId,
          items: selectedTiers,
          paymentIntentId: paymentIntent.id
        });
        localStorage.removeItem(`cart_${eventId}`);
        navigate('/dashboard');
      } catch (err) {
        setError('Order creation failed. Please contact support.');
      }
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <PaymentElement />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button type="submit" disabled={!stripe || processing} className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
        Pay ${total}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState('');
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const tiers = location.state?.tiers || [];
  const [selectedQuantities, setSelectedQuantities] = useState({});

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${eventId}`);
    if (savedCart) {
      setSelectedQuantities(JSON.parse(savedCart).reduce((acc, item) => {
        acc[item.tierId] = item.quantity;
        return acc;
      }, {}));
    }
  }, [eventId]);

  const handleQuantityChange = (tierId, quantity) => {
    setSelectedQuantities(prev => ({ ...prev, [tierId]: parseInt(quantity) || 0 }));
  };

  const prepareCheckout = async () => {
    const items = Object.entries(selectedQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([tierId, quantity]) => ({ tierId, quantity }));
    if (items.length === 0) return alert('Select at least one ticket');
    localStorage.setItem(`cart_${eventId}`, JSON.stringify(items));
    try {
      const res = await api.post('/orders/create-payment-intent', { eventId, items });
      setClientSecret(res.data.clientSecret);
      setTotal(res.data.total);
      setLoading(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error preparing checkout');
    }
  };

  if (!user) return <div>Please log in to purchase tickets.</div>;

  if (!clientSecret) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Select Tickets</h2>
        {tiers.map(tier => (
          <div key={tier._id} className="border p-4 mb-3 rounded">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">{tier.name}</h3>
                <p>${tier.price} each</p>
                <p className="text-sm">Available: {tier.totalQuantity - tier.soldCount}</p>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max={tier.totalQuantity - tier.soldCount}
                  value={selectedQuantities[tier._id] || 0}
                  onChange={(e) => handleQuantityChange(tier._id, e.target.value)}
                  className="border p-1 w-20 rounded"
                />
              </div>
            </div>
          </div>
        ))}
        <button onClick={prepareCheckout} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Proceed to Payment</button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm eventId={eventId} tiers={tiers} clientSecret={clientSecret} total={total} />
    </Elements>
  );
};

export default CheckoutPage;