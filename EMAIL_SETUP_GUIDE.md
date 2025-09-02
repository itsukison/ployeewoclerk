# Email Service Setup Guide

The contact form is now configured to send emails to `ployee.officialcontact@gmail.com` using Resend email service.

## Current Status

✅ Resend package installed (`npm install resend`)
✅ Contact form API route implemented (`/api/send-contact-email`)
✅ Contact page updated to use API
✅ Help center page updated to use API
✅ Professional email template with Japanese content
✅ Form validation and error handling
✅ Fallback logging when API key is not configured
⚠️ **Resend API key needs to be configured** (see instructions below)

## Quick Setup (Recommended)

1. **Sign up for Resend** (free tier available):
   - Go to [resend.com](https://resend.com)
   - Create a free account
   - Get your API key from the dashboard

2. **Configure environment variable**:
   - Copy `.env.local.template` to `.env.local`
   - Add your Resend API key:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

3. **Test the form**:
   - Visit the contact page (`/contact`) or help center (`/help-center`)
   - Fill out and submit the form
   - Check your terminal for success logs
   - Emails will be sent to `ployee.officialcontact@gmail.com`

## How It Works

The system is now fully functional with the following features:

- **Automatic fallback**: If RESEND_API_KEY is not set, the system logs the email content to console instead of failing
- **Professional email template**: Styled emails with your brand colors and Japanese content
- **Reply-to functionality**: Recipients can reply directly to the sender
- **Help center integration**: Help center submissions are prefixed with `[ヘルプセンター]`
- **Error handling**: Graceful error handling with Japanese user messages

## Email Template Features

- Professional HTML styling with brand colors (#163300, #9fe870)
- Structured data presentation (name, email, subject, message)
- Japanese timestamp (Asia/Tokyo timezone)
- Reply-to address set to sender's email
- Mobile-responsive design