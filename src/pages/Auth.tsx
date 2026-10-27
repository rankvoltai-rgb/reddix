import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { z } from 'zod';
import { AlertCircle, ArrowRight, Eye, EyeOff, Globe, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { usePageMeta } from '@/hooks/usePageMeta';
import { lovable } from '@/integrations/lovable/index';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/landing/shared';
import { LeadFloodScene } from '@/components/auth/LeadFloodScene';
import { LogoMark } from '@/components/brand/Logo';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const INPUT =
  'h-11 w-full rounded-lg border bg-white px-3.5 text-[0.95rem] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground hover:border-ink/[0.16] focus:border-cta/50 focus:shadow-[0_0_0_4px_hsl(var(--cta)/0.12)] disabled:opacity-60';

function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-[0.78rem] text-destructive">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {children}
    </p>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function SocialButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-ink/[0.1] bg-white px-4 text-[0.9rem] font-medium text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-[border-color,background-color] duration-200 hover:border-ink/[0.18] hover:bg-ink/[0.02] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/20 disabled:opacity-60"
    >
      {children}
    </button>
  );
}

/* The site the visitor typed into the landing hero, if any, so the page can
   say what it's about to scan. */
function readPendingWebsite() {
  try {
    return sessionStorage.getItem('pendingWebsite')?.trim() || null;
  } catch {
    return null;
  }
}

