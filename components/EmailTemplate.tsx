import * as React from 'react';

interface EmailTemplateProps {
  firstName?: string;
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName = 'User',
  name,
  email,
  subject,
  message,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#163300', color: 'white', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ margin: '0', fontSize: '24px' }}>プロイー お問い合わせ</h1>
    </div>
    
    <div style={{ padding: '30px', backgroundColor: '#f8f9fa' }}>
      <h2 style={{ color: '#163300', marginBottom: '20px' }}>お問い合わせ詳細</h2>
      
      {name && email && subject && message ? (
        // Contact form email template
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold', color: '#163300' }}>お名前:</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{name}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold', color: '#163300' }}>メールアドレス:</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{email}</td>
            </tr>
            <tr>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd', fontWeight: 'bold', color: '#163300' }}>お問い合わせ種別:</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{subject}</td>
            </tr>
          </table>
          
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: '#163300', marginBottom: '15px' }}>メッセージ:</h3>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #9fe870' }}>
              {message.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < message.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Default template
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h3 style={{ color: '#163300' }}>Hello {firstName}!</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Welcome to プロイー! We&apos;re excited to have you on board.
          </p>
        </div>
      )}
    </div>
    
    <div style={{ backgroundColor: '#163300', color: 'white', padding: '15px', textAlign: 'center', fontSize: '12px' }}>
      <p style={{ margin: '0' }}>このメールはプロイーのお問い合わせフォームから送信されました。</p>
      <p style={{ margin: '5px 0 0 0' }}>送信日時: {new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
    </div>
  </div>
);