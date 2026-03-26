import React from "react";
import { motion } from "framer-motion";

const RefundPolicy = () => {
  return (
    <div className="pt-20">
      <section className="gradient-bg section-padding text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Refund Policy
          </motion.h1>
          <p className="text-primary-200">Last updated: March 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h2>1. Subscription Refunds</h2>
          <p>
            Once a subscription plan is activated, the fee is{" "}
            <strong>non-refundable</strong>. Please review the plan details
            carefully before purchasing.
          </p>

          <h2>2. Exceptions</h2>
          <p>Refunds may be considered in the following scenarios:</p>
          <ul>
            <li>
              Technical issues on our end that prevent alerts from being
              delivered throughout the subscription period.
            </li>
            <li>Duplicate payment due to a system error.</li>
            <li>Payment charged without plan activation.</li>
          </ul>

          <h2>3. How to Request a Refund</h2>
          <p>
            Contact us at{" "}
            <a href="mailto:support@serverpe.in">support@serverpe.in</a> or call
            +91 7996083415 with your payment details and reason for the refund
            request.
          </p>

          <h2>4. Processing Time</h2>
          <p>
            Approved refunds will be processed within 7-10 business days to the
            original payment method.
          </p>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
