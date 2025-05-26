"use client";

import React, { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [isDark, setIsDark] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  // Toggle dark mode class on body
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Generate QR code from URL
  function generateQR() {
    if (inputUrl.trim()) {
      setQrValue(inputUrl.trim());
    }
  }

  // Download QR code as PNG
  function downloadQR() {
    if (!qrRef.current) return;
    const canvas = qrRef.current;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-12 transition-colors duration-500
      bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-700`}
    >
      <div
        className="relative max-w-lg w-full bg-white/30 dark:bg-gray-900/30
        backdrop-blur-xl rounded-3xl p-8 shadow-xl flex flex-col items-center"
      >
        {/* Dark/Light mode toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
          className="absolute top-5 right-5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md p-3 rounded-full shadow-md hover:bg-indigo-600 hover:text-white transition z-10"
        >
          {isDark ? (
            // Sun icon for light mode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m8.485-9H21m-16 0H3m13.657 6.657l.707.707m-9.9-9.9l.707.707m12.02 0l-.707.707m-9.9 9.9l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z"
              />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
              />
            </svg>
          )}
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100 select-none">
          QR Code Generator
        </h1>

        {/* Input and generate */}
        <div className="w-full relative mb-8">
          <input
            type="url"
            placeholder="Paste URL here"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full rounded-full py-4 px-5 pr-20 text-gray-900 dark:text-gray-100 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition"
            spellCheck={false}
          />
          <button
            onClick={generateQR}
            disabled={!inputUrl.trim()}
            aria-label="Generate QR Code"
            title="Generate QR Code"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full shadow-md transition flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* QR code display */}
        {qrValue && (
          <div className="flex flex-col items-center space-y-6">
            <QRCodeCanvas
              ref={qrRef}
              value={qrValue}
              size={240}
              bgColor="transparent"
              fgColor={isDark ? "#e0e7ff" : "#3730a3"}
              level="H"
              includeMargin={true}
              className="rounded-3xl shadow-lg"
            />

            <button
              onClick={downloadQR}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full shadow-lg transition"
              aria-label="Download QR Code"
              title="Download QR Code"
            >
              {/* Download icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
