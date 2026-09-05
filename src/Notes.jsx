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
    <div className="notes-container">
      <div className="notes-topbar">
        <button className="back-button" onClick={onBack}>
          ← Back to dashboard
        </button>

        <span className="notes-status">
          <span className="status-dot" />
          Study workspace
        </span>
      </div>

      <header className="notes-header">
        <div>
          <p className="section-label">SMART NOTES</p>
          <h1>Turn notes into a study plan.</h1>
          <p>
            Upload a clear image, extract its text, and create revision
            material in a few clicks.
          </p>
        </div>

        <div className="header-icon">📚</div>
      </header>

      <section className="upload-card">
        <div className="upload-icon">📷</div>
        <h2>Upload your notes</h2>
        <p>Choose a clear image of your handwritten or printed notes.</p>

        <label className="upload-button">
          <span>Choose image</span>
          <span>→</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
          />
        </label>

        <p className="upload-help">JPG, PNG, or any clear image file</p>

        {fileName && (
          <div className="selected-file">
            <span>📄</span>
            <span>{fileName}</span>
          </div>
        )}
      </section>

      {loading && (
        <section className="ocr-loading">
          <div className="loading-icon">🔍</div>
          <div>
            <h2>Reading your notes</h2>
            <p>Extracting text from your image… {progress}%</p>
          </div>

          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>
      )}

      {error && (
        <div className="ocr-error">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {image && !loading && !error && text && (
        <section className="result-section">
          <div className="image-preview">
            <div className="result-title">
              <span>📷</span>
              <h2>Your uploaded note</h2>
            </div>

            <img src={image} alt="Uploaded note" />
          </div>

          <div className="text-result">
            <div className="result-title">
              <span>📝</span>
              <h2>Extracted text</h2>
            </div>

            <textarea value={text} readOnly />

            <div className="study-actions">
              <div>
                <p className="section-label">NEXT STEP</p>
                <h3>Create study material</h3>
              </div>

              <div className="action-buttons">
                <button onClick={generateSummary}>
                  <span>📖</span>
                  Summary
                </button>

                <button onClick={generateFlashcards}>
                  <span>🃏</span>
                  Flashcards
                </button>

                <button onClick={generateQuiz}>
                  <span>📝</span>
                  Quiz
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="study-output">
        {generatingSummary && (
          <div className="ai-result">
            <h2>📖 Creating your summary…</h2>
            <p>Please wait while your notes are being organized.</p>
          </div>
        )}

        {summary && (
          <div className="ai-result">
            <p className="section-label">STUDY SUMMARY</p>
            <h2>Key points from your notes</h2>
            <div className="summary-text">{summary}</div>
          </div>
        )}

        {generatingFlashcards && (
          <div className="ai-result">
            <h2>🃏 Creating your flashcards…</h2>
            <p>Making quick questions to help you revise.</p>
          </div>
        )}

        {Array.isArray(flashcards) && flashcards.length > 0 && (
          <div className="flashcards-container">
            <p className="section-label">FLASHCARDS</p>
            <h2>Practice one card at a time</h2>

            <p className="flashcard-counter">
              Card {currentFlashcard + 1} of {flashcards.length}
            </p>

            <div
              className="flashcard-single"
              onClick={flipFlashcard}
              role="button"
              tabIndex="0"
            >
              {!showAnswer ? (
                <div className="flashcard-face">
                  <span className="flashcard-label">QUESTION</span>
                  <h3>{flashcards[currentFlashcard].question}</h3>
                  <p className="flip-hint">Click the card to reveal the answer</p>
                </div>
              ) : (
                <div className="flashcard-face">
                  <span className="flashcard-label">ANSWER</span>
                  <p className="flashcard-answer-text">
                    {flashcards[currentFlashcard].answer}
                  </p>
                  <p className="flip-hint">Click the card to see the question</p>
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
                disabled={currentFlashcard === flashcards.length - 1}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {generatingQuiz && (
          <div className="ai-result">
            <h2>📝 Creating your quiz…</h2>
            <p>Preparing questions from your notes.</p>
          </div>
        )}

        {Array.isArray(quiz) &&
          quiz.length > 0 &&
          quiz[currentQuestion] &&
          Array.isArray(quiz[currentQuestion].options) &&
          !quizFinished && (
            <div className="interactive-quiz">
              <div className="quiz-header">
                <div>
                  <p className="section-label">QUICK QUIZ</p>
                  <h2>Test your understanding</h2>
                </div>

                <p>
                  {currentQuestion + 1} / {quiz.length}
                </p>
              </div>

              <h3>{quiz[currentQuestion].question}</h3>

              <div className="quiz-options">
                {quiz[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={
                      selectedAnswer === index
                        ? "quiz-option selected"
                        : "quiz-option"
                    }
                    onClick={() => selectAnswer(index)}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>
                    {option}
                  </button>
                ))}
              </div>

              <button
                className="next-question"
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
              >
                {currentQuestion === quiz.length - 1
                  ? "Finish quiz"
                  : "Next question →"}
              </button>
            </div>
          )}

        {quizFinished && Array.isArray(quiz) && quiz.length > 0 && (
          <div className="quiz-result">
            <div className="result-icon">🎉</div>
            <p className="section-label">QUIZ COMPLETE</p>
            <h2>Nice work!</h2>

            <div className="score">
              {score} / {quiz.length}
            </div>

            <p>
              You scored{" "}
              <strong>{Math.round((score / quiz.length) * 100)}%</strong>
            </p>

            <button className="next-question" onClick={restartQuiz}>
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

export default Notes;