// Shared origin allowlist for Stripe redirect URLs (open-redirect prevention).
const ALLOWED_ORIGINS = new Set<string>([
  "https://reddix.info",
  "https://www.reddix.info",
  "https://reddix.lovable.app",
  "https://id-preview--4b9beefe-81b0-4194-85a6-9d16efc33eb8.lovable.app",
]);

const DEFAULT_ORIGIN = "https://reddix.info";

export function safeOrigin(req: Request): string {
  const raw = req.headers.get("origin") ?? "";
  return ALLOWED_ORIGINS.has(raw) ? raw : DEFAULT_ORIGIN;
}
