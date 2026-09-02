import { useState, useEffect } from "react";
import "./Tracker.css";

function Tracker({ onBack }) {
      const [showAddExam, setShowAddExam] = useState(false);
      const [newSubject, setNewSubject] = useState("");
      const [newExamDate, setNewExamDate] = useState("");
      const [newPortion, setNewPortion] = useState("");
      const [newPortions, setNewPortions] = useState([]);
      const [subjects, setSubjects] = useState(() => {
      const savedSubjects = localStorage.getItem("studyflowSubjects");

  if (savedSubjects) {
    return JSON.parse(savedSubjects);
  }
    return[
        {
      name: "Mathematics",
      examDate: "2026-09-15",
      portions: [
        { name: "Real Numbers", completed: true },
        { name: "Polynomials", completed: true },
        { name: "Linear Equations", completed: true },
        { name: "Quadratic Equations", completed: false },
        { name: "Statistics", completed: false },
      ],
    },
    {
      name: "Physics",
      examDate: "2026-09-18",
      portions: [
        { name: "Motion", completed: true },
        { name: "Force", completed: false },
        { name: "Energy", completed: false },
      ],
    },
  ]
});


  useEffect(() => {
  localStorage.setItem(
    "studyflowSubjects",
    JSON.stringify(subjects)
  );
}, [subjects]);

  function togglePortion(subjectIndex, portionIndex) {
    setSubjects((previousSubjects) => {
      const updatedSubjects = [...previousSubjects];

      updatedSubjects[subjectIndex] = {
        ...updatedSubjects[subjectIndex],
        portions: updatedSubjects[subjectIndex].portions.map(
          (portion, index) =>
            index === portionIndex
              ? {
                  ...portion,
                  completed: !portion.completed,
                }
              : portion
        ),
      };

      return updatedSubjects;
    });
  }

  function getDaysRemaining(examDate) {
    const today = new Date();
    const exam = new Date(examDate);

    today.setHours(0, 0, 0, 0);
    exam.setHours(0, 0, 0, 0);

    const difference =
      exam.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  function getProgress(portions) {
    if (portions.length === 0) {
      return 0;
    }

    const completed = portions.filter(
      (portion) => portion.completed
    ).length;

    return Math.round(
      (completed / portions.length) * 100
    );
  }

  function getNextExam() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingExams = subjects
    .filter((subject) => {
      const examDate = new Date(subject.examDate);
      examDate.setHours(0, 0, 0, 0);

      return examDate >= today;
    })
    .sort(
      (a, b) =>
        new Date(a.examDate) - new Date(b.examDate)
    );

  return upcomingExams.length > 0
    ? upcomingExams[0]
    : null;
}
const nextExam = getNextExam();

  return (
    <div className="tracker-page">

      <div className="tracker-header">

  <div>
    <button
      className="back-button"
      onClick={onBack}
    >
      ← Dashboard
    </button>

    <h1>📅 Exam Tracker</h1>

    <p>
      Track your exams and stay on top of
      your portions.
    </p>
  </div>

  <button
    className="add-exam-button"
    onClick={() => setShowAddExam(true)}
  >
    ➕ Add Exam
  </button>

</div>
      {nextExam && (
  <div className="next-exam-card">

    <div>
      <span className="next-exam-label">
        🎯 YOUR NEXT EXAM
      </span>

      <h2>{nextExam.name}</h2>

      <p>
        📅{" "}
        {new Date(
          nextExam.examDate
        ).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>

    <div className="next-exam-days">
      <strong>
        {getDaysRemaining(nextExam.examDate)}
      </strong>

      <span>days left</span>
    </div>

  </div>
)}
      {showAddExam && (
  <div className="add-exam-form">

    <h2>➕ Add Exam</h2>

    <label>Subject</label>

    <input
      type="text"
      placeholder="e.g. Mathematics"
      value={newSubject}
      onChange={(event) =>
        setNewSubject(event.target.value)
      }
    />

    <label>Exam Date</label>

    <input
      type="date"
      value={newExamDate}
      onChange={(event) =>
        setNewExamDate(event.target.value)
      }
    />

    <label>Portions</label>

    <div className="portion-input">
      <input
        type="text"
        placeholder="e.g. Real Numbers"
        value={newPortion}
        onChange={(event) =>
          setNewPortion(event.target.value)
        }
      />

      <button
        type="button"
        onClick={() => {
          if (newPortion.trim()) {
            setNewPortions([
              ...newPortions,
              newPortion.trim(),
            ]);

            setNewPortion("");
          }
        }}
      >
        + Add
      </button>
    </div>

    {newPortions.length > 0 && (
      <div className="new-portions">

        {newPortions.map((portion, index) => (
          <div key={index}>
            📚 {portion}
          </div>
        ))}

      </div>
    )}

    <div className="form-buttons">

      <button
        type="button"
        onClick={() => setShowAddExam(false)}
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={() => {
          if (!newSubject || !newExamDate) {
            alert("Please enter subject and exam date.");
            return;
          }

          setSubjects([
            ...subjects,
            {
              name: newSubject,
              examDate: newExamDate,
              portions: newPortions.map((portion) => ({
                name: portion,
                completed: false,
              })),
            },
          ]);

          setNewSubject("");
          setNewExamDate("");
          setNewPortion("");
          setNewPortions([]);
          setShowAddExam(false);
        }}
      >
        Add Exam
      </button>

    </div>

  </div>
)}
      <div className="timetable-section">

  <h2>🗓️ My Exam Timetable</h2>

  <div className="timetable-list">
    {[...subjects]
      .sort(
        (a, b) =>
          new Date(a.examDate) - new Date(b.examDate)
      )
      .map((subject) => (
        <div
          className="timetable-item"
          key={subject.name}
        >
          <div className="timetable-date">
            <strong>
              {new Date(subject.examDate).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                }
              )}
            </strong>
          </div>

          <div className="timetable-subject">
            📚 {subject.name}
          </div>
        </div>
      ))}
  </div>

</div>
      <div className="subjects-list">

        {subjects.map((subject, subjectIndex) => {

          const daysRemaining =
            getDaysRemaining(subject.examDate);

          const progress =
            getProgress(subject.portions);

          const completedCount =
            subject.portions.filter(
              (portion) => portion.completed
            ).length;

          return (
            <div
              className="subject-card"
              key={subject.name}
            >

              <div className="subject-top">

                <div>
                  <h2>{subject.name}</h2>

                  <p>
                    📅 Exam:{" "}
                    {new Date(
                      subject.examDate
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="days-left">
                  <strong>
                    {daysRemaining}
                  </strong>

                  <span>
                    days left
                  </span>
                </div>

              </div>

              <div className="progress-section">

                <div className="progress-info">
                  <span>
                    Portion Progress
                  </span>

                  <strong>
                    {progress}%
                  </strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>

                <p>
                  {completedCount} /{" "}
                  {subject.portions.length}{" "}
                  portions completed
                </p>

              </div>

              <div className="portions">

                <h3>📚 Portions</h3>

                {subject.portions.map(
                  (portion, portionIndex) => (

                    <label
                      className="portion-item"
                      key={portion.name}
                    >

                      <input
                        type="checkbox"
                        checked={portion.completed}
                        onChange={() =>
                          togglePortion(
                            subjectIndex,
                            portionIndex
                          )
                        }
                      />

                      <span
                        className={
                          portion.completed
                            ? "completed"
                            : ""
                        }
                      >
                        {portion.name}
                      </span>

                    </label>

                  )
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default Tracker;