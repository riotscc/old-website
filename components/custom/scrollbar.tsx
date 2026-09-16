"use client";

import { useEffect } from "react";

export default function CustomScrollbar() {
  useEffect(() => {
    const id = "custom-scrollbar-styles";

    if (document.getElementById(id)) {
      return;
    }

    const style = document.createElement("style");

    style.id = id;
    style.textContent = `
      html {
        scrollbar-width: thin;
        scrollbar-color: #2832F9 #080808;
      }

      * {
        scrollbar-width: thin;
        scrollbar-color: #2832F9 transparent;
      }

      *::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      *::-webkit-scrollbar-track {
        background: transparent;
      }

      html::-webkit-scrollbar-track,
      body::-webkit-scrollbar-track {
        background: #080808;
      }

      *::-webkit-scrollbar-thumb {
        background: #2832F9;
        border: 2px solid transparent;
        border-radius: 999px;
        background-clip: padding-box;
      }

      *::-webkit-scrollbar-thumb:hover {
        background: #3540ff;
        border: 2px solid transparent;
        background-clip: padding-box;
      }

      *::-webkit-scrollbar-thumb:active {
        background: #4650ff;
        border: 2px solid transparent;
        background-clip: padding-box;
      }

      *::-webkit-scrollbar-corner {
        background: transparent;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return null;
}