export default function Auth() {
  usePageMeta({
    title: 'Sign In or Create Account | Reddix',
    description: 'Log in or sign up for Reddix to start finding warm Reddit leads with AI-powered intent scoring.',
    path: '/auth',
    noindex: true,
  });
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTos, setAgreedToTos] = useState(false);
  const [pendingWebsite] = useState(readPendingWebsite);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useProfile();

  useEffect(() => {
    if (user && profile) {
      const nextParam = new URLSearchParams(window.location.search).get('next');
      if (nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')) {
        window.location.href = nextParam;
        return;
      }
      navigate(profile.onboarding_completed ? '/dashboard' : '/onboarding');
    }
  }, [user, profile, navigate]);

  const validateForm = () => {
    try {
      const schema = isLogin ? loginSchema : signupSchema;
      schema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.issues.forEach((err) => {
          if (err.path[0] === 'email') fieldErrors.email = err.message;
          if (err.path[0] === 'password') fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) setFormError(error.message);
        else toast({ title: 'Welcome back!', description: 'You have successfully signed in.' });
      } else {
        const { error } = await signUp(email, password);
        if (error) setFormError(error.message);
        else toast({ title: 'Account created!', description: "Welcome to Reddix. Let's get you set up." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWith = async (provider: 'google' | 'apple') => {
    setFormError(null);
    const { error } = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (error) setFormError(`Could not sign in with ${provider === 'google' ? 'Google' : 'Apple'}. Please try again.`);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormError(null);
    setAgreedToTos(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid min-h-screen bg-white font-jakarta lg:grid-cols-2">
        {/* Form panel */}
        <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-14">
          <Link to="/" className="flex w-fit shrink-0 items-center gap-2.5">
            <LogoMark className="h-7 w-7" />
            <span className="text-[1.2rem] font-semibold tracking-tight text-ink">Reddix</span>
          </Link>

          <div className="flex flex-1 items-center justify-center py-10">
            <div className="w-full max-w-md">
              <Reveal>
                <h1 className="text-balance text-[2rem] font-medium leading-[1.1] tracking-[-0.035em] text-ink sm:text-[2.6rem]">
                  {isLogin ? (
                    <>
                      Your leads are <span className="font-[700] text-cta">waiting for you</span>
                    </>
                  ) : (
                    <>
                      Your next customer is <span className="font-[700] text-cta">already on Reddit</span>
                    </>
                  )}
                </h1>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="mt-4 text-[1.02rem] leading-relaxed text-muted-foreground">
                  {isLogin
                    ? 'Sign in to your dashboard and pick up where Reddix left off: scored leads, with replies ready to post.'
                    : 'Create your account and Reddix starts finding people asking for what you sell, in under 2 minutes.'}
                </p>
              </Reveal>

              {pendingWebsite && (
                <Reveal delay={0.09}>
                  <p className="mt-5 inline-flex max-w-full items-center gap-2 rounded-lg border border-ink/[0.08] bg-surface/70 py-1.5 pl-2 pr-3 text-[0.82rem] text-ink/80">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cta-soft text-cta">
                      <Globe className="h-3 w-3" />
                    </span>
                    <span className="truncate">
                      We'll start scanning for <span className="font-semibold text-ink">{pendingWebsite}</span>
                    </span>
                  </p>
                </Reveal>
              )}

              <Reveal delay={0.12}>
                <div className="mt-7 grid grid-cols-2 gap-3">
                  <SocialButton onClick={() => signInWith('google')} disabled={isLoading}>
                    <GoogleIcon /> Google
                  </SocialButton>
                  <SocialButton onClick={() => signInWith('apple')} disabled={isLoading}>
                    <AppleIcon /> Apple
                  </SocialButton>
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <div className="my-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-ink/[0.08]" />
                  <span className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/85">
                    or continue with email
                  </span>
                  <span className="h-px flex-1 bg-ink/[0.08]" />
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-[0.85rem] font-medium text-ink">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      aria-invalid={!!errors.email}
                      className={cn(INPUT, errors.email ? 'border-destructive/60' : 'border-ink/[0.1]')}
                    />
                    <FieldError>{errors.email}</FieldError>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <label htmlFor="password" className="block text-[0.85rem] font-medium text-ink">
                        Password
                      </label>
                      {!isLogin && !errors.password && (
                        <span className="text-[0.72rem] text-muted-foreground">8+ chars · upper · lower · number</span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={isLogin ? 'current-password' : 'new-password'}
                        placeholder={isLogin ? 'Your password' : 'Create a password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        aria-invalid={!!errors.password}
                        className={cn(INPUT, 'pr-11', errors.password ? 'border-destructive/60' : 'border-ink/[0.1]')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-ink/[0.04] hover:text-ink"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <FieldError>{errors.password}</FieldError>
                  </div>

                  {!isLogin && (
                    <div className="flex items-start gap-2.5 pt-0.5">
                      <Checkbox
                        id="tos"
                        checked={agreedToTos}
                        onCheckedChange={(v) => setAgreedToTos(v === true)}
                        className="mt-0.5 border-ink/25 data-[state=checked]:border-cta data-[state=checked]:bg-cta"
                      />
                      <label htmlFor="tos" className="cursor-pointer text-[0.8rem] leading-relaxed text-muted-foreground">
                        I agree to the{' '}
                        <Link to="/terms" className="font-medium text-ink hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and Privacy Policy
                      </label>
                    </div>
                  )}

                  {formError && (
                    <p role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/[0.06] px-3 py-2.5 text-[0.82rem] text-destructive">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || (!isLogin && !agreedToTos)}
                    className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-cta px-6 text-[0.95rem] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_1px_2px_rgba(16,24,40,0.14)] transition-[background-color,transform,opacity] duration-150 hover:bg-cta-hover active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cta/25 disabled:pointer-events-none disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {isLogin ? 'Sign in to dashboard' : 'Start finding leads'}
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </form>
              </Reveal>

              <Reveal delay={0.24}>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  {isLogin ? 'New to Reddix? ' : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={switchMode}
                    disabled={isLoading}
                    className="font-semibold text-cta underline-offset-2 hover:underline"
                  >
                    {isLogin ? 'Create a free account' : 'Sign in'}
                  </button>
                </p>
              </Reveal>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[0.75rem] text-muted-foreground">
            <Link to="/terms" className="transition-colors hover:text-ink">
              Terms
            </Link>
            <Link to="/refund-policy" className="transition-colors hover:text-ink">
              Refunds
            </Link>
            <span className="ml-auto">© {new Date().getFullYear()} Reddix</span>
          </div>
        </div>

        {/* What Reddix finds: one scan's leads pouring in, counted as they land.
            One screen tall and pinned, so the whole scene stays in view
            while the form scrolls. */}
        <div className="relative hidden lg:sticky lg:top-0 lg:block lg:h-screen lg:self-start lg:p-3">
          {/* Inset from the window edge and rounded, like a framed picture. */}
          <LeadFloodScene className="h-full w-full rounded-[20px] ring-1 ring-black/5" />
        </div>
      </div>
    </MotionConfig>
  );
}
