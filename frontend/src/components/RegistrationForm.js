import React, { useState } from "react";
import axios from "axios";
import SessionList from "./SessionList";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
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
      <h2>Register for Sessions</h2>
      
      {error && (
        <div style={{ backgroundColor: "#ffcccb", padding: "10px", borderRadius: "5px", color: "red" }}>
          ❌ <b>Error:</b> {error}
        </div>
      )}

      {message && (
        <div style={{ backgroundColor: "#ccffcc", padding: "10px", borderRadius: "5px", color: "green" }}>
          ✅ <b>Success:</b> {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
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

        <SessionList
          selectedSessions={selectedSessions}
          setSelectedSessions={setSelectedSessions}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
