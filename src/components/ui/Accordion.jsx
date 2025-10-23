import React, { useState } from "react";

export function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} style={{ borderBottom: "1px solid #ddd" }}>
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            style={{
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              padding: "12px 0",
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            {item.title}
          </button>
          {openIndex === index && (
            <div style={{ padding: "8px 0", color: "#444" }}>{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
