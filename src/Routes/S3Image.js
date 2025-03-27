const express = require('express');
const token_verify = require('../Middlewares/verifyToken');
const router = express.Router();
const S3Image = require('../Middlewares/S3Image');

router.get('/getSignedImage', token_verify, S3Image.getSignedImage);

module.exports = router;