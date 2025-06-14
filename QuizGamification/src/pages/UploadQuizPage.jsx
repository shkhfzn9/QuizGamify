import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Button from "../components/ui/Button";
import axios from "axios";
import Header from "../components/common/Header";
import NavTabs from "../components/common/NavTabs";

const UploadQuizPage = () => {
  const [activeTab, setActiveTab] = useState("manual"); // "manual" or "pdf"
  const [quizData, setQuizData] = useState({
    title: "",
    category: "",
    difficulty: "medium",
    description: "",
    questions: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: "",
    options: ["", "", "", ""],
    correctOption: 0,
  });
  const [message, setMessage] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isGuideCollapsed, setIsGuideCollapsed] = useState(false);

  // PDF Generation states
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigate = useNavigate();

  const handleAddQuestion = () => {
    if (
      !currentQuestion.questionText ||
      currentQuestion.options.some((opt) => !opt)
    ) {
      setMessage("Please fill all question fields");
      return;
    }

    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, currentQuestion],
    }));

    setCurrentQuestion({
      questionText: "",
      options: ["", "", "", ""],
      correctOption: 0,
    });

    setMessage("Question added successfully!");
  };

  const handleEditQuestion = (index) => {
    setCurrentQuestion(quizData.questions[index]);
    setEditingIndex(index);
  };

  const handleUpdateQuestion = () => {
    if (
      !currentQuestion.questionText ||
      currentQuestion.options.some((opt) => !opt)
    ) {
      setMessage("Please fill all question fields");
      return;
    }

    const updatedQuestions = [...quizData.questions];
    updatedQuestions[editingIndex] = currentQuestion;

    setQuizData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));

    setCurrentQuestion({
      questionText: "",
      options: ["", "", "", ""],
      correctOption: 0,
    });

    setEditingIndex(-1);
    setMessage("Question updated successfully!");
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index);

    setQuizData((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));

    // If we're editing the question being deleted, reset editing state
    if (editingIndex === index) {
      setCurrentQuestion({
        questionText: "",
        options: ["", "", "", ""],
        correctOption: 0,
      });
      setEditingIndex(-1);
    }

    setMessage("Question deleted successfully!");
  };

  const handleCancelEdit = () => {
    setCurrentQuestion({
      questionText: "",
      options: ["", "", "", ""],
      correctOption: 0,
    });
    setEditingIndex(-1);
  };

  // PDF Generation functions
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected?.type === "application/pdf") {
      setFile(selected);
      setMessage("");
    } else {
      setMessage("❌ Please select a valid PDF file");
    }
  };

  const generateQuizFromPDF = async () => {
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const { data } = await axios.post(
        "http://localhost:5000/api/quiz/generate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        // Set the generated quiz data so user can edit it
        setQuizData(data.quiz);
        setActiveTab("manual"); // Switch to manual tab for editing
        setMessage(
          "✅ Quiz generated successfully! You can now edit and add more questions."
        );
      } else {
        setMessage(`❌ ${data.error || "Failed to generate quiz"}`);
      }
    } catch (err) {
      setMessage(
        `❌ ${err.response?.data?.error || "Failed to connect to the server"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuiz = async () => {
    if (
      !quizData.title ||
      !quizData.category ||
      quizData.questions.length === 0
    ) {
      setMessage(
        "❌ Please fill all quiz fields and add at least one question"
      );
      return;
    }

    setLoading(true);
    try {
      // Create a document ID from the quiz title (sanitized)
      const documentId = quizData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .trim();

      // Check if document ID is valid
      if (!documentId) {
        setMessage("❌ Please provide a valid quiz title");
        return;
      }

      setUploadProgress(50);
      const quizRef = doc(db, "quizzes", documentId);
      await setDoc(quizRef, {
        ...quizData,
        sourceFile: file ? file.name : null,
        createdAt: new Date(),
        timeEstimate: `${quizData.questions.length * 1.5} min`,
      });

      setUploadProgress(100);
      setMessage("✅ Quiz uploaded successfully!");

      setTimeout(() => {
        navigate("/quizzes");
      }, 1500);
    } catch (error) {
      setMessage(`❌ Error uploading quiz: ${error.message}`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavTabs activeTab="upload" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Create New Quiz */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Create New Quiz
            </h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("manual")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "manual"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className="fas fa-edit mr-2"></i>
              Manual Creation
            </button>
            <button
              onClick={() => setActiveTab("pdf")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "pdf"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className="fas fa-file-pdf mr-2"></i>
              Generate from PDF
            </button>
          </div>

          <div className="space-y-6">
            {/* PDF Generation Tab */}
            {activeTab === "pdf" && (
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  Generate Quiz from PDF Using Ai <br />
                  <p className="text-lg font-semibold text-red-800 mb-4">
                    "NOTE: Try running locally for quiz generator as deploying
                    Backend was costing money untill i find a alternate way to
                    deploy backend"
                  </p>
                </h3>

                <div className="flex flex-col items-center mb-4">
                  <label className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded cursor-pointer mb-2">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <i className="fas fa-upload mr-2"></i>
                    Choose PDF File
                  </label>
                  {file && (
                    <p className="mt-2 text-gray-700">
                      Selected: <span className="font-medium">{file.name}</span>
                    </p>
                  )}
                </div>

                <Button
                  onClick={generateQuizFromPDF}
                  disabled={!file || loading}
                  className={`w-full ${
                    !file || loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic mr-2"></i>
                      Ai Quiz Generation
                    </>
                  )}
                </Button>

                <p className="text-sm text-gray-600 mt-3 text-center">
                  Upload a PDF and we'll automatically generate quiz questions
                  for you. You can then edit and add more questions manually.
                </p>
              </div>
            )}

            {/* Manual Creation Tab */}
            {activeTab === "manual" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quiz Title
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={quizData.title}
                      onChange={(e) =>
                        setQuizData({ ...quizData, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      value={quizData.category}
                      onChange={(e) =>
                        setQuizData({ ...quizData, category: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={quizData.difficulty}
                    onChange={(e) =>
                      setQuizData({ ...quizData, difficulty: e.target.value })
                    }
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows="2"
                    value={quizData.description}
                    onChange={(e) =>
                      setQuizData({ ...quizData, description: e.target.value })
                    }
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Add Questions
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        value={currentQuestion.questionText}
                        onChange={(e) =>
                          setCurrentQuestion({
                            ...currentQuestion,
                            questionText: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Options (mark correct answer)
                      </label>
                      {currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="radio"
                            name="correctOption"
                            checked={currentQuestion.correctOption === index}
                            onChange={() =>
                              setCurrentQuestion({
                                ...currentQuestion,
                                correctOption: index,
                              })
                            }
                          />
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...currentQuestion.options];
                              newOptions[index] = e.target.value;
                              setCurrentQuestion({
                                ...currentQuestion,
                                options: newOptions,
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={
                          editingIndex >= 0
                            ? handleUpdateQuestion
                            : handleAddQuestion
                        }
                      >
                        <i
                          className={`fas ${
                            editingIndex >= 0 ? "fa-save" : "fa-plus"
                          } mr-2`}
                        ></i>
                        {editingIndex >= 0 ? "Update Question" : "Add Question"}
                      </Button>

                      {editingIndex >= 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <i className="fas fa-times mr-2"></i>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {quizData.questions.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Added Questions ({quizData.questions.length})
                    </h2>

                    <div className="space-y-4">
                      {quizData.questions.map((q, qIndex) => (
                        <div
                          key={qIndex}
                          className={`p-4 rounded-lg border ${
                            editingIndex === qIndex
                              ? "bg-blue-50 border-blue-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{q.questionText}</p>
                              <ul className="mt-2 space-y-1">
                                {q.options.map((opt, optIndex) => (
                                  <li
                                    key={optIndex}
                                    className={`text-sm ${
                                      q.correctOption === optIndex
                                        ? "text-green-600 font-medium"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {optIndex + 1}. {opt}
                                    {q.correctOption === optIndex && (
                                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                        Correct
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => handleEditQuestion(qIndex)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit Question"
                                disabled={
                                  editingIndex >= 0 && editingIndex !== qIndex
                                }
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(qIndex)}
                                className="text-red-600 hover:text-red-800 p-1"
                                title="Delete Question"
                                disabled={editingIndex >= 0}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>

                          {editingIndex === qIndex && (
                            <div className="mt-3 pt-3 border-t border-blue-200">
                              <p className="text-sm text-blue-600 font-medium">
                                <i className="fas fa-info-circle mr-1"></i>
                                Currently editing this question above
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Upload Progress */}
            {uploadProgress > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Upload Progress</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <div
                className={`p-3 rounded-lg text-center ${
                  message.startsWith("✅")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* Action Buttons - Show only if manual tab or if quiz exists */}
            {(activeTab === "manual" || quizData.questions.length > 0) && (
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/quizzes")}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={quizData.questions.length === 0 || loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Save Quiz
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
              </div>
            </div>
            
            {/* Right Column - How to Create Quiz Guide */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 lg:sticky lg:top-8">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-blue-800 flex items-center">
                      <i className="fas fa-lightbulb mr-2 text-yellow-500"></i>
                      How to Create a Quiz from Any Content
                    </h2>
                    <button
                      onClick={() => setIsGuideCollapsed(!isGuideCollapsed)}
                      className="lg:hidden text-blue-600 hover:text-blue-800 p-1"
                      aria-label="Toggle guide"
                    >
                      <i className={`fas ${isGuideCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
                    </button>
                  </div>

                  <div className={`${isGuideCollapsed ? 'hidden' : 'block'} lg:block`}>
                    <ol className="space-y-3 sm:space-y-4 list-decimal list-inside text-sm sm:text-base">
                    <li className="text-gray-700">
                      <span className="font-medium">Find your source content:</span>
                      <ul className="mt-1 ml-4 sm:ml-6 space-y-1 list-disc text-gray-600 text-xs sm:text-sm">
                        <li>Articles, Wikipedia pages, or educational blogs</li>
                        <li>Textbooks or study materials</li>
                        <li>Research papers or reports</li>
                        <li>Online courses or tutorials</li>
                      </ul>
                    </li>

                    <li className="text-gray-700">
                      <span className="font-medium">Prepare your PDF:</span>
                      <ul className="mt-1 ml-4 sm:ml-6 space-y-1 list-disc text-gray-600 text-xs sm:text-sm">
                        <li>Copy the text you want to convert into a quiz</li>
                        <li>Paste it into Google Docs or any text editor</li>
                        <li>Format it clearly with headings and paragraphs</li>
                        <li>Go to File → Download → PDF Document (.pdf)</li>
                      </ul>
                    </li>

                    <li className="text-gray-700">
                      <span className="font-medium">Upload & Generate:</span>
                      <ul className="mt-1 ml-4 sm:ml-6 space-y-1 list-disc text-gray-600 text-xs sm:text-sm">
                        <li>Switch to "Generate from PDF" tab</li>
                        <li>Click "Choose PDF File" and select your file</li>
                        <li>Click "AI Quiz Generation" for automatic creation</li>
                        <li>Review and edit the generated questions</li>
                      </ul>
                    </li>

                    <li className="text-gray-700">
                      <span className="font-medium">Manual Creation:</span>
                      <ul className="mt-1 ml-4 sm:ml-6 space-y-1 list-disc text-gray-600 text-xs sm:text-sm">
                        <li>Use "Manual Creation" tab</li>
                        <li>Fill in quiz details (title, category, difficulty)</li>
                        <li>Add questions one by one</li>
                        <li>Mark correct answers for each question</li>
                      </ul>
                    </li>
                  </ol>

                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-100 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium flex items-start text-xs sm:text-sm">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        <strong>Pro Tip:</strong> The clearer and more structured your source text, the better the AI-generated quiz will be!
                      </span>
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="text-green-800 font-medium text-sm flex items-center mb-2">
                      <i className="fas fa-star mr-2 text-yellow-500"></i>
                      Best Practices
                    </h3>
                    <ul className="space-y-1 text-green-700 text-xs">
                      <li>• Keep questions clear and concise</li>
                      <li>• Provide 4 answer options for each question</li>
                      <li>• Mix difficulty levels for engagement</li>
                      <li>• Test your quiz before publishing</li>
                    </ul>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-gray-500 text-xs">
                      Need help? Contact our support team
                    </p>
                  </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadQuizPage;
