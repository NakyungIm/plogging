const express = require('express');
const router = express.Router();
const records = require('../controllers/records');
const { checkToken } = require('../middlewares/auth');
const { OAuth2Client } = require("google-auth-library");

// record
router.post('/', records.createRecord)
// record/{recordid}
router.get('/:record_id', records.getRecord)
// record/user/{user_id}
router.get('/user/:user_id', records.getRecordList)

module.exports = router;