const express = require('express');
const pdfController = require('../controllers/pdfController');

const router = express.Router();

router.get('/knowledgeBase', pdfController.knowledgeBase);

module.exports = router;
