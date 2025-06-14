/**
 * Sample quiz questions data
 */
export const quizQuestions = [
    {
      question: "What is the value of x in the equation 2x + 5 = 13?",
      options: ["x = 3", "x = 4", "x = 5", "x = 6"],
      correctAnswer: 1, // Index of correct answer (0-based)
    },
    {
      question: "If a triangle has angles measuring 45° and 45°, what is the measure of the third angle?",
      options: ["45°", "60°", "90°", "180°"],
      correctAnswer: 2,
    },
    // Add more questions...
  ];
  
  /**
   * Available quizzes data
   */
  export const quizzes = [
    {
      id: 1,
      title: "Math Challenge",
      description: "Test your algebra skills",
      difficulty: "Medium",
      questions: 10,
      timeEstimate: "15 min",
      category: "Mathematics",
      image: "https://example.com/math-image.jpg",
    },
    // Add more quizzes...
  ];
  
  /**
   * AI recommendations data
   */
  export const suggestions = [
    {
      id: 1,
      title: "Improve Your Algebra",
      description: "Based on your recent quizzes, we suggest practicing more equations",
      progress: 70,
      category: "Mathematics",
      image: "https://example.com/algebra-image.jpg",
    },
    // Add more suggestions...
  ];
  
  /**
   * Badges data
   */
  export const badges = [
    {
      id: 1,
      name: "Math Wizard",
      description: "Complete 10 math quizzes",
      progress: 80,
      icon: "fa-square-root-variable",
    },
    // Add more badges...
  ];
  
  /**
   * Leaderboard data
   */
  export const leaderboardData = [
    { id: 1, name: "Alex Johnson", points: 2450, avatar: "A", change: "up" },
    // Add more leaderboard entries...
  ];