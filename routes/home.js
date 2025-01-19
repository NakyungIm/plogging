const express = require('express');
const router = express.Router();
const user = require('../controllers/user')
const { checkToken } = require('../middlewares/auth')
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/login/redirect';

router.get('/login', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    url += `?client_id=${client._clientId}`;
    url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`;
    url += '&response_type=code';
    url += '&scope=email profile';    
    // Redirect to the completed URL
    res.redirect(url);
});

router.get('/login/redirect', (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);
    res.send('Success login');
});

router.get('/ping', user.ping)
router.post('/signup', user.createUser)
router.post('/signin', user.loginUser)
router.get('/user', checkToken, user.getUser)
router.get('/category/list', user.getCategoryList)
module.exports = router;