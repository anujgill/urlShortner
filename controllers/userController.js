const users = require('../models/userModel');
const { setUser } = require('../service/auth');
const { sendOtpMail } = require('../service/mailService');
const bcrypt = require('bcryptjs');

async function handleSignUp(req, res) {
    try {
        const { username, email, password, confirmPassword } = req.body;
        if (!username || !email || !password || !confirmPassword) {
            return res.render('signup', { error: 'All fields are required.', msg: null, username: username || '', email: email || '', password: password || '', confirmPassword: confirmPassword || '' });
        }
        if (password !== confirmPassword) {
            return res.render('signup', { error: 'Passwords do not match.', msg: null, username: username || '', email: email || '', password: password || '', confirmPassword: confirmPassword || '' });
        }

        const existingUser = await users.findOne({ email });
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (existingUser) {
            if (existingUser.isVerified) {
                return res.render('signup', { error: 'Email already registered. Please log in.', msg: null, username: username || '', email: email || '', password: password || '', confirmPassword: confirmPassword || '' });
            } else {
                // Update unverified user's credentials and send new OTP
                existingUser.username = username;
                existingUser.password = hashedPassword;
                existingUser.otp = {
                    code: otpCode,
                    expiry: otpExpiry,
                    purpose: 'verification'
                };
                await existingUser.save();
                await sendOtpMail(email, otpCode, 'verification');
                return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}&msg=Verification code sent to your email.`);
            }
        }

        // Create new unverified user
        const newUser = new users({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
            otp: {
                code: otpCode,
                expiry: otpExpiry,
                purpose: 'verification'
            }
        });

        await newUser.save();
        await sendOtpMail(email, otpCode, 'verification');
        return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}&msg=Verification code sent to your email.`);
    } catch (error) {
        console.error('Sign Up Error:', error);
        return res.render('signup', { error: 'An error occurred during registration. Please try again.', msg: null, username: req.body.username || '', email: req.body.email || '', password: req.body.password || '', confirmPassword: req.body.confirmPassword || '' });
    }
}

async function handleLogIn(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('login', { error: 'Please provide email and password.', msg: null });
        }

        const user = await users.findOne({ email });
        if (!user) {
            return res.render('login', { error: 'Invalid email or password.', msg: null });
        }

        // Compare bcrypt passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid email or password.', msg: null });
        }

        // Check verification status
        if (!user.isVerified) {
            // Generate a fresh OTP and send it
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
            user.otp = {
                code: otpCode,
                expiry: otpExpiry,
                purpose: 'verification'
            };
            await user.save();
            await sendOtpMail(email, otpCode, 'verification');
            return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}&error=Your account is not verified yet. A new OTP has been sent.`);
        }

        setUser(user, res);
        return res.redirect('/');
    } catch (error) {
        console.error('Log In Error:', error);
        return res.render('login', { error: 'An error occurred during login. Please try again.', msg: null });
    }
}

async function handleLogOut(req, res) {
    res.clearCookie("uid");
    return res.redirect('/');
}

async function handleVerifyOtp(req, res) {
    const { email, otp } = req.body;
    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.render('verify-otp', { email, error: 'User not found.', msg: null });
        }

        if (user.isVerified) {
            setUser(user, res);
            return res.redirect('/');
        }

        const otpRecord = user.otp;
        if (!otpRecord || otpRecord.code !== otp || otpRecord.purpose !== 'verification') {
            return res.render('verify-otp', { email, error: 'Invalid verification code.', msg: null });
        }

        if (new Date() > otpRecord.expiry) {
            return res.render('verify-otp', { email, error: 'OTP has expired. Please request a new one.', msg: null });
        }

        // Verify and log in
        user.isVerified = true;
        user.otp = undefined; // clear otp
        await user.save();

        setUser(user, res);
        return res.redirect('/');
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return res.render('verify-otp', { email, error: 'An error occurred. Please try again.', msg: null });
    }
}

async function handleResendOtp(req, res) {
    const email = req.query.email || req.body.email;
    try {
        const user = await users.findOne({ email });
        if (!user) {
            return res.redirect('/signup?error=Email not registered.');
        }

        if (user.isVerified) {
            return res.redirect('/login?msg=Account already verified. Please log in.');
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = {
            code: otpCode,
            expiry: otpExpiry,
            purpose: 'verification'
        };
        await user.save();

        await sendOtpMail(email, otpCode, 'verification');
        return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}&msg=A new verification code has been sent.`);
    } catch (error) {
        console.error('Resend OTP Error:', error);
        return res.redirect(`/verify-otp?email=${encodeURIComponent(email)}&error=Failed to send new verification code. Please try again.`);
    }
}

async function handleForgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) {
            return res.render('forgot-password', { error: 'Please enter your email.', msg: null });
        }

        const user = await users.findOne({ email });
        if (!user) {
            // For security reasons, we could say email sent, but letting them know is fine too
            return res.render('forgot-password', { error: 'No account found with this email.', msg: null });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = {
            code: otpCode,
            expiry: otpExpiry,
            purpose: 'reset'
        };
        await user.save();

        await sendOtpMail(email, otpCode, 'reset');
        return res.redirect(`/reset-password?email=${encodeURIComponent(email)}&msg=Password reset code sent to your email.`);
    } catch (error) {
        console.error('Forgot Password Error:', error);
        return res.render('forgot-password', { error: 'An error occurred. Please try again.', msg: null });
    }
}

async function handleResetPassword(req, res) {
    const { email, otp, password, confirmPassword } = req.body;
    try {
        if (!email || !otp || !password || !confirmPassword) {
            return res.render('reset-password', { email, error: 'All fields are required.', msg: null, otp: otp || '', password: password || '', confirmPassword: confirmPassword || '' });
        }

        if (password !== confirmPassword) {
            return res.render('reset-password', { email, error: 'Passwords do not match.', msg: null, otp: otp || '', password: password || '', confirmPassword: confirmPassword || '' });
        }

        const user = await users.findOne({ email });
        if (!user) {
            return res.render('reset-password', { email, error: 'User not found.', msg: null, otp: otp || '', password: password || '', confirmPassword: confirmPassword || '' });
        }

        const otpRecord = user.otp;
        if (!otpRecord || otpRecord.code !== otp || otpRecord.purpose !== 'reset') {
            return res.render('reset-password', { email, error: 'Invalid reset code.', msg: null, otp: otp || '', password: password || '', confirmPassword: confirmPassword || '' });
        }

        if (new Date() > otpRecord.expiry) {
            return res.render('reset-password', { email, error: 'Reset code has expired. Please request a new one.', msg: null, otp: otp || '', password: password || '', confirmPassword: confirmPassword || '' });
        }

        // Update password and clear OTP
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.otp = undefined;
        await user.save();

        return res.redirect('/login?msg=Password reset successfully! Please log in with your new password.');
    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.render('reset-password', { email, error: 'An error occurred. Please try again.', msg: null, otp: req.body.otp || '', password: req.body.password || '', confirmPassword: req.body.confirmPassword || '' });
    }
}

module.exports = {
    handleSignUp,
    handleLogIn,
    handleLogOut,
    handleVerifyOtp,
    handleResendOtp,
    handleForgotPassword,
    handleResetPassword,
};