import React, { useEffect, useState } from "react";
import axios from "axios";
import "./../styles.css";

const SessionList = ({ selectedSessions, setSelectedSessions }) => {
  const [sessions, setSessions] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/sessions/")
      .then((response) => setSessions(response.data))
      .catch((error) => console.error("Error fetching sessions:", error));
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  

  const findConflicts = (sessionToCheck, updatedSelectedSessions) => {
    return updatedSelectedSessions.filter(
      (s) =>
        sessionToCheck.id !== s.id &&
        sessionToCheck.start_time < s.end_time &&
        sessionToCheck.end_time > s.start_time
    );
  };

  const handleSelection = (session) => {
    const isSelected = selectedSessions.some((s) => s.id === session.id);
    let updatedSelectedSessions;

    if (isSelected) {
      updatedSelectedSessions = selectedSessions.filter((s) => s.id !== session.id);
    } else {
      updatedSelectedSessions = [...selectedSessions, session];
    }

    setSelectedSessions(updatedSelectedSessions);

    let newConflicts = [];
    updatedSelectedSessions.forEach((s) => {
      let sessionConflicts = findConflicts(s, updatedSelectedSessions);
      if (sessionConflicts.length > 0) {
        newConflicts.push(s, ...sessionConflicts);
      }
    });

    setConflicts([...new Set(newConflicts)]);
    setWarning(newConflicts.length > 0);
  };

  const closePopup = () => {
    setWarning(false);
  };

  return (
    <div>
      <h2>Select Sessions</h2>

      {/* Floating Pop-up Warning */}
      {warning && (
        <div className="popup-warning">
          ⚠️ <strong>Session conflicts detected!</strong>
          <button className="close-btn" onClick={closePopup}>X</button>
        </div>
      )}

<ul>
  {sessions.map((session) => {
    const isConflicting = conflicts.some((c) => c.id === session.id);
    return (
      <li key={session.id} className="session-item">
        <input
          type="checkbox"
          onChange={() => handleSelection(session)}
          checked={selectedSessions.some((s) => s.id === session.id)}
        />
        <span>
          {session.title} ({formatDate(session.start_time)} - {formatDate(session.end_time)})
        </span>
        {isConflicting && <span style={{ color: "red", marginLeft: "6px" }}>⚠️</span>}
      </li>
    );
  })}
</ul>

    </div>
  );
};

export default SessionList;
