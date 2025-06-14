const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const checkContentPolicy = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
    Analyze the following text for content policy violations. 
    Check for: 18+ content, explicit sexual material, graphic violence, hate speech, abusive language, harassment, or inappropriate content for educational purposes.
    
    Respond with only a JSON object:
    {
      "isAppropriate": true/false,
      "reason": "explanation if inappropriate",
      "categories": ["list of violation types if any"]
    }
    
    Text: ${text.substring(0, 3000)}...
    `;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    const jsonString = responseText.slice(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Content moderation error:', error);
    // Default to allowing content if moderation fails
    return { isAppropriate: true, reason: null, categories: [] };
  }
};

module.exports = { checkContentPolicy };