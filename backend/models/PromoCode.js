import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxUses: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  validFrom: { type: Date },
  validUntil: { type: Date },
  isActive: { type: Boolean, default: true }
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);
export default PromoCode;