import React from "react";
import { motion } from "framer-motion";

const Privacy = () => {
  return (
    <div className="pt-20">
      <section className="gradient-bg section-padding text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Privacy Policy
          </motion.h1>
          <p className="text-primary-200">Last updated: March 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h2>1. Introduction</h2>
          <p>
            ServerPe ("we," "us," or "our") operates the ServerPe Vehicle Alerts
            platform. This Privacy Policy describes how we collect, use, and
            protect your personal information when you use our platform at
            serverpe.in.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>From Vehicle Owners:</h3>
          <ul>
            <li>Full name</li>
            <li>Mobile phone number (kept strictly confidential)</li>
            <li>Email address (optional)</li>
            <li>Vehicle registration number</li>
            <li>Delivery address for QR stickers</li>
            <li>Payment information (processed via Razorpay)</li>
          </ul>

          <h3>From Public Users (Scanners):</h3>
          <ul>
            <li>Selected concern message</li>
            <li>Custom message (if provided, max 20 characters)</li>
            <li>Device information and IP address</li>
            <li>Location data (only if the user permits)</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>
              To deliver SMS and WhatsApp alert notifications to vehicle owners
            </li>
            <li>To generate and deliver QR code stickers</li>
            <li>To process subscription payments</li>
            <li>To provide customer support</li>
            <li>To prevent misuse of the platform</li>
          </ul>

          <h2>4. Mobile Number Confidentiality</h2>
          <p>
            <strong>Your mobile number is NEVER shared with anyone.</strong>{" "}
            When a person scans the QR code on your vehicle, they do not see
            your phone number. They only see a list of concern options. The
            notification is sent through our platform directly to your number.
          </p>

          <h2>5. Data Protection</h2>
          <p>
            We implement appropriate security measures to protect your personal
            information. All data is transmitted over secure connections.
            Payment data is handled by Razorpay and we do not store your
            financial credentials.
          </p>

          <h2>6. Cookies</h2>
          <p>
            We use HTTP-only cookies for authentication purposes (session
            management). These cookies are essential for the functioning of the
            platform and expire within a short period.
          </p>

          <h2>7. Third-Party Services</h2>
          <ul>
            <li>
              <strong>Razorpay:</strong> For payment processing
            </li>
            <li>
              <strong>Fast2SMS:</strong> For SMS notifications
            </li>
            <li>
              <strong>WhatsApp:</strong> For WhatsApp alert notifications
              (premium plans)
            </li>
          </ul>

          <h2>8. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. You can
            request deletion of your data by contacting us at
            support@serverpe.in.
          </p>

          <h2>9. Your Rights</h2>
          <ul>
            <li>Request access to your personal data</li>
            <li>Request correction of your personal data</li>
            <li>Request deletion of your personal data</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2>10. Contact Us</h2>
          <p>
            For any privacy concerns, contact us at:
            <br />
            Email: <a href="mailto:support@serverpe.in">support@serverpe.in</a>
            <br />
            Phone: +91 7996083415
          </p>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
