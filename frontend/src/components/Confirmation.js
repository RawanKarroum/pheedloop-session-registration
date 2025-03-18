import React from "react";

const Confirmation = ({ message }) => {
  return (
    <div>
      <h2>Registration Status</h2>
      <p>{message}</p>
    </div>
  );
};

export default Confirmation;
