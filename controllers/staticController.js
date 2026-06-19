const urlData = require('../models/urlModel');

async function showHomePage(req, res) {
    try {
        const error = req.query.error || null;
        const msg = req.query.msg || null;
        const baseUrl = process.env.base_URL || (req.protocol + '://' + req.get('host'));

        if (req.user) {
            // Logged in: Render dashboard with their links (newest first)
            const allUrls = await urlData.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
            return res.render('dashboard', {
                urlData: allUrls,
                baseUrl: baseUrl,
                user: req.user,
                error,
                msg
            });
        }

        // Guest: Render public landing page
        return res.render('landing', {
            baseUrl: baseUrl,
            error,
            msg
        });
    } catch (err) {
        console.error('Home Page Render Error:', err);
        return res.status(500).send('Internal Server Error');
    }
}

function showSignUp(req, res) {
    res.render('signup', {
        error: req.query.error || null,
        msg: req.query.msg || null
    });
}

function showLogIn(req, res) {
    res.render('login', {
        error: req.query.error || null,
        msg: req.query.msg || null
    });
}

function showVerifyOtp(req, res) {
    const email = req.query.email || '';
    if (!email) {
        return res.redirect('/signup?error=Please register first.');
    }
    res.render('verify-otp', {
        email,
        error: req.query.error || null,
        msg: req.query.msg || null
    });
}

function showForgotPassword(req, res) {
    res.render('forgot-password', {
        error: req.query.error || null,
        msg: req.query.msg || null
    });
}

function showResetPassword(req, res) {
    const email = req.query.email || '';
    if (!email) {
        return res.redirect('/forgot-password?error=Provide registered email first.');
    }
    res.render('reset-password', {
        email,
        error: req.query.error || null,
        msg: req.query.msg || null
    });
}

module.exports = {
    showHomePage,
    showSignUp,
    showLogIn,
    showVerifyOtp,
    showForgotPassword,
    showResetPassword,
};