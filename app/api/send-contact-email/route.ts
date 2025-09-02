import { NextRequest, NextResponse } from "next/server";
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "すべての必須項目を入力してください。" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください。" },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailContent = {
      to: "ployee.officialcontact@gmail.com",
      from: email,
      name: name,
      message: message,
      originalSubject: subject,
      subject: `[プロイー お問い合わせ] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #163300; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">プロイー お問い合わせ</h1>
          </div>
          
          <div style="padding: 30px; background-color: #f8f9fa;">
            <h2 style="color: #163300; margin-bottom: 20px;">お問い合わせ詳細</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #163300;">お名前:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #163300;">メールアドレス:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #163300;">お問い合わせ種別:</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd;">${subject}</td>
              </tr>
            </table>
            
            <div style="margin-top: 30px;">
              <h3 style="color: #163300; margin-bottom: 15px;">メッセージ:</h3>
              <div style="background-color: white; padding: 20px; border-radius: 8px; border-left: 4px solid #9fe870;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          
          <div style="background-color: #163300; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">このメールはプロイーのお問い合わせフォームから送信されました。</p>
            <p style="margin: 5px 0 0 0;">送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
          </div>
        </div>
      `,
      text: `
プロイー お問い合わせ

お名前: ${name}
メールアドレス: ${email}
お問い合わせ種別: ${subject}

メッセージ:
${message}

送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
      `
    };

    // Send email via Resend service
    const emailServiceResponse = await sendEmailViaService(emailContent);
    
    if (emailServiceResponse.success) {
      console.log('Email service completed successfully:', {
        fallback: emailServiceResponse.fallback || false,
        emailId: emailServiceResponse.emailId || 'none',
        timestamp: new Date().toISOString()
      });
      
      return NextResponse.json(
        { 
          message: "お問い合わせを受け付けました。24時間以内にご返信いたします。",
          success: true,
          emailId: emailServiceResponse.emailId || null
        },
        { status: 200 }
      );
    } else {
      // Log the specific error for debugging
      console.error('Email service failed:', {
        error: emailServiceResponse.error,
        details: emailServiceResponse.details || 'No details',
        type: emailServiceResponse.type || 'unknown',
        timestamp: new Date().toISOString()
      });
      
      // Still return success to user but log the issue
      return NextResponse.json(
        { 
          message: "お問い合わせを受け付けました。技術的な問題が発生した可能性があります。",
          success: true,
          warning: "Email delivery issue detected"
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "送信中にエラーが発生しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}

// Email service function using Resend
async function sendEmailViaService(emailContent: any) {
  try {
    // Get Resend instance (will be null if API key is not configured)
    const resend = getResend();
    
    if (!resend) {
      console.log('RESEND_API_KEY is not configured - using fallback logging');
      // Fallback to console logging if API key is not set
      console.log("Email would be sent:", {
        to: emailContent.to,
        subject: emailContent.subject,
        from: emailContent.from
      });
      console.log("Content:", emailContent.text);
      return { success: true, fallback: true };
    }

    console.log('Attempting to send email with Resend:', {
      to: emailContent.to,
      subject: emailContent.subject,
      replyTo: emailContent.from,
      timestamp: new Date().toISOString()
    });

    // Send email using Resend with React EmailTemplate
    const { data, error } = await resend.emails.send({
      from: 'プロイー Contact Form <contact@ployee.net>', // Use your verified domain
      to: ['ployee.officialcontact@gmail.com'],
      subject: emailContent.subject,
      react: EmailTemplate({
        name: emailContent.name,
        email: emailContent.from,
        subject: emailContent.originalSubject,
        message: emailContent.message
      }) as React.ReactElement,
      replyTo: emailContent.from, // User's email as reply-to
    });
    
    if (error) {
      console.error('Resend API error details:', {
        error: error,
        message: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      });
      
      // Return actual error instead of fallback for debugging
      return { 
        success: false, 
        error: error.message || 'Unknown Resend API error',
        details: error
      };
    }
    
    console.log('Email sent successfully with Resend:', {
      emailId: data?.id || 'no-id',
      to: emailContent.to,
      timestamp: new Date().toISOString()
    });
    
    return { success: true, data, emailId: data?.id };
    
  } catch (error) {
    console.error("Email service error:", {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    // Return actual error for debugging
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      type: 'service_error'
    };
  }
}