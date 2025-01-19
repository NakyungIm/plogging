const express = require('express');
const router = express.Router();
const records = require('../controllers/records');
const { checkToken } = require('../middlewares/auth')

// record
router.post('/', checkToken, records.createRecord)
// record/{recordid}
router.get('/', checkToken, records.getRecord)
// record/user/{user_id}
router.get('/user', checkToken, records.getRecordList)

module.exports = router;