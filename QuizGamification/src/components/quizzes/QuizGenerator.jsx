import { useState } from "react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const QuizGenerator = () => {
  const [file, setFile] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected?.type === "application/pdf") {
      setFile(selected);
      setQuiz(null);
      setError("");
      setSuccess("");
    } else {
      setError("Please select a valid PDF file");
    }
  };

  const generateQuiz = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

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
        setQuiz(data.quiz);
        setSuccess("Quiz generated successfully!");
      } else {
        setError(data.error || "Failed to generate quiz");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const uploadQuiz = async () => {
    if (!quiz) return;

    setLoading(true);
    setError("");

    try {
      // Create a document ID from the quiz title (sanitized)
      const documentId = quiz.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .trim();

      // Check if document ID is valid
      if (!documentId) {
        setError("❌ Quiz title is not valid for document ID");
        return;
      }

      setUploadProgress(50); // Show progress

      // Save directly to Firestore (like UploadQuizPage)
      const quizRef = doc(db, "quizzes", documentId);
      await setDoc(quizRef, {
        ...quiz,
        sourceFile: file ? file.name : null, // Store filename reference
        createdAt: new Date(),
        timeEstimate: `${quiz.questions.length * 1.5} min`,
      });

      setUploadProgress(100);
      setSuccess(`✅ Quiz saved successfully! Document ID: ${documentId}`);

      // Reset form after successful upload
      setTimeout(() => {
        setQuiz(null);
        setFile(null);
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 px-2">
        PDF to Quiz Generator using Ai
      </h1>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col items-center mb-4">
          <label className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 sm:py-2 sm:px-4 rounded cursor-pointer mb-2 text-center min-w-[140px] touch-manipulation">
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
            <p className="mt-2 text-gray-700 text-center text-sm sm:text-base px-2">
              Selected: <span className="font-medium break-all">{file.name}</span>
            </p>
          )}
        </div>

        <button
          onClick={generateQuiz}
          disabled={!file || loading}
          className={`w-full py-3 sm:py-2 px-4 rounded font-medium transition-colors touch-manipulation ${
            !file || loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Generating...
            </>
          ) : (
            <>
              <i className="fas fa-magic mr-2"></i>
              Generate Quiz
            </>
          )}
        </button>
      </div>

      {uploadProgress > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Upload Progress</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {quiz && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 break-words">{quiz.title}</h2>
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap">
                {quiz.category}
              </span>
              <span
                className={`px-2 py-1 rounded whitespace-nowrap ${
                  quiz.difficulty === "easy"
                    ? "bg-green-100 text-green-800"
                    : quiz.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {quiz.difficulty}
              </span>
            </div>
            <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">{quiz.description}</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {quiz.questions.map((q, i) => (
              <div
                key={i}
                className="border-b border-gray-200 pb-4 sm:pb-6 last:border-0"
              >
                <h3 className="font-medium text-base sm:text-lg text-gray-800 mb-3 leading-relaxed">
                  <span className="text-blue-600 font-semibold">{i + 1}.</span> {q.questionText}
                </h3>
                <ul className="space-y-2 pl-3 sm:pl-5">
                  {q.options.map((opt, j) => (
                    <li
                      key={j}
                      className={`text-sm sm:text-base leading-relaxed ${
                        j === q.correctOption
                          ? "text-green-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="font-semibold text-gray-500 mr-2">{String.fromCharCode(65 + j)}.</span>
                      {opt}{" "}
                      {j === q.correctOption && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded whitespace-nowrap">
                          ✓ Correct
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <button
            onClick={uploadQuiz}
            disabled={loading}
            className={`w-full mt-4 sm:mt-6 py-3 sm:py-2 px-4 rounded font-medium transition-colors touch-manipulation ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Saving Quiz...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Save Quiz to Database
              </>
            )}
          </button>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg animate-fade-in z-50">
          <div className="flex items-start">
            <i className="fas fa-exclamation-triangle mr-2 mt-0.5 text-red-500"></i>
            <p className="text-sm sm:text-base break-words">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg animate-fade-in z-50">
          <div className="flex items-start">
            <i className="fas fa-check-circle mr-2 mt-0.5 text-green-500"></i>
            <p className="text-sm sm:text-base break-words">{success}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
