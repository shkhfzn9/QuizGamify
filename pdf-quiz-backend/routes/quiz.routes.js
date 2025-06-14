const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload.middleware');
const { uploadPDFAndGenerateQuiz } = require('../controllers/quiz.controller');

router.post('/generate', upload.single('pdf'), uploadPDFAndGenerateQuiz);

module.exports = router;