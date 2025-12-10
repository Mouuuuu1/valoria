import { Resend } from 'resend';

// Email configuration - Use Resend for serverless compatibility (Railway blocks SMTP)
const resend = new Resend(process.env.RESEND_API_KEY);

// For local development fallback to nodemailer if no Resend key
let useResend = !!process.env.RESEND_API_KEY;

// Nodemailer fallback for local development
let nodemailerTransporter: any = null;
if (!useResend && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  const nodemailer = require('nodemailer');
  nodemailerTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  nodemailerTransporter.verify((error: any) => {
    if (error) {
      console.log('⚠️  Email service error:', error.message);
    } else {
      console.log('✅ Email service ready (nodemailer)');
    }
  });
} else if (useResend) {
  console.log('✅ Email service ready (Resend)');
} else {
  console.log('⚠️  No email service configured');
}

interface OrderItem {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
}

// Format currency
const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} EGP`;
};

// Generate order items HTML
const generateItemsHtml = (items: OrderItem[]): string => {
  return items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.product.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
      </tr>
    `
    )
    .join('');
};

// Customer order confirmation email
export const sendOrderConfirmationEmail = async (data: OrderEmailData): Promise<void> => {
  const itemsHtml = generateItemsHtml(data.items);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background-color: #A87C1D; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Valoria</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Order Confirmation</p>
      </div>
      
      <!-- Content -->
      <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #eee;">
        
        <h2 style="color: #A87C1D; margin-top: 0;">Thank you for your order! 🎉</h2>
        
        <p>Dear ${data.customerName},</p>
        
        <p>We're excited to confirm that we've received your order. Here are the details:</p>
        
        <!-- Order Info -->
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
          <p style="margin: 0 0 10px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p style="margin: 0;"><strong>Payment Method:</strong> ${data.paymentMethod === 'cash' ? 'Cash on Delivery' : 'InstaPay Transfer'}</p>
        </div>
        
        <!-- Order Items -->
        <h3 style="color: #A87C1D;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px;">
          <thead>
            <tr style="background-color: #A87C1D; color: white;">
              <th style="padding: 12px; text-align: left;">Product</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="padding: 12px; text-align: right;">${formatCurrency(data.subtotal)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="padding: 12px; text-align: right;">${formatCurrency(data.shipping)}</td>
            </tr>
            <tr style="background-color: #A87C1D; color: white;">
              <td colspan="2" style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 12px; text-align: right;"><strong>${formatCurrency(data.total)}</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <!-- Shipping Address -->
        <h3 style="color: #A87C1D;">Shipping Address</h3>
        <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
          <p style="margin: 0;">
            ${data.shippingAddress.street}<br>
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
          </p>
        </div>
        
        <!-- What's Next -->
        <h3 style="color: #A87C1D;">What's Next?</h3>
        <ul style="padding-left: 20px;">
          <li>Your order will be processed within 3-4 business days.</li>
          <li>You'll receive a tracking number via SMS/email once shipped.</li>
          <li>Delivery takes 3-4 business days depending on your location.</li>
        </ul>
        
        ${data.paymentMethod === 'instapay' ? `
        <!-- InstaPay Instructions -->
        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffc107;">
          <h4 style="margin-top: 0; color: #856404;">💳 InstaPay Payment Required</h4>
          <p style="margin-bottom: 10px;">Please transfer <strong>${formatCurrency(data.total)}</strong> to:</p>
          <p style="font-size: 20px; font-weight: bold; color: #A87C1D; margin: 10px 0;">01110241005</p>
          <p style="margin-bottom: 0; font-size: 14px; color: #856404;">Send your transfer screenshot to our WhatsApp to confirm your order.</p>
        </div>
        ` : ''}
        
      </div>
      
      <!-- Footer -->
      <div style="background-color: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
        <p style="margin: 0 0 10px 0;">Questions? Contact us at</p>
        <p style="margin: 0;">
          <a href="mailto:valoria.eg@gmail.com" style="color: #A87C1D;">valoria.eg@gmail.com</a> | 
          <a href="tel:+201110241005" style="color: #A87C1D;">+20 111 024 1005</a>
        </p>
        <p style="margin: 20px 0 0 0; font-size: 12px; color: #888;">© 2025 Valoria. All rights reserved.</p>
      </div>
      
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Valoria" <${process.env.EMAIL_USER}>`,
    to: data.customerEmail,
    subject: `Order Confirmed - ${data.orderNumber} | Valoria`,
    html,
  };

  try {
    console.log('📧 Sending customer confirmation to:', data.customerEmail);
    
    if (useResend) {
      // Use Resend API
      const result = await resend.emails.send({
        from: 'Valoria <onboarding@resend.dev>', // Use verified domain or resend.dev for testing
        to: data.customerEmail,
        subject: mailOptions.subject,
        html: mailOptions.html,
      });
      console.log('✅ Order confirmation email sent (Resend):', result.data?.id);
    } else if (nodemailerTransporter) {
      // Fallback to nodemailer
      const info = await nodemailerTransporter.sendMail(mailOptions);
      console.log('✅ Order confirmation email sent (nodemailer)');
      console.log('✅ Message ID:', info.messageId);
    } else {
      console.log('⚠️  Email not sent - no email service configured');
    }
  } catch (error: any) {
    console.error('❌ Failed to send customer email:', error.message);
    console.error('❌ Full error:', error);
    throw error;
  }
};

