import { useEffect } from 'react';
import { useCanonical } from '@/hooks/useCanonical';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Shield, Mail } from 'lucide-react';

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms of Service | Reddix';
    const meta = document.querySelector('meta[name="description"]');
    const content = 'Read the Reddix Terms of Service. By using Reddix you agree to these terms including our strict no-refund policy.';
    if (meta) meta.setAttribute('content', content);
    else {
      const m = document.createElement('meta');
      m.name = 'description';
      m.content = content;
      document.head.appendChild(m);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-[140px] pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-foreground via-[hsl(0,10%,8%)] to-foreground" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative max-w-[700px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-[12px] font-medium text-white/60 mb-6">
            <Shield className="w-3.5 h-3.5" />
            Legal
          </div>
          <h1 className="text-[34px] sm:text-[48px] font-bold text-white tracking-[-0.04em] leading-[1.1]">
            Terms of Service
          </h1>
          <p className="mt-5 text-[16px] text-white/40 leading-relaxed max-w-lg mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-[720px] mx-auto px-6">
          <div className="prose-custom space-y-10">
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing or using Reddix ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service. These Terms apply to all users, including visitors, registered users, and paying subscribers.
              </p>
            </Section>

            <Section title="2. Description of Service">
              <p>
                Reddix is an AI-powered Reddit lead generation platform that helps businesses discover potential customers on Reddit, analyze buying intent, and generate context-aware reply drafts. The Service includes but is not limited to: Reddit scanning, intent detection, lead scoring, AI reply generation, subreddit discovery, and analytics.
              </p>
            </Section>

            <Section title="3. Account Registration">
              <p>
                To use certain features of the Service, you must create an account. You agree to:
              </p>
              <ul>
                <li>Provide accurate, current, and complete registration information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security and confidentiality of your login credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </Section>

            <Section title="4. Subscriptions & Payment">
              <p>
                Paid subscriptions are billed on a recurring basis (monthly or annually, depending on the plan selected). By subscribing, you authorize Reddix to charge your payment method on a recurring basis until you cancel.
              </p>
              <ul>
                <li>Prices are subject to change with 30 days' notice</li>
                <li>Upgrades take effect immediately; downgrades take effect at the next billing cycle</li>
                <li>Failed payment attempts may result in service suspension</li>
              </ul>
            </Section>

            <Section title="5. Refund Policy">
              <p>
                All purchases are governed by our strict <a href="/refund-policy" className="text-primary font-medium hover:underline">No-Refund Policy</a>. All sales are final and non-refundable. By making a purchase, you acknowledge that you have read, understood, and agreed to our refund policy. We encourage all users to use the free plan to evaluate the Service before upgrading.
              </p>
            </Section>

            <Section title="6. Acceptable Use">
              <p>You agree not to use the Service to:</p>
              <ul>
                <li>Violate any applicable law, regulation, or Reddit's terms of service</li>
                <li>Spam, harass, or engage in abusive behavior on Reddit or any other platform</li>
                <li>Attempt to reverse engineer, decompile, or extract source code from the Service</li>
                <li>Use automated bots to post replies directly to Reddit (the Service generates drafts only)</li>
                <li>Share, resell, or redistribute your account access to third parties</li>
                <li>Interfere with the Service's infrastructure or other users' access</li>
              </ul>
            </Section>

            <Section title="7. Intellectual Property">
              <p>
                All content, features, functionality, trademarks, and branding of Reddix are owned by Reddix and are protected by international copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works based on the Service without prior written consent.
              </p>
            </Section>

            <Section title="8. Data & Privacy">
              <p>
                Your use of the Service is also governed by our Privacy Policy. Reddix scans publicly available Reddit data. We do not access private messages, private subreddits, or any non-public content. User data (account information, leads, settings) is stored securely and is not sold to third parties.
              </p>
            </Section>

            <Section title="9. Disclaimer of Warranties">
              <p>
                The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied. Reddix does not guarantee that:
              </p>
              <ul>
                <li>The Service will be uninterrupted, error-free, or secure</li>
                <li>Results obtained from the Service will be accurate or reliable</li>
                <li>Any leads, replies, or recommendations will result in conversions or sales</li>
                <li>The Service will meet your specific requirements</li>
              </ul>
            </Section>

            <Section title="10. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, Reddix and its officers, directors, employees, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, business opportunities, or goodwill, arising from your use of or inability to use the Service.
              </p>
            </Section>

            <Section title="11. Termination">
              <p>
                We reserve the right to suspend or terminate your account at any time, with or without cause, and with or without notice. Upon termination:
              </p>
              <ul>
                <li>Your right to use the Service ceases immediately</li>
                <li>No refund will be issued for any remaining subscription period</li>
                <li>We may delete your account data after a reasonable retention period</li>
              </ul>
            </Section>

            <Section title="12. Changes to Terms">
              <p>
                We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of the Service after changes are posted constitutes acceptance of the revised Terms. Material changes will be communicated via email or in-app notification.
              </p>
            </Section>

            <Section title="13. Contact">
              <p>For questions about these Terms, contact us at:</p>
              <div className="flex items-center gap-2.5 mt-4 p-4 rounded-xl bg-muted/50 border border-border/30">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:support@reddix.io" className="text-[14px] font-medium text-primary hover:underline">
                  support@reddix.io
                </a>
              </div>
            </Section>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[18px] font-semibold text-foreground mb-4">{title}</h2>
      <div className="text-[14px] text-muted-foreground leading-[1.8] space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-foreground [&_strong]:font-semibold">
        {children}
      </div>
    </div>
  );
}
