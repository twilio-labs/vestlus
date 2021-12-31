import React from "react";

export default function Spacer({ size = 2 }) {
  const height = `${size}rem`;

  return <div style={{ height: height, minHeight: height }} />;
}
