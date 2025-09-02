import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const getResend = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

export async function GET() {
  try {
    const resend = getResend();
    
    if (!resend) {
      return NextResponse.json({
        status: 'error',
        message: 'RESEND_API_KEY not configured',
        timestamp: new Date().toISOString()
      });
    }

    console.log('Testing Resend configuration...');

    // Test basic API connectivity
    const { data, error } = await resend.emails.send({
      from: 'プロイー Test <contact@ployee.net>',
      to: ['ployee.officialcontact@gmail.com'],
      subject: 'Resend Configuration Test - ' + new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #163300;">Resend Configuration Test</h2>
          <p>This is a test email to verify Resend is working correctly.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Domain:</strong> ployee.net</p>
          <p><strong>Test Status:</strong> Success</p>
        </div>
      `,
      text: `
Resend Configuration Test

This is a test email to verify Resend is working correctly.
Timestamp: ${new Date().toISOString()}
Domain: ployee.net
Test Status: Success
      `
    });

    if (error) {
      console.error('Resend test error:', error);
      return NextResponse.json({
        status: 'error',
        message: 'Resend API error',
        error: error.message || error,
        timestamp: new Date().toISOString()
      });
    }

    console.log('Resend test successful:', data);
    return NextResponse.json({
      status: 'success',
      message: 'Test email sent successfully',
      emailId: data?.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug email error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    });
  }
}

export async function POST() {
  return GET(); // Allow both GET and POST for testing
}