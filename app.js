const express = require("express");
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require('body-parser');
const { json } = require('./middlewares/result');
// const { OAuth2Client } = require("google-auth-library");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <h1>Plogging</h1>
    <h2>Log in</h2>
    <a href="/login">Log in</a>
`);;
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', require('./routes/home'));
app.use('/record',require('./routes/records'))
app.use('/api/distance',require('./routes/map'))
app.use(json.result);
app.use(json.internalServerError);

const port = '3000'
app.listen(port, async () => {
  console.log(`The server starts at ${port}`);
});