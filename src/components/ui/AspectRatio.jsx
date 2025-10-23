import React from "react";

export function AspectRatio({ ratio = 1, children }) {
  const paddingBottom = `${100 / ratio}%`;
  return (
    <div style={{ position: "relative", width: "100%", paddingBottom }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        {children}
      </div>
    </div>
  );
}
