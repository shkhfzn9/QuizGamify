const { extractTextFromPDF } = require('../services/file.service');
const { generateQuizFromText } = require('../services/gemini.service');
const fs = require('fs');

const uploadPDFAndGenerateQuiz = async (req, res) => {
  try {
    console.log('=== PDF Upload Request ===');
    console.log('File info:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF uploaded' });
    }

    console.log('File uploaded successfully:', {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    console.log('Starting text extraction...');
    const text = await extractTextFromPDF(req.file.path);
    console.log('Text extracted successfully, length:', text.length);
    
    console.log('Starting quiz generation...');
    const quiz = await generateQuizFromText(text);
    console.log('Quiz generated successfully');
    
    // Clean up file
    fs.unlinkSync(req.file.path);
    console.log('Temporary file cleaned up');

    res.json({ 
      success: true,
      quiz 
    });

  } catch (error) {
    console.error('Controller error:', error);
    
    // Clean up file if exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
      console.log('Cleaned up file after error');
    }
    
    res.status(500).json({ 
      error: error.message || 'Quiz generation failed' 
    });
  }
};

module.exports = { uploadPDFAndGenerateQuiz };