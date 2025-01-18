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
    res.status(200).send('Plogging');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/user', require('./routes/user'));
app.use(json.result);
app.use(json.internalServerError);

const port = '3000'
app.listen(port, async () => {
  console.log(`The server starts at ${port}`);
});