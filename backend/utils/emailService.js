import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmation = async (userEmail, order, event) => {
  const itemsList = order.items.map(item => `${item.quantity} x ${item.tierName}`).join(', ');

  const mailOptions = {
    from: `"Event Ticketing" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Order Confirmation for ${event.title}`,
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Your order for <strong>${event.title}</strong> has been confirmed.</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Items:</strong> ${itemsList}</p>
      <p><strong>Total:</strong> $${order.totalAmount}</p>
      <p>Venue: ${event.venue}, ${event.address}</p>
      <p>Date: ${new Date(event.startDate).toLocaleString()}</p>
      <p>Your tickets are available in your account dashboard.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendVerificationEmail = async (userEmail, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

  const mailOptions = {
    from: `"Event Ticketing" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Verify Your Email Address',
    html: `
      <h2>Welcome to EventTix!</h2>
      <p>Please click the button below to verify your email address and start using your account.</p>
      <a href="${verificationUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:white;border-radius:8px;text-decoration:none;margin:20px 0;">Verify Email</a>
      <p>If you didn’t sign up, you can safely ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};