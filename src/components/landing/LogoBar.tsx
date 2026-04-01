export function LogoBar() {
  const companies = [
    'Acme Corp', 'Shipfast', 'LaunchDarkly', 'Basecamp', 'Linear',
    'Resend', 'Vercel', 'Supabase',
  ];

  return (
    <section className="py-12 border-y border-border/30">
      <div className="max-w-[1100px] mx-auto px-6">
        <p className="text-center text-[11px] uppercase tracking-[0.15em] text-muted-foreground/50 font-medium mb-8">
          Trusted by teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {companies.map((name) => (
            <span
              key={name}
              className="text-[15px] font-semibold text-foreground/15 tracking-tight select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
