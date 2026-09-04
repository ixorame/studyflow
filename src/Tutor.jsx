import { useState } from "react";
import "./Tutor.css";

function Tutor({ onBack }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askTutor() {
    if (!question.trim()) {
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        "https://studyflow-fxwq.onrender.com/api/tutor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Tutor request failed."
        );
      }

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);

      setAnswer(
        "Sorry, I couldn't answer that right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tutor-page">

      <button
        className="back-button"
        onClick={onBack}
      >
        ← Dashboard
      </button>

      <div className="tutor-header">
        <div className="tutor-icon">🤖</div>

        <h1>AI Tutor</h1>

        <p>
          Ask me anything you're learning!
        </p>
      </div>

      <div className="tutor-card">

        <label>
          💬 What would you like to learn?
        </label>

        <textarea
          placeholder="For example: Explain photosynthesis in simple words..."
          value={question}
          onChange={(event) =>
            setQuestion(event.target.value)
          }
          rows="5"
        />

        <button
          className="ask-tutor-button"
          onClick={askTutor}
          disabled={loading}
        >
          {loading ? "🤔 Thinking..." : "✨ Ask AI Tutor"}
        </button>

      </div>

      {answer && (
        <div className="tutor-answer">

          <div className="answer-header">
            <span>🤖</span>
            <h2>AI Tutor</h2>
          </div>

          <div className="answer-content">
            {answer}
          </div>

        </div>
      )}

      <div className="tutor-examples">

        <h3>💡 Try asking:</h3>

        <button
          onClick={() =>
            setQuestion(
              "Explain photosynthesis in simple words."
            )
          }
        >
          🌱 Explain photosynthesis
        </button>

        <button
          onClick={() =>
            setQuestion(
              "What is Newton's first law of motion?"
            )
          }
        >
          ⚡ Explain Newton's first law
        </button>

        <button
          onClick={() =>
            setQuestion(
              "How do I solve a quadratic equation?"
            )
          }
        >
          📐 Help with quadratic equations
        </button>

      </div>

    </div>
  );
}

export default Tutor;