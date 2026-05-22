-- 1. Prevent users from self-assigning subscription rows.
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.subscriptions;

-- 2. Lock down Realtime channel subscriptions so users only get their own data.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users receive only their own realtime messages" ON realtime.messages;
CREATE POLICY "Users receive only their own realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() = 'leads:' || auth.uid()::text
  OR realtime.topic() = 'user:' || auth.uid()::text
);