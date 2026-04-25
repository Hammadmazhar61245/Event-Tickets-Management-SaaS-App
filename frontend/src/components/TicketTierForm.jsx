import { useState } from 'react';

const TicketTierForm = ({ onAddTier }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();  // just in case (if button somehow triggers a parent form)
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
    <div className="space-y-2 border p-3 rounded bg-gray-50 dark:bg-gray-800">
      <input
        placeholder="Tier name (e.g., VIP)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="flex-1 border p-2 rounded"
          required
          step="0.01"
          min="0"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={totalQuantity}
          onChange={(e) => setTotalQuantity(e.target.value)}
          className="flex-1 border p-2 rounded"
          required
          min="1"
        />
      </div>
      <input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        type="button"
        onClick={handleAdd}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Add Tier
      </button>
    </div>
  );
};

export default TicketTierForm;