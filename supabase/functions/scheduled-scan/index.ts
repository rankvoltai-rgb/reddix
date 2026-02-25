import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('=== Scheduled Scan Starting ===');
    const now = new Date();
    console.log(`Current time: ${now.toISOString()}`);

    // Find users with auto-pilot enabled who are due for a scan
    const { data: dueUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, product_name, scan_frequency_hours, next_scheduled_scan_at')
      .eq('auto_pilot_enabled', true)
      .eq('onboarding_completed', true)
      .or(`next_scheduled_scan_at.is.null,next_scheduled_scan_at.lte.${now.toISOString()}`);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch users' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${dueUsers?.length || 0} users due for scanning`);

    if (!dueUsers || dueUsers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No users due for scanning', scanned: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results: { userId: string; success: boolean; leads?: number; error?: string }[] = [];

    // Process each user
    for (const user of dueUsers) {
      console.log(`Processing user: ${user.id} (${user.product_name || 'unnamed'})`);
      
      try {
        // Check if user has subreddits configured (keywords not required — autonomous scanner generates terms dynamically)
        const { data: subredditsRes } = await supabase
          .from('monitored_subreddits')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .limit(1);

        if (!subredditsRes?.length) {
          console.log(`User ${user.id} has no subreddits configured, skipping`);
          results.push({ userId: user.id, success: false, error: 'No subreddits configured' });
          continue;
        }

        // Call the scan-reddit function with service role auth
        const scanResponse = await fetch(`${supabaseUrl}/functions/v1/scan-reddit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            scan_type: 'scheduled',
            user_id: user.id, // Pass user_id for scheduled scans
          }),
        });

        const scanResult = await scanResponse.json();
        
        if (scanResult.success) {
          console.log(`User ${user.id}: Found ${scanResult.leadsFound} leads`);
          results.push({ userId: user.id, success: true, leads: scanResult.leadsFound });
        } else {
          console.log(`User ${user.id} scan failed: ${scanResult.error}`);
          results.push({ userId: user.id, success: false, error: scanResult.error });
        }

        // Calculate next scan time
        const scanFrequency = user.scan_frequency_hours || 4;
        const nextScan = new Date(now.getTime() + scanFrequency * 60 * 60 * 1000);
        
        // Update next_scheduled_scan_at
        await supabase
          .from('profiles')
          .update({ next_scheduled_scan_at: nextScan.toISOString() })
          .eq('id', user.id);

        console.log(`User ${user.id}: Next scan at ${nextScan.toISOString()}`);

        // Small delay between users to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));

      } catch (userError) {
        console.error(`Error processing user ${user.id}:`, userError);
        results.push({ userId: user.id, success: false, error: String(userError) });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalLeads = results.reduce((sum, r) => sum + (r.leads || 0), 0);

    console.log(`=== Scheduled Scan Complete ===`);
    console.log(`Processed: ${results.length} users, Success: ${successCount}, Total leads: ${totalLeads}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scanned ${successCount}/${results.length} users, found ${totalLeads} leads`,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Scheduled scan error:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
