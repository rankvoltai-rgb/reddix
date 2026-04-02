import { useEffect } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Shield, AlertTriangle, Mail } from 'lucide-react';

export default function RefundPolicy() {
  useEffect(() => {
    document.title = 'Refund Policy — No Refunds | Reddix';
    const meta = document.querySelector('meta[name="description"]');
    const content = 'Reddix operates a strict no-refund policy. All sales are final. Review our complete refund policy before purchasing.';
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
            Refund Policy
          </h1>
          <p className="mt-5 text-[16px] text-white/40 leading-relaxed max-w-lg mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-[720px] mx-auto px-6">
          {/* Alert banner */}
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-destructive/20 bg-destructive/[0.04] mb-12">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-foreground mb-1">All sales are final</p>
              <p className="text-[13px] text-muted-foreground leading-[1.6]">
                Reddix operates a strict no-refund policy. Please review this page carefully before making a purchase.
              </p>
            </div>
          </div>

          <div className="prose-custom space-y-10">
            <Section title="1. No-Refund Policy">
              <p>
                All purchases made through Reddix, including but not limited to subscription plans, upgrades, and any add-on services, are <strong>final and non-refundable</strong>. By completing a purchase, you acknowledge and agree that you will not be entitled to a refund for any reason, including but not limited to:
              </p>
              <ul>
                <li>Dissatisfaction with the product or service</li>
                <li>Failure to use the service during the subscription period</li>
                <li>Change of mind after purchase</li>
                <li>Duplicate purchases made in error</li>
                <li>Lack of expected results from the service</li>
                <li>Technical issues on the user's end (browser incompatibility, internet connectivity, etc.)</li>
              </ul>
            </Section>

            <Section title="2. Subscription Cancellations">
              <p>
                You may cancel your subscription at any time through your account settings. Upon cancellation:
              </p>
              <ul>
                <li>Your subscription will remain active until the end of the current billing period</li>
                <li>You will retain access to all paid features until the billing period expires</li>
                <li>No partial or prorated refunds will be issued for the remaining time in the billing cycle</li>
                <li>Your account will automatically revert to the free plan after the billing period ends</li>
              </ul>
            </Section>

            <Section title="3. Free Trial & Free Plan">
              <p>
                Reddix offers a free plan that allows you to evaluate the core functionality of the service before committing to a paid subscription. We strongly encourage all users to fully test the product using the free plan before upgrading. The availability of a free plan serves as your opportunity to assess the product's suitability for your needs.
              </p>
            </Section>

            <Section title="4. Chargebacks & Disputes">
              <p>
                Filing a chargeback or payment dispute with your bank or payment provider instead of contacting us directly constitutes a violation of this policy. In the event of a chargeback:
              </p>
              <ul>
                <li>Your Reddix account will be immediately suspended</li>
                <li>Access to all data, leads, and account history may be permanently revoked</li>
                <li>We reserve the right to pursue the chargeback through the appropriate dispute resolution channels</li>
                <li>Any associated fees incurred by Reddix as a result of the chargeback may be passed on to the account holder</li>
              </ul>
            </Section>

            <Section title="5. Service Downtime & Disruptions">
              <p>
                While we strive to maintain 99.9% uptime, temporary service disruptions do not constitute grounds for a refund. Reddix is not liable for any loss of business, revenue, or data resulting from service interruptions, whether scheduled or unscheduled.
              </p>
            </Section>

            <Section title="6. Modifications to This Policy">
              <p>
                Reddix reserves the right to modify this refund policy at any time without prior notice. Changes will be effective immediately upon posting to this page. Continued use of the service after changes are posted constitutes acceptance of the revised policy. It is your responsibility to review this page periodically.
              </p>
            </Section>

            <Section title="7. Applicable Law">
              <p>
                This refund policy is governed by applicable consumer protection laws. Nothing in this policy is intended to override your statutory rights where local law mandates otherwise. If you believe you are entitled to a refund under applicable law, please contact us with your claim and supporting documentation.
              </p>
            </Section>

            <Section title="8. Contact Us">
              <p>
                If you have any questions about this refund policy, please contact us before making a purchase:
              </p>
              <div className="flex items-center gap-2.5 mt-4 p-4 rounded-xl bg-muted/50 border border-border/30">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:support@reddix.io" className="text-[14px] font-medium text-primary hover:underline">
                  support@reddix.io
                </a>
              </div>
            </Section>
          </div>

          {/* Cross-link */}
          <div className="mt-14 pt-8 border-t border-border/20 text-center">
            <p className="text-[13px] text-muted-foreground">
              This refund policy is part of our{' '}
              <a href="/terms" className="text-primary font-medium hover:underline">
                Terms of Service
              </a>
              . By using Reddix, you agree to both documents.
            </p>
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
