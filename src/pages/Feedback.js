import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiStar, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Placeholder feedbacks
  const feedbacks = [
    {
      id: 1,
      rating: 5,
      comment:
        "Amazing concept! My vehicle was blocking someone and they alerted me instantly.",
      date: "2 days ago",
    },
    {
      id: 2,
      rating: 4,
      comment: "Very useful service. QR sticker quality is excellent.",
      date: "5 days ago",
    },
    {
      id: 3,
      rating: 5,
      comment: "Finally a solution for parking problems. Love it!",
      date: "1 week ago",
    },
    {
      id: 4,
      rating: 4,
      comment:
        "Good service, easy to use. Hope WhatsApp alerts come soon for free plan.",
      date: "2 weeks ago",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a rating");
    if (!comment.trim()) return toast.error("Please add a comment");
    // API call placeholder
    toast.success("Thank you for your feedback!");
    setSubmitted(true);
  };

  const StarRating = ({ value, onChange, onHover, size = "text-2xl" }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onHover?.(star)}
          onMouseLeave={() => onHover?.(0)}
          className={`${size} transition-colors ${
            star <= (onHover ? hoverRating || value : value)
              ? "text-amber-400"
              : "text-gray-300"
          } hover:scale-110 transition-transform`}
        >
          <FiStar
            fill={star <= (hoverRating || value) ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="pt-20">
      <section className="gradient-bg section-padding text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Feedback
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-100 text-lg"
          >
            We value your feedback. Help us improve!
          </motion.p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Submit Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-display font-bold text-xl text-gray-800 mb-4">
                Share Your Experience
              </h2>
              {submitted ? (
                <div className="card p-8 text-center">
                  <span className="text-5xl block mb-4">🎉</span>
                  <h3 className="font-display font-semibold text-xl text-gray-800 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Your feedback helps us improve the service.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setRating(0);
                      setComment("");
                    }}
                    className="btn-secondary text-sm mt-4"
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating
                    </label>
                    <StarRating
                      value={rating}
                      onChange={setRating}
                      onHover={setHoverRating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Comment / Improvement Suggestion
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="input-field resize-none h-28"
                      placeholder="Tell us what you think or suggest improvements..."
                    />
                  </div>
                  <button type="submit" className="btn-primary gap-2 w-full">
                    <FiSend /> Submit Feedback
                  </button>
                </form>
              )}
            </motion.div>

            {/* Feedback List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-display font-bold text-xl text-gray-800 mb-4">
                What Others Say
              </h2>
              <div className="space-y-4">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="card p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          className={`text-sm ${star <= fb.rating ? "text-amber-400" : "text-gray-300"}`}
                          fill={star <= fb.rating ? "currentColor" : "none"}
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-2">
                        {fb.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{fb.comment}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      — Anonymous User
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;
