const fs = require('fs');
const pdf = require('pdf-parse');

exports.parsePdf = async (pdfPath) => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    // Clean text by removing excessive whitespace and line breaks
    let cleanText = data.text
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Truncate if too long for Gemini (3000 tokens ~= 6000 chars)
    if (cleanText.length > 6000) {
      cleanText = cleanText.substring(0, 6000) + '... [TRUNCATED]';
    }

    return cleanText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF');
  }
};
