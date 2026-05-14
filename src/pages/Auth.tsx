import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Loader2, Eye, EyeOff, Flame, Bookmark, ExternalLink, Sparkles, Radar, TrendingUp, Target, ArrowRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
import logo from '@/assets/logo.png';
import { lovable } from '@/integrations/lovable/index';
import { usePageMeta } from '@/hooks/usePageMeta';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

interface LeadPreviewCardProps {
  className?: string;
  style?: React.CSSProperties;
  title: string;
  body: string;
  subreddit: string;
  score: number;
  intentLabel: string;
  intentColor: string;
}

function LeadPreviewCard({ className = '', style, title, body, subreddit, score, intentLabel, intentColor }: LeadPreviewCardProps) {
  return (
    <div className={`bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] border border-white/20 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.15)] ${className}`} style={style}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 ${intentColor} text-[11px] font-bold px-2.5 py-1 rounded-full border`}>
            {intentLabel}
          </span>
          <span className="text-[11px] text-gray-500 font-semibold bg-gray-50 px-2 py-0.5 rounded-md">Score: {score}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <Bookmark className="h-3.5 w-3.5" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-[13px] font-semibold text-gray-900 mb-1 leading-snug">{title}</h4>
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{body}</p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-colors shadow-sm">
          <Sparkles className="h-3 w-3" /> Reply
        </button>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
        <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md font-medium">{subreddit}</span>
        <span className="text-[10px] text-gray-400">u/unknown</span>
        <span className="text-[10px] text-gray-400">2d ago</span>
      </div>
    </div>
  );
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTos, setAgreedToTos] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { profile } = useProfile();

  useEffect(() => {
    if (user && profile) {
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
        error.errors.forEach((err) => {
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

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          // Sign in failed silently
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have successfully signed in.',
          });
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          // Sign up failed silently
        } else {
          toast({
            title: 'Account created!',
            description: "Welcome to Reddix. Let's get you set up.",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
      
      <div className="relative flex w-[95vw] h-[95vh] rounded-3xl overflow-hidden shadow-[0_48px_100px_-24px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.03)]">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-[45%] flex flex-col bg-background px-6 py-8 md:px-12 lg:px-16 overflow-y-auto relative">
          {/* Subtle corner glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-radial-glow opacity-40 pointer-events-none" />
          
          {/* Logo */}
          <div className="relative flex items-center gap-2.5 mb-16">
            <img src={logo} alt="Reddix" className="h-7 w-auto" />
            <span className="text-[17px] font-bold text-foreground tracking-tight">Reddix</span>
          </div>

          {/* Form */}
          <div className="relative flex-1 flex flex-col justify-center max-w-sm w-full">
            {/* Welcome badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/[0.06] border border-primary/10 text-[11px] font-medium text-primary mb-5 w-fit">
              <Sparkles className="w-3 h-3" />
              {isLogin ? 'Welcome back to Reddix' : 'Join 500+ SaaS founders'}
            </div>

            <h1 className="text-[28px] md:text-[32px] font-bold text-foreground mb-2 tracking-[-0.03em] leading-[1.15]">
              {isLogin ? 'Your leads are' : 'Your next customer is'}
              <br />
              <span className="inline-block mt-1.5">
                <span
                  className="inline-flex items-center font-normal text-primary px-4 py-1 rounded-2xl border border-primary/[0.15] bg-primary/[0.04] backdrop-blur-sm"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                >
                  {isLogin ? 'waiting for you' : 'already on Reddit'}
                </span>
              </span>
            </h1>
            <p className="text-[14px] text-muted-foreground mb-8 leading-relaxed">
              {isLogin 
                ? 'Sign in to your dashboard and start converting warm leads.' 
                : 'Create your account and find warm leads in under 2 minutes.'}
            </p>

            {/* OAuth Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={async () => {
                  const { error } = await lovable.auth.signInWithOAuth("google", {
                    redirect_uri: window.location.origin,
                  });
                  if (error) {
                    // Google sign-in failed silently
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-2.5 h-12 rounded-xl border border-border/60 bg-background hover:bg-muted/50 transition-all duration-300 text-[13px] font-semibold text-foreground hover:shadow-md hover:-translate-y-0.5"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={async () => {
                  const { error } = await lovable.auth.signInWithOAuth("apple", {
                    redirect_uri: window.location.origin,
                  });
                  if (error) {
                    // Apple sign-in failed silently
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-2.5 h-12 rounded-xl border border-border/60 bg-background hover:bg-muted/50 transition-all duration-300 text-[13px] font-semibold text-foreground hover:shadow-md hover:-translate-y-0.5"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider">or continue with email</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] font-medium text-foreground">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`h-12 rounded-xl bg-muted/30 border-border/40 text-[14px] placeholder:text-muted-foreground/40 focus:border-primary/30 focus:ring-primary/10 transition-all ${errors.email ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-destructive text-[12px] flex items-center gap-1"><span>⚠</span>{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[13px] font-medium text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`h-12 rounded-xl bg-muted/30 border-border/40 text-[14px] pr-11 placeholder:text-muted-foreground/40 focus:border-primary/30 focus:ring-primary/10 transition-all ${errors.password ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-destructive text-[12px] flex items-center gap-1"><span>⚠</span>{errors.password}</p>}
                {!isLogin && !errors.password && (
                  <p className="text-muted-foreground/50 text-[11px]">8+ characters · uppercase · lowercase · number</p>
                )}
              </div>

              {!isLogin && (
                <div className="flex items-start gap-2.5 py-1">
                  <Checkbox
                    id="tos"
                    checked={agreedToTos}
                    onCheckedChange={(v) => setAgreedToTos(v === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="tos" className="text-[12px] text-muted-foreground leading-relaxed cursor-pointer">
                    I agree to the <span className="text-primary font-medium hover:underline">Terms of Service</span> and <span className="text-primary font-medium hover:underline">Privacy Policy</span>
                  </label>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-[14px] font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/15 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5"
                disabled={isLoading || (!isLogin && !agreedToTos)}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? 'Sign in to dashboard' : 'Create your account'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setAgreedToTos(false);
                }}
                className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <span className="text-primary font-semibold hover:underline">{isLogin ? 'Sign up free' : 'Sign in'}</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="relative flex items-center gap-4 mt-8 pt-4 border-t border-border/20">
            <span className="text-[11px] text-muted-foreground/40 hover:text-muted-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="text-[11px] text-muted-foreground/40 hover:text-muted-foreground cursor-pointer transition-colors">Terms</span>
            <span className="ml-auto text-[11px] text-muted-foreground/30">© 2026 Reddix</span>
          </div>
        </div>

        {/* Right Panel - Product Preview */}
        <div className="hidden lg:flex lg:w-[55%] flex-col items-center justify-center relative overflow-hidden">
          {/* Rich gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))] via-[hsl(0,65%,48%)] to-[hsl(15,70%,42%)]" />
          
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          {/* Decorative circles */}
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.06]" />
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] rounded-full border border-white/[0.04]" />

          {/* Floating stat cards */}
          <div className="absolute top-8 right-8 floating">
            <div className="bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-[10px] font-medium text-white/60">Today's Leads</span>
              </div>
              <span className="text-[24px] font-bold text-white leading-none">14</span>
              <span className="text-[10px] font-medium text-emerald-300 ml-1">↑ 23%</span>
            </div>
          </div>

          <div className="absolute bottom-12 left-8 floating-delayed">
            <div className="bg-white/[0.12] backdrop-blur-xl border border-white/[0.15] rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-3.5 h-3.5 text-white/70" />
                <span className="text-[10px] font-medium text-white/60">Avg Score</span>
              </div>
              <span className="text-[24px] font-bold text-white leading-none">87</span>
              <span className="text-[10px] font-medium text-emerald-300 ml-1">High Intent</span>
            </div>
          </div>

          {/* Content */}
          <div className="relative w-full max-w-lg px-10 space-y-4">
            {/* Header text */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.1] border border-white/[0.12] text-[11px] font-medium text-white/70 mb-3">
                <Radar className="w-3 h-3" />
                Live lead feed preview
              </div>
              <h2 className="text-[22px] font-bold text-white leading-tight tracking-[-0.02em]">
                Real leads, found by AI
              </h2>
              <p className="text-[13px] text-white/40 mt-1">Here's what your dashboard looks like from day one.</p>
            </div>

            <LeadPreviewCard
              className="opacity-0 animate-stagger-fade-in"
              style={{ animationDelay: '0.2s' }}
              title="Any Affordable reddit post monitoring tool? : r/microsaas"
              body="I know that there are lots monitoring sites but they are kinda expensive for me so I'm looking for an affordable option to get alerts by tracking the..."
              subreddit="r/microsaas"
              score={95}
              intentLabel="🔥 Hot"
              intentColor="bg-red-50 text-red-600 border-red-100"
            />
            <LeadPreviewCard
              className="opacity-0 animate-stagger-fade-in"
              style={{ animationDelay: '0.4s' }}
              title="Best way to find potential customers on Reddit? : r/startups"
              body="I've been trying to manually search Reddit for people who might need my product but it takes forever. Is there a smarter way to automate finding..."
              subreddit="r/startups"
              score={88}
              intentLabel="🌡️ Warm"
              intentColor="bg-amber-50 text-amber-600 border-amber-100"
            />
            <LeadPreviewCard
              className="opacity-0 animate-stagger-fade-in"
              style={{ animationDelay: '0.6s' }}
              title="How do you monitor brand mentions across subreddits? : r/SaaS"
              body="We recently launched our product and want to track when people mention problems we solve. Currently checking manually every day but it's not scalab..."
              subreddit="r/SaaS"
              score={91}
              intentLabel="🔥 Hot"
              intentColor="bg-red-50 text-red-600 border-red-100"
            />

            {/* Bottom proof points */}
            <div className="flex items-center justify-center gap-4 pt-4">
              {['500+ teams', '2 min setup', 'Free tier'].map((item, i) => (
                <span key={i} className="flex items-center gap-1.5 text-[11px] text-white/35">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300/50" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
