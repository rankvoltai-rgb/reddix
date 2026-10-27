import { BarChart3, Clock, Compass, Globe, MessageSquare, Repeat, Shield, Target, Zap, type LucideIcon } from 'lucide-react';

/**
 * The feature list the nav, footer and use-case pages link from. Each feature
 * has a page of its own in src/sublanding/features/<slug>/, which holds its
 * copy, meta and FAQ; this list only names it.
 */
export interface FeatureData {
  slug: string;
  title: string;
  /** One line under the title in menus: what it does, plainly. */
  tagline: string;
  icon: LucideIcon;
}

export const features: FeatureData[] = [
  { slug: 'intent-detection', title: 'Intent Detection', tagline: 'Buyers ranked above browsers, 0–100', icon: Zap },
  { slug: 'lead-scoring', title: 'Lead Scoring', tagline: 'Rank, triage and track every saved lead', icon: Target },
  { slug: 'ai-replies', title: 'AI Replies', tagline: 'Three drafts per thread, posted by you', icon: MessageSquare },
  { slug: 'subreddit-discovery', title: 'Subreddit Discovery', tagline: 'Suggests subreddits; you choose what’s scanned', icon: Compass },
  { slug: 'analytics-dashboard', title: 'Dashboard', tagline: 'Your leads, drafts and last scan at a glance', icon: BarChart3 },
  { slug: 'scheduled-scans', title: 'On-Demand Scans', tagline: 'Scans run when you press Scan', icon: Clock },
  { slug: 'deduplication', title: 'Deduplication', tagline: 'Each post read once a week', icon: Repeat },
  { slug: 'website-analysis', title: 'Website Analysis', tagline: 'One URL in, a product profile out', icon: Globe },
  { slug: 'natural-tone', title: 'Natural Tone', tagline: 'Replies that help first, not pitch', icon: Shield },
];
