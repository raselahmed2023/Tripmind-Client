import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: July 1, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">1. Information We Collect</h2>
          <p>
            When you use TripMind, we collect information you provide directly and information
            collected automatically through your use of the service.
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
            <li><strong>Trip Data:</strong> Destinations, dates, budgets, preferences, and notes you enter for trip planning.</li>
            <li><strong>Payment Information:</strong> Processed securely through Stripe. We do not store credit card numbers.</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, and interaction patterns to improve the service.</li>
            <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers for security and analytics.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">2. How We Use Your Information</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>To provide and maintain the TripMind service.</li>
            <li>To generate personalized travel itineraries using AI.</li>
            <li>To process one-time Trip Plan payments.</li>
            <li>To send service-related communications (account security, billing, updates).</li>
            <li>To improve the overall service quality and user experience.</li>
            <li>To detect and prevent fraud, abuse, and security incidents.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">3. Data Sharing</h2>
          <p>
            We do not sell your personal information. We share data only in the following circumstances:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li><strong>Service Providers:</strong> Trusted third parties that help us operate the service (hosting, payment processing, analytics).</li>
            <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with notice to you).</li>
            <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your data.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">4. Data Security</h2>
          <p>
            We implement industry-standard security measures including encryption in transit (TLS),
            encryption at rest, access controls, and regular security audits. However, no method of
            electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">5. Data Retention</h2>
          <p>
            We retain your account information for as long as your account is active. Trip data is
            retained until you delete it. After account deletion, we remove personal data within 30
            days, except where required by law or for legitimate business purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Access the personal data we hold about you.</li>
            <li>Correct inaccurate personal data.</li>
            <li>Request deletion of your personal data.</li>
            <li>Object to or restrict processing of your data.</li>
            <li>Data portability (receive your data in a structured format).</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, contact us at{" "}
            <a href="mailto:privacy@tripmind.ai" className="text-primary-500 hover:text-primary-600 underline">
              privacy@tripmind.ai
            </a>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">7. Cookies</h2>
          <p>
            TripMind uses essential cookies for authentication and session management. We use
            analytics cookies to understand how the service is used. You can manage cookie
            preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">8. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of significant
            changes by email or through the service. Continued use of TripMind after changes
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">9. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, contact us at{" "}
            <a href="mailto:privacy@tripmind.ai" className="text-primary-500 hover:text-primary-600 underline">
              privacy@tripmind.ai
            </a>.
          </p>
        </section>
      </div>

      <div className="mt-12 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
        <Link href="/" className="text-primary-500 hover:text-primary-600">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
