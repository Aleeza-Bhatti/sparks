import React from "react";

export function Avatar({ src, alt, size = 40 }) {
  return (
    <img
      src={src}
      alt={alt || "Avatar"}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  );
}
