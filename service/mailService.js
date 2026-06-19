const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE || 'gmail',
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS_KEY
    }
});

async function sendOtpMail(toEmail, otpCode, purpose) {
    const isVerification = purpose === 'verification';
    const subject = isVerification 
        ? 'Verify Your Account - URL Shortener' 
        : 'Reset Your Password - URL Shortener';
    
    const title = isVerification ? 'Verify Your Email' : 'Reset Your Password';
    const actionText = isVerification 
        ? 'Thank you for signing up! Please use the following One-Time Password (OTP) to complete your registration:' 
        : 'We received a request to reset your password. Please use the following One-Time Password (OTP) to verify your identity:';
        
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">URL Shortener</h1>
                <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Shorten links, track clicks, modern analytics.</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
            <h2 style="color: #0f172a; margin-top: 0;">${title}</h2>
            <p style="color: #334155; line-height: 1.6; font-size: 16px;">${actionText}</p>
            <div style="text-align: center; margin: 30px 0; background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5;">${otpCode}</span>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-bottom: 30px;">This OTP is valid for 10 minutes. If you did not make this request, you can safely ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
            <div style="text-align: center; color: #94a3b8; font-size: 12px;">
                <p style="margin: 0;">&copy; 2026 URL Shortener Inc. All rights reserved.</p>
            </div>
        </div>
    `;

    try {
        const info = await transporter.sendMail({
            from: `"URL Shortener" <${process.env.EMAIL}>`,
            to: toEmail,
            subject: subject,
            html: htmlContent
        });
        console.log('Email sent successfully: ', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
}

module.exports = {
    sendOtpMail
};
