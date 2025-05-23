"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  const [text, setText] = useState("");
  const qrRef = useRef<HTMLCanvasElement>(null);

  const downloadQRCode = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">QR Code Generator</h1>

      <input
        type="text"
        placeholder="Enter text or URL"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 mb-6"
      />

      {text && (
        <div className="flex flex-col items-center">
          <QRCodeCanvas
            value={text}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin
            ref={qrRef}
          />

          <button
            onClick={downloadQRCode}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Download QR Code
          </button>
        </div>
      )}
    </main>
  );
}
