

# Reddix Landing Page Redesign — ChatGPT-Style, SaaS Founder ICP

## Vision

Transform the current minimal landing page into a rich, immersive experience inspired by ChatGPT/OpenAI's landing page style: bold hero with animated elements, product demo mockup, social proof, tiered pricing, and a sophisticated visual hierarchy. Targeted at SaaS founders who understand the value of warm leads.

## Sections (Top to Bottom)

### 1. Sticky Navigation Bar
- Logo "Reddix" left, nav links center (Features, How it Works, Pricing), CTA buttons right (Sign in ghost, "Get Started" primary pill)
- Transparent on scroll-top, glass-blur on scroll

### 2. Hero Section (ChatGPT-style)
- Large bold headline with gradient text animation: "Your AI co-pilot for Reddit lead generation"
- Subtitle targeting SaaS founders: "Stop cold outreach. Reddix finds people already asking for what you built."
- Two CTAs: "Start free" (primary, large) + "Watch demo" (outline with play icon)
- Below CTAs: trust strip — "Trusted by 500+ SaaS founders" with small avatar stack + star rating
- Background: subtle radial glow + dot grid pattern (already in CSS utilities)

### 3. Product Demo / Mockup Section
- A styled browser-frame mockup showing a fake scanner UI with sample leads, intent badges, and AI reply preview
- Built with actual UI components (cards, badges) inside a decorative browser chrome wrapper
- Animated fade-in on scroll

### 4. "How It Works" — 3-Step Horizontal Flow
- Step 1: "Describe your product" — icon + short copy
- Step 2: "AI scans Reddit 24/7" — icon + short copy  
- Step 3: "Get warm leads with AI replies" — icon + short copy
- Connected by a subtle dashed line/arrow between steps

### 5. Features Grid (Enhanced)
- 2x3 grid of feature cards with icon, title, description
- Each card has a subtle colored tint background matching the feature theme
- Cards: Intent Detection, Lead Scoring, AI Replies, Subreddit Discovery, Built-in CRM, Scheduled Scans
- Hover: lift + shine effect (already in CSS)

### 6. Social Proof / Stats Bar
- Horizontal strip with animated counters: "2,400+ leads found", "180+ subreddits monitored", "12x faster than manual outreach"
- Uses the existing `animated-counter` component

### 7. Pricing Section
- 3-column pricing cards using data from `subscriptionTiers.ts`
- Popular tier (Premium) highlighted with gradient border + "Most Popular" badge
- Feature checkmarks, price display, CTA buttons

### 8. Final CTA Section
- Dark/contrast background block
- "Ready to find your next 100 customers on Reddit?" headline
- Single large CTA button
- Radial glow background effect

### 9. Footer
- Clean footer with logo, copyright, and links

## Technical Plan

| File | Action |
|------|--------|
| `src/pages/Index.tsx` | Complete rewrite with all sections above |
| `src/components/landing/HeroSection.tsx` | New — hero with gradient text, trust strip, radial glow bg |
| `src/components/landing/ProductDemo.tsx` | New — browser-frame mockup with fake scanner UI |
| `src/components/landing/HowItWorks.tsx` | New — 3-step horizontal flow |
| `src/components/landing/FeaturesGrid.tsx` | New — 2x3 enhanced feature cards |
| `src/components/landing/StatsBar.tsx` | New — animated counter stats strip |
| `src/components/landing/PricingSection.tsx` | New — 3-col pricing from subscriptionTiers.ts |
| `src/components/landing/FinalCTA.tsx` | New — dark CTA block |
| `src/components/landing/Navbar.tsx` | New — sticky glass nav |

All components use existing design tokens (primary red, muted grays) and CSS utilities (glass-card, radial-glow, shine-effect, gradient-text, bg-dot-pattern, animated-counter). No new dependencies needed.

