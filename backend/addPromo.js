import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PromoCode from './models/PromoCode.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const add = async () => {
  try {
    await PromoCode.create({
      code: 'SAVE10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 20,
      isActive: true
    });
    console.log('Promo code SAVE10 added!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

add();