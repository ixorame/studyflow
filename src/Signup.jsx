import { useState } from "react";
import "./Signup.css";

function Signup({ onSignup, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSignup(event) {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const user = {
      name,
      email,
      password,
    };

    localStorage.setItem("studyflowUser", JSON.stringify(user));

    onSignup(name);
  }

  return (
    <div className="signup-page">

      <div className="signup-card">

        <div className="logo">📚</div>

        <h1>Create your account</h1>

        <p className="subtitle">
          Start your StudyFlow journey 🚀
        </p>

        <form onSubmit={handleSignup}>

          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
          />

          <button type="submit" className="signup-button">
            Create Account
          </button>

        </form>

        <p className="back-login" onClick={onBack}>
          ← Back to Login
        </p>

      </div>

    </div>
  );
}

export default Signup;