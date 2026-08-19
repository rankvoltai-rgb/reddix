# Reddit Lead Finder

I am building a SaaS called Reddix.

Reddix is an AI-powered Reddit lead generation platform that identifies real buying intent in real time. The system continuously scans relevant subreddits, detects posts and comments where users are actively looking for products or services, filters out low-intent noise, and surfaces qualified conversations.

The product must have a clean, Notion-style UI, light mode only, minimal and fast—no clutter, no dark patterns.

Core features:

Reddit Intent Scanner – Monitors selected subreddits and keywords to identify buyer-intent signals (e.g. “looking for,” “any recommendations,” “what tool should I use,” etc.).

Conversation Qualification Engine – Ranks and labels threads by intent strength and relevance.

Built-in Lightweight CRM – Saves leads, tracks thread links, timestamps, subreddit, intent score, and engagement status.

AI Copilot for Replies – Generates context-aware, human-sounding Reddit comments and replies that are helpful and non-spammy. Responses must match Reddit culture and avoid promotional language.

Onboarding Personalization – On first use, collect product name, company description, target audience, value proposition, and tone. Use this data to personalize intent detection and AI reply generation automatically.

The goal is zero setup friction: once onboarding is complete, the dashboard is immediately populated with live Reddit opportunities and ready-to-use AI reply suggestions.

Optimize for founders, indie hackers, and SaaS teams who want warm conversations, not cold outreach.

Build this as a scalable, modular SaaS with clear separation between scanning, intent analysis, CRM, and AI generation layers.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://reddix.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4b9beefe-81b0-4194-85a6-9d16efc33eb8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
