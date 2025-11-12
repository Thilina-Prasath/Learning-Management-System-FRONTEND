import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ExamPage = () => {
  const navigate = useNavigate();

  // Sample questions data - replace with your actual questions
  const questions = [
    {
      id: 1,
      course: "Mathematics",
      difficulty: "Easy",
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1
    },
    {
      id: 2,
      course: "Science",
      difficulty: "Medium",
      question: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correctAnswer: 0
    },
    {
      id: 3,
      course: "History",
      difficulty: "Hard",
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correctAnswer: 1
    },
    // Add more questions as needed
  ];

  // Available courses
  const courses = ["Mathematics", "Science", "History", "English", "Geography", "Physics"];

  // State variables
  const [examStarted, setExamStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds

  // Timer effect
  useEffect(() => {
    if (examStarted && !showResults && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && examStarted) {
      handleSubmitExam();
    }
  }, [timeLeft, examStarted, showResults]);

  // Handle course selection
  const handleCourseSelection = (course) => {
    setSelectedCourses(prev => 
      prev.includes(course) 
        ? prev.filter(c => c !== course)
        : [...prev, course]
    );
  };

  // Generate exam questions
  const generateExam = () => {
    let filteredQuestions;
    
    if (selectedCourses.length === 0) {
      // Use all questions if no specific courses selected
      filteredQuestions = [...questions];
    } else {
      // Filter questions based on selected courses
      filteredQuestions = questions.filter(q => 
        selectedCourses.some(course => 
          q.course.toLowerCase().includes(course.toLowerCase().split(' ')[0])
        )
      );
    }

    // Shuffle and take up to 20 questions
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    const examSet = shuffled.slice(0, Math.min(20, shuffled.length));
    
    setExamQuestions(examSet);
    setExamStarted(true);
    setTimeLeft(3600); // Reset timer to 60 minutes
  };

  // Handle answer selection
  const handleAnswerSelect = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
  };

  // Navigation functions
  const handleNextQuestion = () => {
    if (currentQuestion < examQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionJump = (questionIndex) => {
    setCurrentQuestion(questionIndex);
  };

  // Submit exam
  const handleSubmitExam = () => {
    setShowResults(true);
  };

  // Calculate score
  const calculateScore = () => {
    return Object.entries(answers).reduce((score, [questionIndex, selectedAnswer]) => {
      return examQuestions[parseInt(questionIndex)]?.correctAnswer === selectedAnswer 
        ? score + 1 
        : score;
    }, 0);
  };

  // Get score percentage
  const getScorePercentage = () => {
    return examQuestions.length > 0 
      ? Math.round((calculateScore() / examQuestions.length) * 100)
      : 0;
  };

  // Get score analysis by course
  const getScoreAnalysis = () => {
    const analysis = {};
    
    examQuestions.forEach((question, index) => {
      const course = question.course;
      if (!analysis[course]) {
        analysis[course] = { correct: 0, total: 0 };
      }
      
      analysis[course].total++;
      if (answers[index] === question.correctAnswer) {
        analysis[course].correct++;
      }
    });
    
    return analysis;
  };

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Course Selection Phase
  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              EduPlatform Comprehensive Exam
            </h1>
            <Link
              to="/course"
              className="text-blue-600 hover:underline text-sm"
            >
              ← Back to Courses
            </Link>
          </div>

          <h2 className="text-xl font-semibold mb-2">Select Your Exam Focus</h2>
          <p className="text-gray-600 mb-6">
            Choose specific courses to focus on, or leave all unselected for a
            comprehensive exam covering all topics.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {courses.map((course) => (
              <label
                key={course}
                className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg border hover:border-blue-400 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCourses.includes(course)}
                  onChange={() => handleCourseSelection(course)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-800">{course}</span>
              </label>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">📝 Exam Details</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                <li>Up to 20 questions from selected topics</li>
                <li>60 minutes total time limit</li>
                <li>Multiple choice format</li>
                <li>Immediate results with detailed analysis</li>
                <li>Difficulty levels: Easy → Hard</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">📊 Distribution</h3>
              <p className="text-sm text-gray-700">
                Selected:{" "}
                <strong>
                  {selectedCourses.length === 0
                    ? "All courses"
                    : selectedCourses.join(", ")}
                </strong>
              </p>
              <p className="text-sm text-gray-700">
                Estimated Questions:{" "}
                <strong>
                  {selectedCourses.length === 0
                    ? Math.min(20, questions.length)
                    : Math.min(
                        20,
                        questions.filter((q) =>
                          selectedCourses.some((course) =>
                            q.course.includes(course.split(" ")[0])
                          )
                        ).length
                      )}
                </strong>
              </p>
            </div>
          </div>

          <button
            onClick={generateExam}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            Start Comprehensive Exam
          </button>
        </div>
      </div>
    );
  }

  // Results Phase
  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Exam Results</h1>

          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold">
              Your Score: {calculateScore()}/{examQuestions.length}
            </h2>
            <h3 className="text-lg text-gray-700">
              Percentage: {getScorePercentage()}%
            </h3>
            <div
              className={`mt-2 px-4 py-2 rounded-lg font-bold ${
                getScorePercentage() >= 85
                  ? "bg-green-100 text-green-700"
                  : getScorePercentage() >= 70
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {getScorePercentage() >= 85
                ? "EXCELLENT"
                : getScorePercentage() >= 70
                ? "PASSED"
                : "NEEDS IMPROVEMENT"}
            </div>
          </div>

          {/* Performance per course */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Performance by Course
            </h3>
            <div className="space-y-3">
              {Object.entries(getScoreAnalysis()).map(([course, stats]) => (
                <div key={course}>
                  <div className="flex justify-between text-sm font-medium text-gray-700">
                    <span>{course}</span>
                    <span>
                      {stats.correct}/{stats.total} (
                      {Math.round((stats.correct / stats.total) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(stats.correct / stats.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retake Exam
            </button>
            <Link
              to="/course"
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Exam Taking Phase
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="w-full max-w-6xl grid md:grid-cols-3 gap-6">
        {/* Question Panel */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h1 className="text-xl font-semibold text-gray-800">
              EduPlatform Exam
            </h1>
            <div className="text-sm text-gray-600">
              Time Left:{" "}
              <span className="font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2 text-sm">
              <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                {examQuestions[currentQuestion].course}
              </span>
              <span
                className={`px-2 py-1 rounded-md ${
                  examQuestions[currentQuestion].difficulty === "Easy"
                    ? "bg-green-100 text-green-700"
                    : examQuestions[currentQuestion].difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {examQuestions[currentQuestion].difficulty}
              </span>
            </div>

            <h2 className="text-lg font-semibold mb-2">
              Question {currentQuestion + 1}
            </h2>
            <p className="text-gray-700 mb-4">
              {examQuestions[currentQuestion].question}
            </p>

            <div className="space-y-2">
              {examQuestions[currentQuestion].options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    answers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={index}
                    checked={answers[currentQuestion] === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="hidden"
                  />
                  <span className="text-gray-800">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
            >
              Previous
            </button>
            {currentQuestion < examQuestions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Submit Exam
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold mb-3">Question Progress</h3>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {examQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleQuestionJump(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border ${
                  index === currentQuestion
                    ? "bg-blue-600 text-white"
                    : answers[index] !== undefined
                    ? "bg-green-100 border-green-400 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="text-sm text-gray-700">
            Answered: {Object.keys(answers).length}/{examQuestions.length}
          </div>
          <div className="text-sm text-gray-700">
            Remaining: {examQuestions.length - Object.keys(answers).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;