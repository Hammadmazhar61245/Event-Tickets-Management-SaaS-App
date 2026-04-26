import PromoCode from '../models/PromoCode.js';

export const validatePromo = async (req, res) => {
  const { code, orderTotal } = req.body;
  try {
    const promo = await PromoCode.findOne({ code: code.toUpperCase() });
    if (!promo || !promo.isActive) {
      return res.status(400).json({ message: 'Invalid promo code' });
    }
    if (promo.validFrom && new Date() < promo.validFrom) {
      return res.status(400).json({ message: 'Promo code not yet active' });
    }
    if (promo.validUntil && new Date() > promo.validUntil) {
      return res.status(400).json({ message: 'Promo code expired' });
    }
    if (promo.maxUses && promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ message: 'Promo code usage limit reached' });
    }
    if (orderTotal < promo.minOrderAmount) {
      return res.status(400).json({ message: `Minimum order of $${promo.minOrderAmount} required` });
    }

    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = (orderTotal * promo.discountValue) / 100;
    } else {
      discountAmount = promo.discountValue;
    }
    discountAmount = Math.min(discountAmount, orderTotal);
    const newTotal = orderTotal - discountAmount;

    res.json({
      valid: true,
      discountAmount: discountAmount.toFixed(2),
      newTotal: newTotal.toFixed(2),
      promoCode: promo.code
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyPromoCode = async (code) => {
  const promo = await PromoCode.findOne({ code: code.toUpperCase() });
  if (promo) {
    promo.usedCount += 1;
    await promo.save();
  }
};