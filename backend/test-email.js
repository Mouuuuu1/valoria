require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing email configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email verification failed:', error.message);
    process.exit(1);
  } else {
    console.log('✅ Email service verified successfully');
    
    // Send test email
    const mailOptions = {
      from: `"Valoria - Test" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'Test Email from Valoria',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify the email service is working.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Failed to send test email:', error.message);
        process.exit(1);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Check your inbox at:', process.env.ADMIN_EMAIL);
        process.exit(0);
      }
    });
  }
});
