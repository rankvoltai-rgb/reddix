import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Loader2, Eye, EyeOff, Flame, Bookmark, ExternalLink, Sparkles } from 'lucide-react';
import logo from '@/assets/logo.png';

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
    <div className={`bg-white rounded-xl p-5 shadow-lg ${className}`} style={style}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 ${intentColor} text-xs font-semibold px-2.5 py-1 rounded-full`}>
            {intentLabel}
          </span>
          <span className="text-xs text-gray-500 font-medium">Score: {score}</span>
          <span className="inline-flex items-center bg-emerald-50 text-emerald-600 text-xs font-medium px-2.5 py-1 rounded-full">
            Engaged
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <Bookmark className="h-4 w-4" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
          <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shrink-0">
          <Sparkles className="h-3 w-3" /> Reply
        </button>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{subreddit}</span>
        <span className="text-xs text-gray-400">u/unknown</span>
        <span className="text-xs text-gray-400">2 day ago</span>
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

  useEffect(() => {
    if (user) {
      navigate('/onboarding');
    }
  }, [user, navigate]);

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
          toast({
            variant: 'destructive',
            title: 'Sign in failed',
            description: error.message === 'Invalid login credentials'
              ? 'Invalid email or password. Please try again.'
              : error.message,
          });
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have successfully signed in.',
          });
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              variant: 'destructive',
              title: 'Account exists',
              description: 'This email is already registered. Please sign in instead.',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Sign up failed',
              description: error.message,
            });
          }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-[95vw] h-[95vh] rounded-3xl overflow-hidden shadow-xl">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-[45%] flex flex-col bg-background px-6 py-8 md:px-12 lg:px-16 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-16">
          <img src={logo} alt="Reddix" className="h-7 w-auto" />
          <span className="text-lg font-bold text-foreground">Reddix</span>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full">
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-8 tracking-tight" style={{ fontFamily: "'Open Sans', sans-serif" }}>
            {isLogin ? 'Your leads are waiting' : 'Your next customer is on Reddit'}
          </h1>

          {/* OAuth Buttons */}
          <div className="flex gap-3 mb-8">
            <button className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm font-medium text-foreground">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm font-medium text-foreground">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-11 bg-muted/50 border-border ${errors.email ? 'border-destructive' : ''}`}
                disabled={isLoading}
              />
              {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-foreground">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-11 bg-muted/50 border-border pr-10 ${errors.password ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
              {!isLogin && !errors.password && (
                <p className="text-muted-foreground text-xs">8+ characters with uppercase, lowercase, and number</p>
              )}
            </div>

            {!isLogin && (
              <div className="flex items-start gap-2">
                <Checkbox
                  id="tos"
                  checked={agreedToTos}
                  onCheckedChange={(v) => setAgreedToTos(v === true)}
                  className="mt-0.5"
                />
                <label htmlFor="tos" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                  By creating an account you're agreeing to our TOS
                </label>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base rounded-lg bg-primary hover:bg-primary/90"
              disabled={isLoading || (!isLogin && !agreedToTos)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                isLogin ? 'Sign in' : 'Create account'
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setAgreedToTos(false);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="text-primary font-medium">{isLogin ? 'Sign up' : 'Log in'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 mt-8">
          <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Legal</span>
          <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Resources</span>
        </div>
      </div>

      {/* Right Panel - Product Preview */}
      <div className="hidden lg:flex lg:w-[55%] bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="w-full max-w-lg space-y-5">
          <LeadPreviewCard
            className="opacity-0 animate-stagger-fade-in"
            style={{ animationDelay: '0.2s' }}
            title="Any Affordable reddit post monitoring tool? : r/microsaas"
            body="I know that there are lots monitoring sites but they are kinda expensive for me so I'm looking for an affordable option to get alerts by tracking the..."
            subreddit="r/microsaas"
            score={95}
            intentLabel="🔥 Hot"
            intentColor="bg-red-50 text-red-600"
          />
          <LeadPreviewCard
            className="opacity-0 animate-stagger-fade-in translate-x-4"
            style={{ animationDelay: '0.4s' }}
            title="Best way to find potential customers on Reddit? : r/startups"
            body="I've been trying to manually search Reddit for people who might need my product but it takes forever. Is there a smarter way to automate finding..."
            subreddit="r/startups"
            score={88}
            intentLabel="🌡️ Warm"
            intentColor="bg-amber-50 text-amber-600"
          />
          <LeadPreviewCard
            className="opacity-0 animate-stagger-fade-in translate-x-8"
            style={{ animationDelay: '0.6s' }}
            title="How do you monitor brand mentions across subreddits? : r/SaaS"
            body="We recently launched our product and want to track when people mention problems we solve. Currently checking manually every day but it's not scalab..."
            subreddit="r/SaaS"
            score={91}
            intentLabel="🔥 Hot"
            intentColor="bg-red-50 text-red-600"
          />
        </div>
      </div>
      </div>
    </div>
  );
}
