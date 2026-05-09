import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Event from './models/Event.js';
import TicketTier from './models/TicketTier.js';
import Speaker from './models/Speaker.js';
import Venue from './models/Venue.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // ---- Users ----
    let organizer = await User.findOne({ email: 'organizer@demo.com' });
    if (!organizer) {
      organizer = await User.create({
        name: 'Demo Organizer',
        email: 'organizer@demo.com',
        passwordHash: 'demo123456',
        role: 'organizer',
        phone: '1234567890',
        isVerified: true,
      });
      console.log('Organizer created: organizer@demo.com / demo123456');
    }

    let attendee = await User.findOne({ email: 'attendee@demo.com' });
    if (!attendee) {
      await User.create({
        name: 'Demo Attendee',
        email: 'attendee@demo.com',
        passwordHash: 'demo123456',
        role: 'attendee',
        phone: '0987654321',
        isVerified: true,
      });
      console.log('Attendee created: attendee@demo.com / demo123456');
    }

    // ---- Speakers ----
    const speakersData = [
      { name: 'Dr. Sarah Johnson', bio: 'AI researcher and keynote speaker', imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg', email: 'sarah@speaker.com' },
      { name: 'Mark Chen', bio: 'Full‑stack developer & open‑source advocate', imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg', email: 'mark@speaker.com' },
      { name: 'Elena Rodriguez', bio: 'UX designer at a leading tech firm', imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg', email: 'elena@speaker.com' },
      { name: 'James Okafor', bio: 'Founder of Startup XYZ, investor', imageUrl: 'https://randomuser.me/api/portraits/men/78.jpg', email: 'james@speaker.com' },
    ];

    for (const sp of speakersData) {
      const exists = await Speaker.findOne({ email: sp.email, organizerId: organizer._id });
      if (!exists) {
        await Speaker.create({ ...sp, organizerId: organizer._id });
        console.log(`Speaker added: ${sp.name}`);
      }
    }

    // ---- Venues ----
    const venuesData = [
      { name: 'Grand Arena', address: '123 Main Street, Downtown', capacity: 500, imageUrl: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { name: 'Innovation Hub', address: '456 Tech Park, Silicon Valley', capacity: 200, imageUrl: 'https://images.unsplash.com/photo-1497366753790-7e4b0e6b5c9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { name: 'Skyline Conference Center', address: '789 Highrise Blvd, New York', capacity: 800, imageUrl: 'https://images.unsplash.com/photo-1558730234-03b0b3b3b3b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
      { name: 'Riverside Pavilion', address: '321 River Road, Austin', capacity: 350, imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    ];

    for (const v of venuesData) {
      const exists = await Venue.findOne({ name: v.name, organizerId: organizer._id });
      if (!exists) {
        await Venue.create({ ...v, organizerId: organizer._id });
        console.log(`Venue added: ${v.name}`);
      }
    }

    // ---- Events & Tiers (keep existing) ----
    const events = [
      {
        title: 'Summer Music Festival',
        description: 'A three-day outdoor music festival featuring top artists from around the world.',
        category: 'Music',
        venue: 'Central Park',
        address: '123 Park Ave, New York, NY',
        startDate: new Date('2025-07-15T10:00:00'),
        endDate: new Date('2025-07-17T22:00:00'),
        bannerImageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tiers: [
          { name: 'General Admission', price: 49.99, totalQuantity: 500, description: 'Access to all general areas' },
          { name: 'VIP Pass', price: 149.99, totalQuantity: 100, description: 'Front-row access, VIP lounge, free drinks' },
        ],
      },
      {
        title: 'Tech Conference 2025',
        description: 'The biggest tech conference of the year. Learn about AI, blockchain, and the future of software.',
        category: 'Technology',
        venue: 'Convention Center',
        address: '456 Tech Blvd, San Francisco, CA',
        startDate: new Date('2025-08-20T09:00:00'),
        endDate: new Date('2025-08-22T18:00:00'),
        bannerImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tiers: [
          { name: 'Early Bird', price: 199.99, totalQuantity: 200, description: 'Full access, early registration price' },
          { name: 'Regular', price: 299.99, totalQuantity: 300, description: 'Full access' },
          { name: 'Workshop Add-on', price: 99.99, totalQuantity: 50, description: 'Hands-on workshop sessions' },
        ],
      },
      {
        title: 'Food & Wine Expo',
        description: 'Taste exquisite dishes from renowned chefs and sample fine wines from around the world.',
        category: 'Food',
        venue: 'Grand Exhibition Hall',
        address: '789 Gourmet St, Chicago, IL',
        startDate: new Date('2025-09-10T11:00:00'),
        endDate: new Date('2025-09-12T20:00:00'),
        bannerImageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tiers: [
          { name: 'Standard Tasting', price: 75.00, totalQuantity: 400, description: 'Access to all tasting booths' },
          { name: 'Premium Experience', price: 150.00, totalQuantity: 150, description: 'Includes reserved seating, premium wines, and chef meet & greet' },
        ],
      },
      {
        title: 'Startup Pitch Night',
        description: 'Watch 10 startups pitch their ideas to a panel of investors. Network with founders and VCs.',
        category: 'Business',
        venue: 'Innovation Hub',
        address: '101 Startup Lane, Austin, TX',
        startDate: new Date('2025-10-05T18:00:00'),
        endDate: new Date('2025-10-05T22:00:00'),
        bannerImageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tiers: [
          { name: 'Attendee', price: 25.00, totalQuantity: 300, description: 'General seating' },
          { name: 'Investor Pass', price: 0, totalQuantity: 50, description: 'Free for accredited investors' },
        ],
      },
    ];

    for (const eventData of events) {
      const { tiers, ...eventFields } = eventData;
      const exists = await Event.findOne({ title: eventFields.title, organizerId: organizer._id });
      if (!exists) {
        const event = await Event.create({ ...eventFields, organizerId: organizer._id, status: 'published' });
        for (const tier of tiers) {
          await TicketTier.create({ ...tier, eventId: event._id });
        }
        console.log(`Event created: ${event.title}`);
      } else {
        console.log(`Event already exists: ${eventFields.title}`);
      }
    }

    console.log('✅ Seeding complete (users, events, tiers, speakers, venues).');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();