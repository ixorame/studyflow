import "./Dashboard.css";

function Dashboard({
  user,
  onOpenNotes,
  onOpenRevision,
  onOpenTracker,
  onOpenTutor,
}) {
  return (
    <div className="dashboard">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">📚</span>
          <span>StudyFlow</span>
        </div>

        <nav className="main-nav">
          <button onClick={onOpenNotes}>Notes</button>
          <button onClick={onOpenRevision}>Revision</button>
          <button onClick={onOpenTracker}>Tracker</button>
          <button onClick={onOpenTutor}>Tutor</button>
        </nav>

        <div className="profile">
          <span className="profile-avatar">
            {user ? user.charAt(0).toUpperCase() : "S"}
          </span>
          <span>Hi, {user}</span>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <div>
            <p className="section-label">YOUR STUDY SPACE</p>
            <h1>Good morning, {user}! <span>👋</span></h1>
            <p>Choose one small goal and make progress today.</p>
          </div>

          <button className="primary-action" onClick={onOpenNotes}>
            Start studying <span>→</span>
          </button>
        </section>

        <section className="stats">
          <article className="stat-card">
            <div className="stat-icon notes-icon">📚</div>
            <div>
              <p>Topics learned</p>
              <h2>0</h2>
              <span className="stat-note">Start with your first note</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon progress-icon">🎯</div>
            <div>
              <p>Overall progress</p>
              <h2>0%</h2>
              <span className="stat-note">Your journey starts today</span>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon streak-icon">🔥</div>
            <div>
              <p>Study streak</p>
              <h2>0 days</h2>
              <span className="stat-note">Come back tomorrow to build it</span>
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="today-card">
            <div className="card-heading">
              <div>
                <p className="section-label">TODAY'S MISSION</p>
                <h2>Make a strong start</h2>
              </div>
              <span className="mission-icon">🎯</span>
            </div>

            <p className="mission-description">
              Upload a page of your notes, then turn it into a summary,
              flashcards, or a quiz.
            </p>

            <div className="mission-steps">
              <div className="mission-step">
                <span>1</span>
                <p>Upload your notes</p>
              </div>
              <div className="mission-step">
                <span>2</span>
                <p>Create study material</p>
              </div>
              <div className="mission-step">
                <span>3</span>
                <p>Review and improve</p>
              </div>
            </div>

            <button className="primary-action" onClick={onOpenNotes}>
              Open Smart Notes <span>→</span>
            </button>
          </article>

          <aside className="quick-tools">
            <p className="section-label">QUICK TOOLS</p>
            <h2>What do you want to do?</h2>

            <button className="tool-button" onClick={onOpenNotes}>
              <span className="tool-icon">📷</span>
              <span>
                <strong>Smart Notes</strong>
                <small>Upload and study notes</small>
              </span>
              <b>→</b>
            </button>

            <button className="tool-button" onClick={onOpenRevision}>
              <span className="tool-icon">🧠</span>
              <span>
                <strong>Revision</strong>
                <small>Plan your revision</small>
              </span>
              <b>→</b>
            </button>

            <button className="tool-button" onClick={onOpenTracker}>
              <span className="tool-icon">📊</span>
              <span>
                <strong>Exam Tracker</strong>
                <small>Track subjects and exams</small>
              </span>
              <b>→</b>
            </button>

            <button className="tool-button" onClick={onOpenTutor}>
              <span className="tool-icon">💬</span>
              <span>
                <strong>Study Tutor</strong>
                <small>Ask a question anytime</small>
              </span>
              <b>→</b>
            </button>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;