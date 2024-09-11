const express = require('express');
const {SaveName, getNames} = require('../controllers/User.controller');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/User.middleware');

router.post('/',upload.single("image"),SaveName);
router.get('/',getNames);

module.exports = router;