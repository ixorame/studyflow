import { useState } from "react";
import "./Revision.css";

function Revision({ onBack }) {
  const [subjects] = useState(() => {
    const savedSubjects = localStorage.getItem("studyflowSubjects");

    if (savedSubjects) {
      return JSON.parse(savedSubjects);
    }

    return [];
  });

  const allTopics = subjects.flatMap((subject) =>
    subject.portions.map((portion) => ({
      ...portion,
      subject: subject.name,
      examDate: subject.examDate,
    }))
  );

  const studiedTopics = allTopics.filter(
    (topic) => topic.completed
  );

  const topicsToRevise = allTopics.filter(
    (topic) => !topic.completed
  );

  const studyNext = topicsToRevise.length > 0
    ? topicsToRevise[0]
    : null;

  return (
    <div className="revision-page">

      <div className="revision-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          ← Dashboard
        </button>

        <h1>🧠 My Revision</h1>

        <p>
          Keep track of what you have studied and
          what you should revise next.
        </p>

      </div>

      <div className="revision-grid">

        <div className="revision-card">
          <div className="revision-icon">
            📚
          </div>

          <h2>Topics Studied</h2>

          <p className="revision-number">
            {studiedTopics.length}
          </p>

          <p>
            topics completed
          </p>
        </div>

        <div className="revision-card">
          <div className="revision-icon">
            ⚠️
          </div>

          <h2>Needs Revision</h2>

          <p className="revision-number">
            {topicsToRevise.length}
          </p>

          <p>
            topics to revise
          </p>
        </div>

        <div className="revision-card">
          <div className="revision-icon">
            🎯
          </div>

          <h2>Study Next</h2>

          {studyNext ? (
            <>
              <p className="study-next-text">
                {studyNext.name}
              </p>

              <small>
                {studyNext.subject}
              </small>
            </>
          ) : (
            <p className="study-next-text">
              🎉 All topics completed!
            </p>
          )}

        </div>

      </div>

      <div className="topics-section">

        <h2>📖 Your Topics</h2>

        {subjects.length === 0 ? (

          <div className="empty-revision">
            <div>📚</div>

            <h3>No topics yet</h3>

            <p>
              Add exams and portions in the Exam
              Tracker to see them here.
            </p>
          </div>

        ) : (

          <div className="revision-topics-list">

            {subjects.map((subject) => (

              <div
                className="revision-subject"
                key={subject.name}
              >

                <div className="revision-subject-header">
                  <h3>📚 {subject.name}</h3>

                  <span>
                    {subject.portions.filter(
                      (portion) => portion.completed
                    ).length}
                    /
                    {subject.portions.length}
                  </span>
                </div>

                <div className="revision-portions">

                  {subject.portions.map((portion) => (

                    <div
                      className={`revision-topic ${
                        portion.completed
                          ? "topic-completed"
                          : "topic-pending"
                      }`}
                      key={portion.name}
                    >

                      <span>
                        {portion.completed
                          ? "✅"
                          : "⚠️"}
                      </span>

                      <span>
                        {portion.name}
                      </span>

                      <span className="topic-status">
                        {portion.completed
                          ? "Studied"
                          : "Needs revision"}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Revision;