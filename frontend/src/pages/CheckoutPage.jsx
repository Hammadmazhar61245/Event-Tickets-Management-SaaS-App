import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tiers = location.state?.tiers || [];

  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [proceeded, setProceeded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${eventId}`);
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        const qtyMap = {};
        items.forEach(item => {
          qtyMap[item.tierId] = item.quantity;
        });
        setSelectedQuantities(qtyMap);
      } catch (e) {
        console.error('Cart parse error');
      }
    }
  }, [eventId]);

  const handleQuantityChange = (tierId, quantity) => {
    setSelectedQuantities(prev => ({ ...prev, [tierId]: parseInt(quantity) || 0 }));
  };

  // Calculate total
  const itemsArray = Object.entries(selectedQuantities)
    .filter(([_, qty]) => qty > 0)
    .map(([tierId, quantity]) => {
      const tier = tiers.find(t => t._id === tierId);
      return { tierId, quantity, tierName: tier?.name, unitPrice: tier?.price };
    });
  const total = itemsArray.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);

  const proceedToSummary = () => {
    if (itemsArray.length === 0) {
      alert('Please select at least one ticket.');
      return;
    }
    localStorage.setItem(`cart_${eventId}`, JSON.stringify(itemsArray));
    setProceeded(true);
  };

  const handleConfirmPurchase = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/orders/simulate-payment', {
        eventId,
        items: itemsArray.map(i => ({ tierId: i.tierId, quantity: i.quantity }))
      });
      localStorage.removeItem(`cart_${eventId}`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center py-8">Please log in to purchase tickets.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        {proceeded ? 'Confirm Your Purchase' : 'Select Tickets'}
      </h2>

      {!proceeded ? (
        <div>
          {tiers.map(tier => (
            <div key={tier._id} className="border p-4 mb-3 rounded flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{tier.name}</h3>
                <p className="text-gray-600">${tier.price} each</p>
                <p className="text-sm text-gray-500">
                  Available: {tier.totalQuantity - tier.soldCount}
                </p>
              </div>
              <input
                type="number"
                min="0"
                max={tier.totalQuantity - tier.soldCount}
                value={selectedQuantities[tier._id] || 0}
                onChange={(e) => handleQuantityChange(tier._id, e.target.value)}
                className="border p-2 w-20 rounded text-center"
              />
            </div>
          ))}
          <button
            onClick={proceedToSummary}
            className="w-full bg-indigo-600 text-white py-2 rounded mt-4 hover:bg-indigo-700"
          >
            Proceed to Payment
          </button>
        </div>
      ) : (
        <div>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            {itemsArray.map(item => (
              <div key={item.tierId} className="flex justify-between py-2 border-b">
                <span>{item.quantity} × {item.tierName} (${item.unitPrice})</span>
                <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <button
            onClick={handleConfirmPurchase}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Purchase (Simulated Payment)'}
          </button>
          <button
            onClick={() => setProceeded(false)}
            className="w-full mt-2 text-indigo-600 hover:underline"
          >
            ← Back to ticket selection
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;