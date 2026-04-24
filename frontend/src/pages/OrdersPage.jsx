import { useEffect, useState } from 'react';
import api from '../api/axios';
import { formatDate } from '../utils/formatDate';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/myorders')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Order History</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{order.eventId?.title || 'Event'}</h3>
                  <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-600">Total: ${order.totalAmount}</p>
                  <p className="text-sm text-gray-600">Status: {order.paymentStatus}</p>
                  <p className="text-xs text-gray-500">Placed: {formatDate(order.createdAt)}</p>
                </div>
                <div>
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm">{item.quantity} x {item.tierName}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;