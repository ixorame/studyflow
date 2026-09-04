import { useState } from "react";
import { createWorker } from "tesseract.js";
import "./Notes.css";

function Notes({ onBack }) {
  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quiz, setQuiz] = useState([]);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  async function handleFile(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setFileName(file.name);
    setImage(URL.createObjectURL(file));
    setText("");
    setError("");
    setLoading(true);
    setProgress(0);

    try {
      console.log("Starting OCR...");
      console.log("File:", file);

      const worker = await createWorker("eng", 1, {
        logger: (message) => {
          console.log(message);

          if (message.status === "recognizing text") {
            setProgress(Math.round(message.progress * 100));
          }
        },
      });

      console.log("OCR worker ready!");

      const result = await worker.recognize(file);

      console.log("OCR result:", result);

      setText(result.data.text);

      await worker.terminate();

      console.log("OCR finished!");

    } catch (error) {
      console.error("OCR ERROR:", error);

      setError(
        "Sorry, we couldn't read this image. Please try a clearer image."
      );
    } finally {
      setLoading(false);
    }
  }

  async function generateSummary() {
  if (!text) {
    return;
  }

  setGeneratingSummary(true);
  setSummary("");
  setError("");

  try {
    const response = await fetch("https://studyflow-fxwq.onrender.com/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    setSummary(data.summary);

  } catch (error) {
    console.error(error);

    setError(
      "Could not generate the summary. Please try again."
    );
  } finally {
    setGeneratingSummary(false);
  }
}

async function generateFlashcards() {
  if (!text) {
    return;
  }

  setGeneratingFlashcards(true);
  setFlashcards("");
  setError("");

  try {
    const response = await fetch(
      "https://studyflow-fxwq.onrender.com/api/flashcards",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Something went wrong"
      );
    }
    if (!Array.isArray(data.flashcards)) {
  throw new Error("Gemini returned invalid flashcards.");
}

    setFlashcards(data.flashcards);
setCurrentFlashcard(0);
setShowAnswer(false);
    

  } catch (error) {
    console.error(error);

    setError(
      "Could not create flashcards. Please try again."
    );

  } finally {
    setGeneratingFlashcards(false);
  }
}

async function generateQuiz() {
  if (!text) {
    alert("Please upload your notes first.");
    return;
  }

  setGeneratingQuiz(true);
  setQuiz([]);
  setError("");

  try {
    const response = await fetch(
      "https://studyflow-fxwq.onrender.com/api/quiz",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Quiz generation failed."
      );
    }

    if (!Array.isArray(data.quiz)) {
  throw new Error("Gemini returned an invalid quiz.");
}

setQuiz(data.quiz);
setCurrentQuestion(0);
setSelectedAnswer(null);
setScore(0);
setQuizFinished(false);

  } catch (error) {
    console.error("Quiz error:", error);

    setError(
      "Could not create the quiz. Please try again."
    );

  } finally {
    setGeneratingQuiz(false);
  }
}

function selectAnswer(index) {
  setSelectedAnswer(index);
}

function nextQuestion() {
  const question = quiz[currentQuestion];

  const newScore =
    selectedAnswer === question.answer
      ? score + 1
      : score;

  setScore(newScore);

  if (currentQuestion === quiz.length - 1) {
    setQuizFinished(true);
  } else {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
  }
}

function restartQuiz() {
  setCurrentQuestion(0);
  setSelectedAnswer(null);
  setScore(0);
  setQuizFinished(false);
}

function flipFlashcard() {
  setShowAnswer(!showAnswer);
}

function nextFlashcard() {
  if (currentFlashcard < flashcards.length - 1) {
    setCurrentFlashcard(currentFlashcard + 1);
    setShowAnswer(false);
  }
}

