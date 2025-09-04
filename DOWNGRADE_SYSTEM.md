# Plan Downgrade & Usage Retention System

This document explains how the plan downgrade system works with usage retention.

## Overview

When users downgrade from a paid plan (Basic/Premium) to the free plan, they retain their higher usage limits until the end of their current billing cycle. This prevents user complaints about losing access to features they've already paid for.

## How It Works

### 1. Downgrade Process
- User clicks "フリープランに戻る" (Return to Free Plan) button
- System cancels their Stripe subscription immediately  
- User's plan is set to "free" in the database
- **Grandfathered limits are created** to preserve their usage allowances

### 2. Usage Retention Logic
- **Plan**: Changes to "free" immediately
- **Usage Limits**: Remain at the higher paid plan level until billing cycle end
- **Billing**: No further charges occur
- **Access**: User keeps higher limits (e.g., 10 interviews vs 1) until expiration

### 3. Database Schema

#### `grandfathered_limits` Table
```sql
- user_id: UUID (references users.id)
- interview_limit: INTEGER (retained interview limit)
- es_limit: INTEGER (retained ES correction limit) 
- plan_name: TEXT (display name of the grandfathered plan)
- expires_at: TIMESTAMP (when limits revert to free plan)
- active: BOOLEAN (whether limits are currently active)
- created_at: TIMESTAMP
```

### 4. Key Functions

#### `create_grandfathered_limit(user_id, previous_plan)`
- Creates grandfathered limits when user downgrades
- Sets expiration to end of current billing month + 1 month
- Handles conflicts by keeping the higher limits

#### `get_effective_user_limits(user_id)`
- Returns the higher of base plan limits or grandfathered limits
- Used by all usage checking functions
- Includes grandfathered status and expiration info

#### `cleanup_expired_grandfathered_limits()`
- Deactivates expired grandfathered limits
- Should be run periodically (daily recommended)

### 5. UI Changes

#### Billing Page (`/billing`)
- Shows grandfathered status with amber notification box
- Displays current limits and expiration date
- "フリープランに戻る" button for downgrades

#### Subscription Manager Component
- Shows grandfathered plan details in dashboard
- Displays retained limits and expiration date

### 6. Usage Flow Example

**Before Downgrade (Basic Plan User):**
- Plan: Basic (¥300/month)
- Limits: 10 interviews, 20 ES corrections
- Status: Active subscription

**During Downgrade:**
- User clicks downgrade button
- Stripe subscription cancelled
- Plan changed to "free"
- Grandfathered limits created with Basic plan allowances

**After Downgrade:**
- Plan: Free (¥0/month)  
- Limits: 10 interviews, 20 ES corrections (grandfathered until expiration)
- Status: No active subscription
- UI shows amber "継続特典適用中" notification

**After Expiration:**
- Plan: Free (¥0/month)
- Limits: 1 interview, 5 ES corrections (free plan limits)
- Status: No active subscription
- Grandfathered limits automatically deactivated

### 7. Error Handling

The system gracefully handles:
- Missing user profiles
- Database connection issues
- Stripe API failures
- Invalid plan types
- Expired grandfathered limits

### 8. Maintenance

#### Periodic Cleanup
Run the cleanup endpoint daily:
```bash
POST /api/cleanup-expired-limits
Authorization: Bearer ${CRON_SECRET}
```

#### Monitoring
- Check grandfathered_limits table for active entries
- Monitor usage_tracking for limit compliance
- Review Stripe webhooks for subscription changes

### 9. Security Considerations

- All database functions use `SECURITY DEFINER`
- RLS policies protect user data access
- Cleanup endpoint requires authentication
- Grandfathered limits are tied to specific users

### 10. Testing

The system has been tested with:
- ✅ Database function creation
- ✅ Grandfathered limit creation  
- ✅ Effective limit calculation
- ✅ UI display of grandfathered status
- ✅ Subscription cancellation flow
- ✅ Constraint handling
