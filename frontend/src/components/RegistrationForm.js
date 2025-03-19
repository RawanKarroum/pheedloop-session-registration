import React, { useState } from "react";
import axios from "axios";
import SessionList from "./SessionList";
import "./../styles.css";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const checkConflicts = (sessions) => {
    for (let i = 0; i < sessions.length; i++) {
      for (let j = i + 1; j < sessions.length; j++) {
        const session1 = sessions[i];
        const session2 = sessions[j];

        if (
          new Date(session1.start_time) < new Date(session2.end_time) &&
          new Date(session1.end_time) > new Date(session2.start_time)
        ) {
          return "Cannot process registration due to session conflicts.";
        }
      }
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for session conflicts
    const conflictMessage = checkConflicts(selectedSessions);
    if (conflictMessage) {
      setError(conflictMessage);
      return;
    }

    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }

    const payload = {
      name,
      email,
      job_title: jobTitle,
      sessions: selectedSessions.map((s) => s.id),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register-attendee/",
        payload
      );

      setMessage(response.data.message);
      setError("");

      // Reset form fields after successful submission
      setName("");
      setEmail("");
      setJobTitle("");
      setSelectedSessions([]);

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Registration Error:", error.response?.data);
      setError(error.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div>
      {/* Floating Pop-up Warning for Errors */}
      {error && (
        <div className="popup-warning">
          ⚠️ <strong>Warning:</strong> {error}
          <button className="close-btn" onClick={() => setError("")}>X</button>
        </div>
      )}

      {/* Floating Pop-up for Success Messages */}
      {message && (
        <div className="popup-success">
            ✅ <strong>Registration Successful!</strong>
            <button className="close-btn-success" onClick={() => setMessage("")}>X</button>
        </div>
        )}

      <h2>Register for Sessions</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>

        <SessionList selectedSessions={selectedSessions} setSelectedSessions={setSelectedSessions} />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
