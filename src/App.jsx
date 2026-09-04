import { useState } from "react";
import Dashboard from "./Dashboard";
import Notes from "./Notes";
import Signup from "./Signup";
import "./App.css";
import Revision from "./Revision";
import Tracker from "./Tracker";
import Tutor from "./Tutor";

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

  // Show Dashboard
  if (page === "dashboard") {
if (currentPage === "notes") {
  return (
    <Notes
      onBack={() => setCurrentPage("dashboard")}
    />
  );
}

if (currentPage === "revision") {
  return (
    <Revision
      onBack={() => setCurrentPage("dashboard")}
    />
  );
}

if (currentPage === "tracker") {
  return (
    <Tracker
      onBack={() => setCurrentPage("dashboard")}
    />
  );
}

if (currentPage === "tutor") {
  return (
    <Tutor
      onBack={() => setCurrentPage("dashboard")}
    />
  );
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

  // Show Signup
  if (page === "signup") {
    return (
      <Signup
        onSignup={handleSignup}
        onBack={() => setPage("login")}
      />
    );
  }

  // Show Login
  return (
    <div className="login-page">

      <div className="login-card">

        <div className="logo">📚</div>

        <h1>StudyFlow</h1>

        <p className="welcome">
          Welcome back!
        </p>

        <p className="subtitle">
          Learn smarter. Study better.
        </p>

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label>Password</label>

          <div className="password-box">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button
              type="button"
              className="show-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

          </div>

          <div className="login-options">

            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <span className="forgot">
              Forgot password?
            </span>

          </div>

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        <p className="signup">
          Don't have an account?
          <span onClick={() => setPage("signup")}>
            {" "}Sign up
          </span>
        </p>

      </div>

    </div>
  );
}

export default App;