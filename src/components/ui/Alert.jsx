import React from "react";

export function Alert({ variant = "default", title, children }) {
  const colors = {
    default: { background: "#f7f7f7", border: "#ddd", color: "#000" },
    destructive: { background: "#ffeaea", border: "#ffaaaa", color: "#a00" },
  };

  const style = {
    border: `1px solid ${colors[variant].border}`,
    background: colors[variant].background,
    color: colors[variant].color,
    borderRadius: 8,
    padding: "12px 16px",
    marginBottom: 12,
  };

  return (
    <div style={style}>
      {title && <strong style={{ display: "block", marginBottom: 4 }}>{title}</strong>}
      {children}
    </div>
  );
}
