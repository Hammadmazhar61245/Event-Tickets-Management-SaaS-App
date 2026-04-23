import { useState } from 'react';

const TicketTierForm = ({ onAddTier }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !totalQuantity) return;
    onAddTier({
      name,
      price: parseFloat(price),
      totalQuantity: parseInt(totalQuantity),
      description
    });
    setName(''); setPrice(''); setTotalQuantity(''); setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 border p-3 rounded bg-gray-50">
      <input placeholder="Tier name (e.g., VIP)" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
      <div className="flex gap-2">
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="flex-1 border p-2 rounded" required step="0.01" min="0" />
        <input type="number" placeholder="Quantity" value={totalQuantity} onChange={(e) => setTotalQuantity(e.target.value)} className="flex-1 border p-2 rounded" required min="1" />
      </div>
      <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-2 rounded" />
      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Add Tier</button>
    </form>
  );
};

export default TicketTierForm;