const express = require('express');
const router = express.Router();
const user = require('../controllers/category')

router.get('../classifier', (req, res) => {
    classifyLitter();
  })
router.get('/list', user.getCategoryList)
router.get('/color', user.getCategoryColor)

module.exports = router;