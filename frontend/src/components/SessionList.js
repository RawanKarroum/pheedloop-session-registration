import React, { useEffect, useState } from "react";
import axios from "axios";

const SessionList = ({ selectedSessions, setSelectedSessions }) => {
  const [sessions, setSessions] = useState([]);
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/sessions/")
      .then((response) => setSessions(response.data))
      .catch((error) => console.error("Error fetching sessions:", error));
  }, []);

  // Function to find conflicts
  const findConflicts = (sessionToCheck, updatedSelectedSessions) => {
    return updatedSelectedSessions.filter(
      (s) => sessionToCheck.id !== s.id &&
        sessionToCheck.start_time < s.end_time &&
        sessionToCheck.end_time > s.start_time
    );
  };

  const handleSelection = (session) => {
    const isSelected = selectedSessions.some((s) => s.id === session.id);
    
    let updatedSelectedSessions;

    if (isSelected) {
      // If deselecting, remove session from selectedSessions
      updatedSelectedSessions = selectedSessions.filter((s) => s.id !== session.id);
    } else {
      // If selecting, add session to selectedSessions
      updatedSelectedSessions = [...selectedSessions, session];
    }

    setSelectedSessions(updatedSelectedSessions);

    // Recalculate conflicts based on new selection
    let newConflicts = [];
    updatedSelectedSessions.forEach((s) => {
      let sessionConflicts = findConflicts(s, updatedSelectedSessions);
      if (sessionConflicts.length > 0) {
        newConflicts.push(s, ...sessionConflicts);
      }
    });

    // Remove duplicates in conflicts
    setConflicts([...new Set(newConflicts)]);
  };

  return (
    <div>
      <h2>Select Sessions</h2>
      
      {conflicts.length > 0 && (
        <div style={{ backgroundColor: "#ffcccb", padding: "10px", borderRadius: "5px" }}>
          ⚠️ <b>Warning:</b> The following sessions are overlapping:
          <ul>
            {conflicts.map((c) => (
              <li key={c.id}>
                <b>{c.title}</b> ({c.start_time} - {c.end_time})
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul>
        {sessions.map((session) => {
          const isConflicting = conflicts.some((c) => c.id === session.id);
          
          return (
            <li key={session.id} style={{ 
              backgroundColor: isConflicting ? "#ffddcc" : "transparent", 
              padding: "5px", 
              borderRadius: "5px"
            }}>
              <input
                type="checkbox"
                onChange={() => handleSelection(session)}
                checked={selectedSessions.some((s) => s.id === session.id)}
              />
              {session.title} ({session.start_time} - {session.end_time})
              {isConflicting && (
                <span style={{ color: "red", marginLeft: "10px" }}>⚠️ Conflicting</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SessionList;
