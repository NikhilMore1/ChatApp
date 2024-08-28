const express = require('express');
const {SaveName, getNames} = require('../controllers/User.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer();

router.post('/',upload.none(),SaveName);
router.get('/',getNames);

module.exports = router;