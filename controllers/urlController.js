const urlData = require('../models/urlModel');
const randomId = require('random-id');

async function handlePostURL(req, res) {
    try {
        let originalUrl = req.body.oriurl ? req.body.oriurl.trim() : '';
        const customAlias = req.body.customAlias ? req.body.customAlias.trim() : '';

        if (!originalUrl) {
            return res.redirect('/?error=URL is required.');
        }

        // Auto-prepend https:// if protocol is missing
        if (!/^https?:\/\//i.test(originalUrl)) {
            originalUrl = 'https://' + originalUrl;
        }

        // Validate URL format
        try {
            new URL(originalUrl);
        } catch (err) {
            return res.redirect('/?error=Invalid URL format.');
        }

        let shortCode = '';

        if (customAlias) {
            // Validate custom alias format
            const aliasRegex = /^[a-zA-Z0-9-_]+$/;
            if (!aliasRegex.test(customAlias)) {
                return res.redirect('/?error=Custom alias can only contain alphanumeric characters, hyphens, and underscores.');
            }
            if (customAlias.length < 3 || customAlias.length > 30) {
                return res.redirect('/?error=Custom alias must be between 3 and 30 characters.');
            }

            // Check if custom alias is already taken
            const existing = await urlData.findOne({ short_url: customAlias });
            if (existing) {
                return res.redirect('/?error=This custom alias is already in use. Please try another one.');
            }
            shortCode = customAlias;
        } else {
            // Generate random code and ensure uniqueness
            let uniqueCodeFound = false;
            while (!uniqueCodeFound) {
                const code = randomId(8, 'aA0');
                const dup = await urlData.findOne({ short_url: code });
                if (!dup) {
                    shortCode = code;
                    uniqueCodeFound = true;
                }
            }
        }

        await urlData.create({
            original_url: originalUrl,
            short_url: shortCode,
            visitCount: 0,
            createdBy: req.user._id
        });

        return res.redirect('/?msg=URL shortened successfully!');
    } catch (error) {
        console.error('Create URL Error:', error);
        return res.redirect('/?error=An error occurred while shortening the URL.');
    }
}

async function handlegetURL(req, res) {
    try {
        const short_url = req.params.shortUrl;
        const redURL = await urlData.findOneAndUpdate(
            { short_url },
            { $inc: { visitCount: 1 } },
            { new: true }
        );

        if (!redURL) {
            return res.status(404).render('404', { message: 'Short URL not found.' });
        }

        return res.redirect(redURL.original_url);
    } catch (error) {
        console.error('Resolve URL Error:', error);
        return res.status(500).render('404', { message: 'An error occurred while redirecting.' });
    }
}

async function handleDeleteURL(req, res) {
    try {
        const id = req.params.id;
        const urlItem = await urlData.findById(id);

        if (!urlItem) {
            return res.status(404).json({ error: 'URL not found.' });
        }

        // Security check: must be owner
        if (urlItem.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to delete this URL.' });
        }

        await urlData.findByIdAndDelete(id);
        return res.json({ success: true, message: 'URL deleted successfully.' });
    } catch (error) {
        console.error('Delete URL Error:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the URL.' });
    }
}

module.exports = {
    handlePostURL,
    handlegetURL,
    handleDeleteURL,
};