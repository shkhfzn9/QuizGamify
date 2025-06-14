const { GoogleGenerativeAI } = require('@google/generative-ai');
const { checkContentPolicy } = require('./contentModeration.service');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateQuizFromText = async (text) => {
  try {
    // Check content policy first
    const contentCheck = await checkContentPolicy(text);
    
    if (!contentCheck.isAppropriate) {
      throw new Error(`Content Policy Violation: ${contentCheck.reason}. This PDF contains inappropriate content that violates our policy.`);
    }
    
    console.log('Generating quiz from text length:', text.length);
    console.log('Text preview:', text.substring(0, 200) + '...');
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
    Generate a quiz from this text with these requirements:
    - 5-10 multiple choice questions
    - 4 options per question
    - Mark correct answer with index (0-3)
    - Include title, category, difficulty (easy/medium/hard), description
    - Format as clean JSON without markdown
    
    Text: ${text}
    
    Required JSON format:
    {
      "title": "Quiz Title",
      "category": "Subject",
      "difficulty": "easy/medium/hard",
      "description": "Brief summary",
      "questions": [
        {
          "questionText": "Question here",
          "options": ["A", "B", "C", "D"],
          "correctOption": 0
        }
      ]
    }`;

    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('Gemini raw response:', responseText);
    
    // Clean Gemini response
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No valid JSON found in Gemini response');
    }
    
    const jsonString = responseText.slice(jsonStart, jsonEnd);
    console.log('Extracted JSON string:', jsonString);
    
    const parsedQuiz = JSON.parse(jsonString);
    console.log('Successfully parsed quiz with', parsedQuiz.questions?.length, 'questions');
    
    return parsedQuiz;
  } catch (error) {
    console.error('Gemini error details:', {
      message: error.message,
      stack: error.stack
    });
    throw new Error(`Failed to generate quiz from text: ${error.message}`);
  }
};

module.exports = { generateQuizFromText };