function previousFlashcard() {
  if (currentFlashcard > 0) {
    setCurrentFlashcard(currentFlashcard - 1);
    setShowAnswer(false);
  }
}
  return (
    <div className="notes-page">

      <button
  className="back-button"
  onClick={onBack}
>
  ← Dashboard
</button>

      <div className="notes-header">
        <h1>📚 Smart Notes</h1>

        <p>
          Turn your notes into smarter study material.
        </p>
      </div>

      <div className="upload-card">

        <div className="upload-icon">
          📸
        </div>

        <h2>Upload your notes</h2>

        <p>
          Upload a clear photo of your notes
        </p>

        <label className="upload-button">
          Choose Image

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
          />
        </label>

        {fileName && (
          <p className="selected-file">
            📄 {fileName}
          </p>
        )}

      </div>

      {loading && (
        <div className="ocr-loading">

          <h2>🔍 Reading your notes...</h2>

          <p>
            OCR Progress: {progress}%
          </p>

          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p>
            This may take a little while the first time.
          </p>

        </div>
      )}

      {error && (
        <div className="ocr-error">
          ⚠️ {error}
        </div>
      )}

      {image && !loading && !error && text && (
        <div className="result-section">

          <div className="image-preview">

            <h2>📷 Your Note</h2>

            <img
              src={image}
              alt="Uploaded note"
            />

          </div>

          <div className="text-result">

  <h2>📝 Extracted Text</h2>

  <textarea
    value={text}
    readOnly
  />

  <div className="study-actions">

    <h3>✨ Create Study Material</h3>

    <div className="action-buttons">

      <button onClick={generateSummary}>
         📖 Summary
      </button>

      <button onClick={generateFlashcards}>
        🃏 Flashcards
      </button>

      <button onClick={generateQuiz}>
  📝 Quiz
</button>

    </div>

  </div>
  {generatingSummary && (
  <div className="ai-result">
    <h2>🤖 Creating your study notes...</h2>
    <p>Gemini is reading your notes.</p>
  </div>
)}

{summary && (
  <div className="ai-result">
    <h2>📖 AI Study Notes</h2>

    <div className="summary-text">
      {summary}
    </div>
  </div>
)}
{generatingFlashcards && (
  <div className="ai-result">
    <h2>🃏 Creating flashcards...</h2>
    <p>Gemini is turning your notes into questions.</p>
  </div>
)}

{Array.isArray(flashcards) && flashcards.length > 0 && (
  <div className="flashcards-container">

    <h2>🃏 Your Flashcards</h2>

    <p className="flashcard-counter">
      Card {currentFlashcard + 1} of {flashcards.length}
    </p>

    <div
      className="flashcard-single"
      onClick={flipFlashcard}
    >

      {!showAnswer ? (
        <div className="flashcard-face">

          <span className="flashcard-label">
            QUESTION
          </span>

          <h3>
            {flashcards[currentFlashcard].question}
          </h3>

          <p className="flip-hint">
            👆 Click to reveal answer
          </p>

        </div>
      ) : (
        <div className="flashcard-face">

          <span className="flashcard-label">
            ANSWER
          </span>

          <p className="flashcard-answer-text">
            {flashcards[currentFlashcard].answer}
          </p>

          <p className="flip-hint">
            👆 Click to see question
          </p>

        </div>
      )}

    </div>

    <div className="flashcard-navigation">

      <button
        onClick={previousFlashcard}
        disabled={currentFlashcard === 0}
      >
        ← Previous
      </button>

      <button
        onClick={nextFlashcard}
        disabled={
          currentFlashcard === flashcards.length - 1
        }
      >
        Next →
      </button>

    </div>

  </div>
)}

{generatingQuiz && (
  <div className="ai-result">
    <h2>📝 Creating your quiz...</h2>
    <p>Gemini is preparing questions from your notes.</p>
  </div>
)}

{Array.isArray(quiz) &&
  quiz.length > 0 &&
  quiz[currentQuestion] &&
  Array.isArray(quiz[currentQuestion].options) &&
  !quizFinished && (
  <div className="interactive-quiz">

    <div className="quiz-header">

      <h2>📝 Science Quiz</h2>

      <p>
        Question {currentQuestion + 1} of {quiz.length}
      </p>

    </div>

    <h3>
      {quiz[currentQuestion].question}
    </h3>

    <div className="quiz-options">

      {quiz[currentQuestion].options.map(
        (option, index) => (

          <button
            key={index}
            className={
              selectedAnswer === index
                ? "quiz-option selected"
                : "quiz-option"
            }
            onClick={() => selectAnswer(index)}
          >
            <span>
              {String.fromCharCode(65 + index)}.
            </span>

            {option}

          </button>

        )
      )}

    </div>

    <button
      className="next-question"
      onClick={nextQuestion}
      disabled={selectedAnswer === null}
    >
      {currentQuestion === quiz.length - 1
        ? "Finish Quiz"
        : "Next Question →"}
    </button>

  </div>
)}

{quizFinished && Array.isArray(quiz) && quiz.length > 0 && (
  <div className="quiz-result">

    <div className="result-icon">
      🎉
    </div>

    <h2>Quiz Complete!</h2>

    <div className="score">
      {score} / {quiz.length}
    </div>

    <p>
      You scored{" "}
      <strong>
        {Math.round((score / quiz.length) * 100)}%
      </strong>
    </p>

    {score === quiz.length ? (
      <p>🌟 Perfect score! Amazing!</p>
    ) : score >= 3 ? (
      <p>👏 Great job! Keep it up!</p>
    ) : (
      <p>💪 Keep practicing. You can improve!</p>
    )}

    <button
      className="next-question"
      onClick={restartQuiz}
    >
      🔄 Try Again
    </button>

  </div>
)}
</div>

        </div>
      )}

    </div>
  );
}

export default Notes;