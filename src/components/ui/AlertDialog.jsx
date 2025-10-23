import React, { useState } from "react";

export function AlertDialog({ triggerText, title, description }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>{triggerText}</button>
      {open && (
        <div style={overlay}>
          <div style={dialog}>
            <h3>{title}</h3>
            <p>{description}</p>
            <div style={{ marginTop: 20, textAlign: "right" }}>
              <button onClick={() => setOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const dialog = {
  background: "#fff",
  borderRadius: 8,
  padding: 20,
  width: "90%",
  maxWidth: 400,
};
