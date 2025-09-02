import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '../../../components/EmailTemplate';
import * as React from 'react';

// Initialize Resend only if API key is available
const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export async function POST() {
  try {
    const resend = getResend();
    
    if (!resend) {
      // Fallback response when API key is not configured
      console.log('RESEND_API_KEY is not configured - simulating email send');
      console.log('Test email would be sent to: delivered@resend.dev');
      console.log('Subject: Hello world');
      console.log('Template: EmailTemplate with firstName: John');
      
      return NextResponse.json({ 
        message: 'Email simulation successful (no API key configured)',
        simulated: true 
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'プロイー <noreply@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }) as React.ReactElement,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log('Test email sent successfully:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
  }
}