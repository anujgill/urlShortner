// ─── Resend API helper ────────────────────────────────────────────────────────
const resendSendEmail = async ({ to, subject, html }) => {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: `"URL Shortener" <ur.url@shergill.codes>`,
            to,
            subject,
            html,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            errorData.message || "Failed to send email via Resend API"
        );
    }
    return response.json();
};

// ─── OTP Email (verification or password reset) ───────────────────────────────
async function sendOtpMail(toEmail, otpCode, purpose) {
    const isVerification = purpose === 'verification';
    const subject = isVerification
        ? 'Verify Your Account - URL Shortener'
        : 'Reset Your Password - URL Shortener';

    const title = isVerification ? 'Verify Your Email' : 'Reset Your Password';
    const actionText = isVerification
        ? 'Thank you for signing up! Please use the following One-Time Password (OTP) to complete your registration:'
        : 'We received a request to reset your password. Please use the following One-Time Password (OTP) to verify your identity:';

    const accentColor = isVerification ? '#22c55e' : '#e91e63';
    const headerEmoji = isVerification ? '👋' : '🔐';
    const footerNote = isVerification
        ? 'If you didn\'t create an account, you can safely ignore this email.'
        : '🛡️ <strong>Security Notice:</strong> If you didn\'t request a password reset, please ignore this email. Your account remains secure.';

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #4f46e5; margin: 0; font-size: 28px;">${headerEmoji} URL Shortener</h1>
                <p style="color: #64748b; margin: 5px 0 0 0; font-size: 14px;">Shorten links, track clicks, modern analytics.</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
            <h2 style="color: #0f172a; margin-top: 0;">${title}</h2>
            <p style="color: #334155; line-height: 1.6; font-size: 16px;">${actionText}</p>
            <div style="text-align: center; margin: 30px 0; background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4f46e5;">${otpCode}</span>
            </div>
            <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">⏰ This OTP is valid for 10 minutes.</p>
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid ${accentColor}; margin-bottom: 30px;">
                <p style="margin: 0; color: #475569; font-size: 13px;">${footerNote}</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
            <div style="text-align: center; color: #94a3b8; font-size: 12px;">
                <p style="margin: 0;">&copy; 2026 URL Shortener Inc. All rights reserved.</p>
            </div>
        </div>
    `;

    try {
        await resendSendEmail({ to: toEmail, subject, html: htmlContent });
        console.log('Email sent successfully via Resend');
        return true;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
}

module.exports = {
    sendOtpMail
};
