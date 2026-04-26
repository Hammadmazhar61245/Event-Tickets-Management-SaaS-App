import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { eventId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tiers = location.state?.tiers || [];

  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [proceeded, setProceeded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Promo states
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [adjustedTotal, setAdjustedTotal] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`cart_${eventId}`);
    if (saved) {
      const items = JSON.parse(saved);
      const qtyMap = {};
      items.forEach(i => { qtyMap[i.tierId] = i.quantity; });
      setSelectedQuantities(qtyMap);
    }
  }, [eventId]);

  const handleQty = (tierId, qty) => setSelectedQuantities(prev => ({ ...prev, [tierId]: parseInt(qty) || 0 }));

  const itemsArray = Object.entries(selectedQuantities)
    .filter(([_, qty]) => qty > 0)
    .map(([tierId, qty]) => {
      const tier = tiers.find(t => t._id === tierId);
      return { tierId, quantity: qty, tierName: tier?.name, unitPrice: tier?.price };
    });
  const total = itemsArray.reduce((sum, i) => sum + (i.unitPrice || 0) * i.quantity, 0);

  const proceedToSummary = () => {
    if (itemsArray.length === 0) return toast.error('Please select at least one ticket.');
    localStorage.setItem(`cart_${eventId}`, JSON.stringify(itemsArray));
    setProceeded(true);
    setAdjustedTotal(total);
  };

  const applyPromo = async () => {
    setPromoError('');
    if (!promoCode.trim()) return;
    try {
      const res = await api.post('/promo/validate', { code: promoCode, orderTotal: total });
      if (res.data.valid) {
        setDiscount(parseFloat(res.data.discountAmount));
        setAdjustedTotal(parseFloat(res.data.newTotal));
        setPromoApplied(true);
        toast.success(`Promo applied! Save $${res.data.discountAmount}`);
      }
    } catch (err) {
      setPromoError(err.response?.data?.message || 'Invalid code');
    }
  };

  const confirmPurchase = async () => {
    setLoading(true);
    try {
      const body = {
        eventId,
        items: itemsArray.map(i => ({ tierId: i.tierId, quantity: i.quantity }))
      };
      if (promoApplied && promoCode) {
        body.promoCode = promoCode;
      }
      await api.post('/orders/simulate-payment', body);
      localStorage.removeItem(`cart_${eventId}`);
      toast.success('Purchase successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center py-8">Please log in to purchase tickets.</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.h2 className="text-3xl font-bold gradient-text mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {proceeded ? 'Confirm Purchase' : 'Select Tickets'}
      </motion.h2>

      {!proceeded ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {tiers.map(tier => (
            <div key={tier._id} className="glass rounded-xl p-5 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg dark:text-white">{tier.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">${tier.price} each</p>
                <p className="text-sm text-gray-500">Available: {tier.totalQuantity - tier.soldCount}</p>
              </div>
              <input type="number" min="0" max={tier.totalQuantity - tier.soldCount}
                value={selectedQuantities[tier._id] || 0}
                onChange={(e) => handleQty(tier._id, e.target.value)}
                className="w-20 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 text-center"
              />
            </div>
          ))}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={proceedToSummary}
            className="w-full gradient-bg text-white py-3 rounded-xl font-semibold mt-4">
            Proceed to Payment
          </motion.button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-xl p-8">
          <h3 className="text-2xl font-bold dark:text-white mb-4">Order Summary</h3>
          {itemsArray.map(item => (
            <div key={item.tierId} className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="dark:text-gray-200">{item.quantity} × {item.tierName} (${item.unitPrice})</span>
              <span className="font-semibold dark:text-white">${(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          {/* Promo code section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <label className="block text-sm font-semibold dark:text-white mb-1">Promo Code</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={promoApplied}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50"
                placeholder="Enter code"
              />
              <button
                onClick={applyPromo}
                disabled={promoApplied || !promoCode}
                className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            {promoError && <p className="text-red-500 text-sm mt-1">{promoError}</p>}
            {promoApplied && (
              <p className="text-green-500 text-sm mt-1">Code applied! Discount: -${discount.toFixed(2)}</p>
            )}
          </div>

          <div className="flex justify-between font-bold text-xl mt-4 dark:text-white">
            <span>Total</span>
            <span className="gradient-text">${(promoApplied ? adjustedTotal : total).toFixed(2)}</span>
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={confirmPurchase} disabled={loading}
            className="w-full mt-6 py-3 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">
            {loading ? 'Processing...' : 'Confirm Purchase (Simulated)'}
          </motion.button>
          <button onClick={() => setProceeded(false)} className="mt-3 text-primary-400 hover:underline w-full text-center">
            ← Back to selection
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default CheckoutPage;