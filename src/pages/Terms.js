import React from "react";
import { motion } from "framer-motion";

const Terms = () => {
  return (
    <div className="pt-20">
      <section className="gradient-bg section-padding text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Terms & Conditions
          </motion.h1>
          <p className="text-primary-200">Last updated: March 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By subscribing to or using the ServerPe Vehicle Alerts platform, you
            agree to these Terms & Conditions. If you do not agree, please do
            not use the platform.
          </p>

          <h2>2. Service Description</h2>
          <p>
            ServerPe Vehicle Alerts provides QR code-based vehicle alert
            notifications. Vehicle owners subscribe, receive QR stickers for
            their vehicles, and get SMS/WhatsApp alerts when a member of the
            public scans the QR code to report a concern.
          </p>

          <h2>3. Subscription & Plans</h2>
          <ul>
            <li>New users receive a free trial with 2 test alert scans.</li>
            <li>
              After the free trial, users must subscribe to a paid plan for
              continued service.
            </li>
            <li>
              Subscription plans and pricing are displayed on the platform and
              subject to change.
            </li>
            <li>Payments are processed securely through Razorpay.</li>
          </ul>

          <h2>4. QR Code Stickers</h2>
          <ul>
            <li>
              Each subscriber receives 2 premium waterproof vinyl matte QR code
              stickers upon first subscription.
            </li>
            <li>Additional stickers may be purchased from the platform.</li>
            <li>
              Stickers are linked to a specific vehicle and should not be
              transferred.
            </li>
            <li>
              Damaged or lost stickers can be replaced by contacting support.
            </li>
          </ul>

          <h2>5. User Responsibilities</h2>
          <ul>
            <li>Provide accurate vehicle registration details.</li>
            <li>Place QR stickers in visible areas of the vehicle.</li>
            <li>Keep your subscription active for uninterrupted alerts.</li>
            <li>
              Do not misuse the platform for fraudulent or illegal purposes.
            </li>
          </ul>

          <h2>6. Public Users (Scanners)</h2>
          <ul>
            <li>Scanning is anonymous — no registration or app required.</li>
            <li>Scanners must use the service responsibly.</li>
            <li>
              False or malicious reports may result in QR code suspension.
            </li>
            <li>
              After 5 misuse reports, a QR code will be automatically blocked
              for investigation.
            </li>
          </ul>

          <h2>7. Limitation of Liability</h2>
          <p>
            ServerPe Vehicle Alerts provides a notification service and is not
            responsible for:
          </p>
          <ul>
            <li>Actions taken by vehicle owners or public scanners</li>
            <li>
              Delayed or undelivered SMS/WhatsApp notifications due to telecom
              issues
            </li>
            <li>Vehicle damage, theft, or any related incidents</li>
            <li>Misuse of QR code stickers by unauthorised individuals</li>
          </ul>

          <h2>8. Refund Policy</h2>
          <p>
            Subscription fees are non-refundable once the plan is activated.
            However, in case of technical issues preventing service delivery,
            contact support for resolution.
          </p>

          <h2>9. Account Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these terms, engage in fraudulent activity, or misuse the platform.
          </p>

          <h2>10. Modifications</h2>
          <p>
            We may update these Terms & Conditions from time to time. Continued
            use of the platform after changes constitutes acceptance of the new
            terms.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These terms are governed by the laws of India. Any disputes shall be
            subject to the jurisdiction of courts in Karnataka, India.
          </p>

          <h2>12. Contact</h2>
          <p>
            For queries regarding these terms:
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

export default Terms;
