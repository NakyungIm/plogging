import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { OAuth2Client } from "google-auth-library";
// import axios from "axios";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
console.log(client._clientId);
const GOOGLE_REDIRECT_URI = 'http://localhost:3000/login/redirect';

// Root page
// Clicking the login button will redirect to GET /login
app.get('/', (req, res) => {
    res.send(`
        <h1>Log in</h1>
        <a href="/login">Log in</a>
    `);
});

// Destination router when the login button is clicked
// After processing all logic, it redirects to the Google auth server https://accounts.google.com/o/oauth2/v2/auth
// Several QueryStrings need to be attached to this URL
app.get('/login', (req, res) => {
    let url = 'https://accounts.google.com/o/oauth2/v2/auth';
    // client_id can be seen in the screenshot above
    // However, you should use the ID you obtained directly, not the one in the screenshot.
    url += `?client_id=${client._clientId}`
    // The redirect_uri we registered earlier
    // After selecting an account in the login window, the Google server will redirect to this redirect_uri
    url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`
    // Required option.
    url += '&response_type=code'
    // Specify that we want to retrieve email and profile information registered with Google
    url += '&scope=email profile'    
    // Redirect to the completed URL
    // This URL is the Google account selection screen we saw above.
    res.redirect(url);
});

// The address redirected to after selecting an account on the Google account selection screen
// Must match the GOOGLE_REDIRECT_URI we registered earlier
// We registered http://localhost:3000/login/redirect as the redirect_uri with Google,
// and also used it when creating the URL above
app.get('/login/redirect', (req, res) => {
    const { code } = req.query;
    console.log(`code: ${code}`);
    res.send('ok');
});

app.listen(3000, () => {
    console.log('server is running at 3000');
});
