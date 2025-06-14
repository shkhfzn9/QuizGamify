const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateQuiz = async (text, title) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Create a multiple-choice quiz based on the following text. Follow these requirements:
    
    1. Generate 3-5 high quality questions
    2. Each question should have 4 options (A, B, C, D)
    3. Mark the correct answer (0-3 index)
    4. Questions should cover key concepts
    5. Return in this exact JSON format:
    {
      "title": "Quiz Title",
      "description": "Brief summary",
      "category": "General",
      "difficulty": "medium",
      "questions": [
        {
          "questionText": "What is...?",
          "options": ["A", "B", "C", "D"],
          "correctOption": 0
        }
      ]
    }
    
    Text to analyze:
    ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json|```/g, '').trim();
    
    const quiz = JSON.parse(jsonString);
    quiz.title = title || quiz.title;
    quiz.timeEstimate = `${Math.ceil(quiz.questions.length * 1.5)} min`;
    quiz.createdAt = new Date().toISOString();

    return quiz;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz with Gemini');
  }
};
