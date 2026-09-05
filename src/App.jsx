import { useState } from "react";
import Dashboard from "./Dashboard";
import Notes from "./Notes";
import Signup from "./Signup";
import Revision from "./Revision";
import Tracker from "./Tracker";
import Tutor from "./Tutor";
import "./App.css";

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(event) {
    event.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    setUser(email.split("@")[0]);
    setPage("dashboard");
  }

  function handleSignup(name) {
    setUser(name);
    setPage("dashboard");
  }

  if (page === "dashboard") {
    if (currentPage === "notes") {
      return <Notes onBack={() => setCurrentPage("dashboard")} />;
    }

    if (currentPage === "revision") {
      return <Revision onBack={() => setCurrentPage("dashboard")} />;
    }

    if (currentPage === "tracker") {
      return <Tracker onBack={() => setCurrentPage("dashboard")} />;
    }

    if (currentPage === "tutor") {
      return <Tutor onBack={() => setCurrentPage("dashboard")} />;
    }

    return (
      <Dashboard
        user={user}
        onOpenNotes={() => setCurrentPage("notes")}
        onOpenRevision={() => setCurrentPage("revision")}
        onOpenTracker={() => setCurrentPage("tracker")}
        onOpenTutor={() => setCurrentPage("tutor")}
      />
    );
  }

  if (page === "signup") {
    return (
      <Signup
        onSignup={handleSignup}
        onBack={() => setPage("login")}
      />
    );
  }

  return (
    <div className="login-page">
      <main className="login-layout">
        <section className="login-intro">
          <div className="intro-brand">
            <span className="intro-logo">📚</span>
            <span>StudyFlow</span>
          </div>

          <div className="intro-content">
            <p className="intro-tag">STUDY WITH A PLAN</p>

            <h1>
              Make every
              <br />
              study session count.
            </h1>

            <p className="intro-description">
              Keep your notes, revision, exams and study goals together in one
              simple space.
            </p>

            <div className="intro-features">
              <div className="intro-feature">
                <span>✓</span>
                <p>
                  <strong>Smart Notes</strong>
                  Turn handwritten notes into study material.
                </p>
              </div>

              <div className="intro-feature">
                <span>✓</span>
                <p>
                  <strong>Exam Tracker</strong>
                  Stay prepared with a clear revision plan.
                </p>
              </div>

              <div className="intro-feature">
                <span>✓</span>
                <p>
                  <strong>AI Tutor</strong>
                  Get quick, simple help when you are stuck.
                </p>
              </div>
            </div>
          </div>

          <p className="intro-footer">Built for focused students.</p>
        </section>

        <section className="login-panel">
          <div className="login-card">
            <div className="mobile-brand">
              <span>📚</span>
              StudyFlow
            </div>

            <p className="form-eyebrow">WELCOME BACK</p>
            <h2>Sign in to continue</h2>
            <p className="subtitle">
              Pick up where you left off with your study plan.
            </p>

            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <label htmlFor="password">Password</label>
              <div className="password-box">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <button
                  type="button"
                  className="show-password"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="login-options">
                <label className="remember">
                  <input type="checkbox" />
                  Remember me
                </label>

                <button type="button" className="forgot">
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="login-button">
                Sign in <span>→</span>
              </button>
            </form>

            <div className="signup-divider">
              <span />
              <p>New to StudyFlow?</p>
              <span />
            </div>

            <button
              type="button"
              className="create-account-button"
              onClick={() => setPage("signup")}
            >
              Create an account
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;