import "./Revision.css";

function Revision() {
  return (
    <div className="revision-page">

      <div className="revision-header">
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
            0
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
            0
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

          <p className="study-next-text">
            Upload your notes to get started.
          </p>
        </div>

      </div>

      <div className="topics-section">

        <h2>📖 Your Topics</h2>

        <div className="empty-revision">
          <div>📚</div>

          <h3>No topics yet</h3>

          <p>
            Your studied topics will appear here.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Revision;
