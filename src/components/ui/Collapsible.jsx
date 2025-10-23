import React, { useState } from "react";

export function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          color: "#A24A17",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {title}
      </button>
      {open && <div style={{ marginTop: 8 }}>{children}</div>}
    </div>
  );
}
