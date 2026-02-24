import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save, Mail, KeyRound, LogOut, Trash2, RefreshCw, AlertTriangle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { SUBSCRIPTION_TIERS } from '@/lib/subscriptionTiers';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const profileSchema = z.object({
  product_name: z.string().min(1, 'Product name is required'),
  company_description: z.string().optional(),
  target_audience: z.string().optional(),
  value_proposition: z.string().optional(),
  tone: z.enum(['professional', 'casual', 'friendly', 'technical', 'witty']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const toneOptions = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'technical', label: 'Technical', description: 'Detailed and precise' },
  { value: 'witty', label: 'Witty', description: 'Clever and humorous' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { user, session, signOut } = useAuth();
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const { subscribed, plan, subscriptionEnd, isLoading: subLoading } = useSubscription();
  
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isClearingLeads, setIsClearingLeads] = useState(false);
  const [isResettingOnboarding, setIsResettingOnboarding] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      product_name: '',
      company_description: '',
      target_audience: '',
      value_proposition: '',
      tone: 'friendly',
    },
    values: profile ? {
      product_name: profile.product_name || '',
      company_description: profile.company_description || '',
      target_audience: profile.target_audience || '',
      value_proposition: profile.value_proposition || '',
      tone: profile.tone || 'friendly',
    } : undefined,
  });

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile(values, {
      onSuccess: () => toast.success('Profile updated successfully'),
      onError: (error) => toast.error(`Failed to update profile: ${error.message}`),
    });
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    
    setIsResettingPassword(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      toast.error(`Failed to send reset email: ${error.message}`);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleClearLeads = async () => {
    if (!user?.id) return;
    
    setIsClearingLeads(true);
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('user_id', user.id);
      
      if (error) throw error;
      toast.success('All leads cleared successfully');
    } catch (error: any) {
      toast.error(`Failed to clear leads: ${error.message}`);
    } finally {
      setIsClearingLeads(false);
    }
  };

  const handleResetOnboarding = async () => {
    if (!user?.id) return;
    
    setIsResettingOnboarding(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: false })
        .eq('id', user.id);
      
      if (error) throw error;
      toast.success('Onboarding reset! Redirecting...');
      navigate('/onboarding');
    } catch (error: any) {
      toast.error(`Failed to reset onboarding: ${error.message}`);
    } finally {
      setIsResettingOnboarding(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Note: Full account deletion requires server-side implementation
    // For now, we'll sign out and show a message
    setIsDeletingAccount(true);
    try {
      toast.info('Please contact support to delete your account.');
      await signOut();
      navigate('/auth');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!session?.access_token) return;
    
    setIsOpeningPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (error: any) {
      toast.error(`Failed to open portal: ${error.message}`);
    } finally {
      setIsOpeningPortal(false);
    }
  };

  if (isLoading || subLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Product Profile</CardTitle>
                <CardDescription>
                  This information is used to generate personalized replies for your leads.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="product_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your product name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company_description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Briefly describe what your company does..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This helps AI understand your business context.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="target_audience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your ideal customers..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="value_proposition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value Proposition</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What makes your product unique..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reply Tone</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a tone" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {toneOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div>
                                    <span className="font-medium">{option.label}</span>
                                    <span className="text-muted-foreground ml-2">— {option.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This affects the style of generated replies.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isUpdating || !form.formState.isDirty}>
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription
                </CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {subscribed && plan ? SUBSCRIPTION_TIERS[plan]?.name || 'Active Plan' : 'No active subscription'}
                      </p>
                      {subscribed && subscriptionEnd && (
                        <p className="text-sm text-muted-foreground">
                          Renews on {new Date(subscriptionEnd).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {subscribed && (
                      <Button onClick={handleManageSubscription} disabled={isOpeningPortal}>
                        {isOpeningPortal && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Manage Subscription
                      </Button>
                    )}
                  </div>
                </div>
                {!subscribed && (
                  <Button onClick={() => navigate('/onboarding')}>
                    View Plans
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account credentials and session.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{user?.email}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div>
                    <Button 
                      variant="outline" 
                      onClick={handleResetPassword}
                      disabled={isResettingPassword}
                    >
                      {isResettingPassword ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <KeyRound className="h-4 w-4 mr-2" />
                      )}
                      Send Password Reset Email
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We'll send you an email with a link to reset your password.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Zone Tab */}
          <TabsContent value="danger">
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  These actions are destructive and cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Clear All Leads */}
                <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
                  <div>
                    <h4 className="font-medium">Clear All Leads</h4>
                    <p className="text-sm text-muted-foreground">
                      Delete all discovered and saved leads from your account.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Leads
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear All Leads?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete all leads from your account. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleClearLeads}
                          disabled={isClearingLeads}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isClearingLeads && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                          Yes, Clear All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Reset Onboarding */}
                <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
                  <div>
                    <h4 className="font-medium">Reset Onboarding</h4>
                    <p className="text-sm text-muted-foreground">
                      Go through the onboarding wizard again to update your profile.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Onboarding?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You'll be redirected to the onboarding wizard to update your product information.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleResetOnboarding}
                          disabled={isResettingOnboarding}
                        >
                          {isResettingOnboarding && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                          Yes, Reset
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Delete Account */}
                <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg bg-destructive/5">
                  <div>
                    <h4 className="font-medium text-destructive">Delete Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data.
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your account, all leads, keywords, and settings. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={isDeletingAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeletingAccount && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                          Yes, Delete My Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