// Admin notification email
export const sendAdminOrderNotification = async (data: OrderEmailData): Promise<void> => {
  const itemsHtml = generateItemsHtml(data.items);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="background-color: #22c55e; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🛒 New Order Received!</h1>
      </div>
      
      <!-- Content -->
      <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #eee;">
        
        <!-- Order Summary -->
        <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #22c55e;">
          <h2 style="margin: 0 0 10px 0; color: #166534;">Order #${data.orderNumber}</h2>
          <p style="margin: 0; font-size: 24px; font-weight: bold; color: #166534;">${formatCurrency(data.total)}</p>
          <p style="margin: 10px 0 0 0; color: #166534;">
            <strong>Payment:</strong> ${data.paymentMethod === 'cash' ? '💵 Cash on Delivery' : '📱 InstaPay Transfer'}
          </p>
        </div>
        
        <!-- Customer Info -->
        <h3 style="color: #333; border-bottom: 2px solid #A87C1D; padding-bottom: 10px;">👤 Customer Information</h3>
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0;"><strong>Name:</strong></td>
            <td style="padding: 8px 0;">${data.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Email:</strong></td>
            <td style="padding: 8px 0;"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Phone:</strong></td>
            <td style="padding: 8px 0;"><a href="tel:${data.customerPhone}">${data.customerPhone}</a></td>
          </tr>
        </table>
        
        <!-- Shipping Address -->
        <h3 style="color: #333; border-bottom: 2px solid #A87C1D; padding-bottom: 10px;">📍 Shipping Address</h3>
        <div style="background-color: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #eee;">
          <p style="margin: 0;">
            ${data.shippingAddress.street}<br>
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
          </p>
        </div>
        
        <!-- Order Items -->
        <h3 style="color: #333; border-bottom: 2px solid #A87C1D; padding-bottom: 10px;">📦 Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 8px; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #333; color: white;">
              <th style="padding: 12px; text-align: left;">Product</th>
              <th style="padding: 12px; text-align: center;">Qty</th>
              <th style="padding: 12px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right;"><strong>Subtotal:</strong></td>
              <td style="padding: 12px; text-align: right;">${formatCurrency(data.subtotal)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right;"><strong>Shipping:</strong></td>
              <td style="padding: 12px; text-align: right;">${formatCurrency(data.shipping)}</td>
            </tr>
            <tr style="background-color: #22c55e; color: white;">
              <td colspan="2" style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 12px; text-align: right;"><strong>${formatCurrency(data.total)}</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <!-- Action Button -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/orders" 
             style="background-color: #A87C1D; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            View Order in Admin Panel
          </a>
        </div>
        
      </div>
      
      <!-- Footer -->
      <div style="background-color: #333; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px;">
        <p style="margin: 0; font-size: 12px;">This is an automated notification from Valoria Admin System</p>
      </div>
      
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Valoria Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to admin email
    subject: `🛒 New Order #${data.orderNumber} - ${formatCurrency(data.total)}`,
    html,
  };

  try {
    console.log('📧 Sending admin notification to:', process.env.ADMIN_EMAIL);
    
    if (useResend) {
      // Use Resend API
      const result = await resend.emails.send({
        from: 'Valoria Orders <onboarding@resend.dev>', // Use verified domain or resend.dev for testing
        to: process.env.ADMIN_EMAIL!,
        subject: mailOptions.subject,
        html: mailOptions.html,
      });
      console.log('✅ Admin notification email sent (Resend):', result.data?.id);
    } else if (nodemailerTransporter) {
      // Fallback to nodemailer
      const info = await nodemailerTransporter.sendMail(mailOptions);
      console.log('✅ Admin notification email sent (nodemailer)');
      console.log('✅ Message ID:', info.messageId);
    } else {
      console.log('⚠️  Email not sent - no email service configured');
    }
  } catch (error: any) {
    console.error('❌ Failed to send admin email:', error.message);
    console.error('❌ Full error:', error);
    throw error;
  }
};

// Send both emails
export const sendOrderEmails = async (data: OrderEmailData): Promise<void> => {
  console.log('📧 Starting email send process...');
  console.log('📧 Email config - USER:', process.env.EMAIL_USER);
  console.log('📧 Email config - ADMIN:', process.env.ADMIN_EMAIL);
  console.log('📧 Customer email:', data.customerEmail);
  
  try {
    await Promise.all([
      sendOrderConfirmationEmail(data),
      sendAdminOrderNotification(data),
    ]);
    console.log('✅ Both order emails sent successfully');
  } catch (error) {
    console.error('❌ Error in sendOrderEmails:', error);
    throw error;
  }
};

export default {
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
  sendOrderEmails,
};
