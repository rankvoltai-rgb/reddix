CREATE UNIQUE INDEX IF NOT EXISTS seen_posts_user_url_unique
ON public.seen_posts (user_id, post_url);