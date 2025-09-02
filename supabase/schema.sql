-- Supabase Database Schema for Ployee Authentication Migration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for user plans and subscription status
CREATE TYPE plan_type AS ENUM ('free', 'basic', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'past_due', 'canceled', 'trialing');

-- Create users profile table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    plan plan_type DEFAULT 'free'::plan_type,
    stripe_customer_id TEXT,
    subscription_status subscription_status,
    subscription_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    PRIMARY KEY (id),
    UNIQUE(email),
    UNIQUE(stripe_customer_id)
);

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on users table
CREATE OR REPLACE TRIGGER on_users_updated
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Update existing usage_tracking table to work with new auth system
-- (Assuming usage_tracking table already exists)
-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_usage_tracking_author_month ON public.usage_tracking(author, month_year);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_author ON public.usage_tracking(author);

-- Create function to get user plan limits based on plan type
CREATE OR REPLACE FUNCTION public.get_user_plan_limits(user_id UUID)
RETURNS TABLE (
    interview_limit INTEGER,
    es_limit INTEGER,
    plan_name TEXT
) AS $$
DECLARE
    user_plan plan_type;
BEGIN
    SELECT plan INTO user_plan FROM public.users WHERE id = user_id;
    
    CASE user_plan
        WHEN 'premium' THEN
            interview_limit := 999;
            es_limit := 999;
            plan_name := 'プレミアムプラン';
        WHEN 'basic' THEN
            interview_limit := 20;
            es_limit := 20;
            plan_name := 'ベーシックプラン';
        ELSE -- 'free'
            interview_limit := 1;
            es_limit := 5;
            plan_name := 'フリープラン';
    END CASE;
    
    RETURN QUERY SELECT interview_limit, es_limit, plan_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security (RLS) Policies

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Policy: Only authenticated users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON public.users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Update RLS for usage_tracking table (if not already set)
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own usage data
CREATE POLICY "Users can view own usage"
    ON public.usage_tracking FOR SELECT
    USING (auth.uid()::text = author);

-- Policy: Users can insert their own usage data
CREATE POLICY "Users can insert own usage"
    ON public.usage_tracking FOR INSERT
    WITH CHECK (auth.uid()::text = author);

-- Policy: Users can update their own usage data
CREATE POLICY "Users can update own usage"
    ON public.usage_tracking FOR UPDATE
    USING (auth.uid()::text = author);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON public.users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON public.users(subscription_id);
CREATE INDEX IF NOT EXISTS idx_users_plan ON public.users(plan);

-- Create function to update user subscription from Stripe webhook
CREATE OR REPLACE FUNCTION public.update_user_subscription(
    customer_id TEXT,
    subscription_id TEXT DEFAULT NULL,
    status subscription_status DEFAULT NULL,
    plan_name TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    new_plan plan_type;
BEGIN
    -- Determine plan type from plan name or status
    IF plan_name IS NOT NULL THEN
        CASE LOWER(plan_name)
            WHEN 'premium', 'プレミアム' THEN new_plan := 'premium';
            WHEN 'basic', 'ベーシック' THEN new_plan := 'basic';
            ELSE new_plan := 'free';
        END CASE;
    ELSIF status = 'canceled' OR status = 'inactive' THEN
        new_plan := 'free';
    END IF;

    -- Update user subscription
    UPDATE public.users 
    SET 
        subscription_id = COALESCE(update_user_subscription.subscription_id, users.subscription_id),
        subscription_status = COALESCE(update_user_subscription.status, users.subscription_status),
        plan = COALESCE(new_plan, users.plan),
        updated_at = timezone('utc'::text, now())
    WHERE stripe_customer_id = customer_id;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.usage_tracking TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_plan_limits(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_subscription(TEXT, TEXT, subscription_status, TEXT) TO service_role;

-- Insert default data for testing (optional)
-- This would be handled by the trigger when users sign up, but you can add sample data if needed

COMMENT ON TABLE public.users IS 'User profiles extending Supabase auth.users';
COMMENT ON COLUMN public.users.plan IS 'User subscription plan: free, basic, or premium';
COMMENT ON COLUMN public.users.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN public.users.subscription_status IS 'Current Stripe subscription status';
COMMENT ON FUNCTION public.get_user_plan_limits(UUID) IS 'Returns interview and ES limits based on user plan';
COMMENT ON FUNCTION public.update_user_subscription(TEXT, TEXT, subscription_status, TEXT) IS 'Updates user subscription from Stripe webhooks';