import "./Dashboard.css";

function Dashboard({
  user,
  onOpenNotes,
  onOpenRevision,
  onOpenTracker,
}) {
  return (
    <div className="dashboard">

      <header className="topbar">

        <div className="brand">
          📚 StudyFlow
        </div>

        <nav>
          <button onClick={onOpenNotes}>
            📚 Notes
          </button>

          <button onClick={onOpenRevision}>
            🧠 Revision
          </button>

          <button onClick={onOpenTracker}>
            📊 Tracker
          </button>

          <button>
            🤖 AI Tutor
          </button>
        </nav>

        <div className="profile">
          👋 Hi, {user}
        </div>

      </header>

      <main className="dashboard-content">

        <section className="welcome-section">
          <h1>Good morning, {user}! 👋</h1>

          <p>
            Ready to learn something new today?
          </p>
        </section>

        <section className="stats">

          <div className="stat-card">
            <span>📚</span>
            <h2>0</h2>
            <p>Topics Learned</p>
          </div>

          <div className="stat-card">
            <span>🎯</span>
            <h2>0%</h2>
            <p>Overall Progress</p>
          </div>

          <div className="stat-card">
            <span>🔥</span>
            <h2>0</h2>
            <p>Day Streak</p>
          </div>

        </section>

        <section className="today-card">

          <h2>🎯 Today's Mission</h2>

          <p>
            Start studying to get your personalized
            recommendations!
          </p>

          <button onClick={onOpenNotes}>
            Start Studying
          </button>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;