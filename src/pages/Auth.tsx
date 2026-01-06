import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Loader2, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
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

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/setup');
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
            description: 'Welcome to Reddix. Let\'s get you set up.',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="w-full md:w-1/2 flex flex-col bg-background px-6 py-8 md:px-12 lg:px-20">
        {/* Logo */}
        <div className="mb-12">
          <img src={logo} alt="Reddix" className="h-8 w-auto" />
        </div>

        {/* Form Container - Centered Vertically */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? 'Sign in to continue to Reddix' : 'Create your account to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
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
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password}</p>
              )}
              {!isLogin && !errors.password && (
                <p className="text-muted-foreground text-xs">
                  8+ characters with uppercase, lowercase, and number
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {isLogin 
                ? "Don't have an account? " 
                : 'Already have an account? '}
              <span className="text-primary font-medium">
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Marketing (hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-muted flex-col justify-center px-12 lg:px-20">
        <div className="max-w-lg">
          {/* Hero Headline */}
          <h2 className="text-3xl lg:text-4xl font-semibold text-foreground mb-4 leading-tight">
            Turn Reddit Conversations into Customers
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Reddix is the AI-powered lead generation tool that finds high-intent buyers on Reddit and helps you engage authentically.
          </p>

          {/* Testimonial */}
          <div className="border-l-4 border-primary pl-6 mb-10">
            <p className="text-foreground text-lg italic mb-4">
              "Reddix has completely transformed how I find leads. I'm connecting with potential customers who are actively looking for solutions like mine!"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">AM</span>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Alex M.</p>
                <p className="text-muted-foreground text-sm">SaaS Founder</p>
              </div>
            </div>
          </div>

          {/* Trust Section */}
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm">Trusted by SaaS founders & agencies</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {['Acme', 'StartupCo', 'GrowthLabs', 'SaaSify'].map((company) => (
              <span 
                key={company} 
                className="text-muted-foreground/60 font-medium text-sm"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}