import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiMapPin,
  FiUser,
  FiBookmark,
  FiShare2,
} from 'react-icons/fi';
import { FaStar, FaRegStar } from 'react-icons/fa';   // ← fixed here
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookmarked, setBookmarked] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState([]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  const fetchEvent = useCallback(async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);

      if (user) {
        const bookmarksRes = await api.get('/bookmarks');
        const ids = bookmarksRes.data.map((e) => e._id);
        setUserBookmarks(ids);
        setBookmarked(ids.includes(id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await api.get(`/reviews/event/${id}`);
      setReviews(res.data.reviews);
      setAvgRating(res.data.average);
      setReviewCount(res.data.count);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
    fetchReviews();

    const interval = setInterval(() => {
      api.get(`/events/${id}`).then((res) => setEvent(res.data));
      fetchReviews();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchEvent, fetchReviews, id]);

  const toggleBookmark = async () => {
    if (!user) return toast.error('Login to bookmark');
    try {
      await api.put(`/bookmarks/${id}`);
      setBookmarked(!bookmarked);
      toast.success(bookmarked ? 'Bookmark removed' : 'Event bookmarked!');
      const bookmarksRes = await api.get('/bookmarks');
      setUserBookmarks(bookmarksRes.data.map((e) => e._id));
    } catch (err) {
      toast.error('Error toggling bookmark');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error('Please write a comment');
    try {
      await api.post('/reviews', { eventId: id, rating, comment });
      toast.success('Review submitted!');
      setShowReviewForm(false);
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    }
  };

  const shareUrl = window.location.href;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    );
  }

  if (!event) {
    return <div className="text-center text-red-500">Event not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* ------ Event Header ------ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass rounded-2xl overflow-hidden shadow-2xl"
      >
        <img
          src={event.bannerImageUrl || 'https://via.placeholder.com/1200x400'}
          alt={event.title}
          className="w-full h-72 object-cover"
        />
        <div className="p-8">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold gradient-text">{event.title}</h1>
            <div className="flex space-x-3">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full ${
                  bookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                }`}
              >
                <FiBookmark className="w-6 h-6" />
              </button>
              <div className="relative group">
                <button className="p-2 rounded-full text-gray-400 hover:text-primary-500">
                  <FiShare2 className="w-6 h-6" />
                </button>
                <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-3 hidden group-hover:flex space-x-2">
                  <FacebookShareButton url={shareUrl} quote={event.title}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <TwitterShareButton url={shareUrl} title={event.title}>
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                  <WhatsappShareButton url={shareUrl} title={event.title}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600 dark:text-gray-300">
            <span className="flex items-center">
              <FiUser className="mr-2" /> {event.organizerId?.name}
            </span>
            <span className="flex items-center">
              <FiCalendar className="mr-2" /> {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
            <span className="flex items-center">
              <FiMapPin className="mr-2" /> {event.venue}, {event.address}
            </span>
          </div>
          <p className="mt-6 whitespace-pre-line text-gray-700 dark:text-gray-200 leading-relaxed">
            {event.description}
          </p>
        </div>
      </motion.div>

      {/* ------ Ticket Tiers ------ */}
      <h2 className="text-3xl font-bold mt-12 mb-6 dark:text-white">Ticket Tiers</h2>
      <div className="grid gap-6">
        {event.tiers?.length > 0 ? (
          event.tiers.map((tier) => (
            <motion.div
              key={tier._id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              whileHover={{ scale: 1.01 }}
              className="glass rounded-xl p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-xl dark:text-white">{tier.name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{tier.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Available: {tier.totalQuantity - tier.soldCount} / {tier.totalQuantity}
                  <span className="ml-3 text-green-500">({tier.soldCount} sold)</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold gradient-text">${tier.price}</p>
                {user ? (
                  <Link
                    to={`/checkout/${event._id}`}
                    state={{ tiers: event.tiers }}
                    className="mt-2 inline-block gradient-bg text-white px-6 py-2 rounded-full hover:scale-105 transition-transform"
                  >
                    Select
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="mt-2 inline-block bg-gray-500 text-white px-6 py-2 rounded-full"
                  >
                    Login to Buy
                  </Link>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No ticket tiers available.</p>
        )}
      </div>

      {/* ------ Reviews Section ------ */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold dark:text-white mb-2">
          Reviews {reviewCount > 0 && `(${reviewCount})`}
        </h2>
        {reviewCount > 0 && (
          <p className="text-xl text-yellow-500 mb-4">
            {[...Array(5)].map((_, i) =>
              i < Math.round(avgRating) ? (
                <FaStar key={i} className="inline w-6 h-6" />
              ) : (
                <FaRegStar key={i} className="inline w-6 h-6 text-gray-300" />
              )
            )}
            <span className="text-gray-600 dark:text-gray-300 ml-2">{avgRating} out of 5</span>
          </p>
        )}

        {user && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="gradient-bg text-white px-6 py-2 rounded-full mb-6 hover:scale-105 transition-transform"
          >
            Write a Review
          </button>
        )}

        {showReviewForm && (
          <motion.form
            onSubmit={submitReview}
            className="glass rounded-xl p-6 mb-6 space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Your Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    {star <= rating ? (
                      <FaStar className="text-yellow-500 w-7 h-7" />
                    ) : (
                      <FaRegStar className="text-gray-400 w-7 h-7" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                type="submit"
                className="gradient-bg text-white py-2 px-6 rounded-full"
              >
                Submit Review
              </motion.button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full dark:text-white"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src={review.userId?.profilePicture || '/default-avatar.png'}
                    alt={review.userId?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold dark:text-white">{review.userId?.name}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) =>
                        i < review.rating ? (
                          <FaStar key={i} className="text-yellow-500 w-4 h-4" />
                        ) : (
                          <FaRegStar key={i} className="text-gray-300 w-4 h-4" />
                        )
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{review.comment}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailsPage;