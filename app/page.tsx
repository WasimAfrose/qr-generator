'use client'; // <-- MUST be the very first line!

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Home() {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(200);
  const [showQR, setShowQR] = useState(false);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">QR Code Generator</h1>

      <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full space-y-4">
        <input
          type="text"
          placeholder="Enter text or URL"
          className="w-full p-2 border rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <label className="text-sm">Size:</label>
          <input
            type="number"
            className="w-24 p-2 border rounded"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </div>

        <button
          onClick={() => setShowQR(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Generate QR
        </button>

        {showQR && (
          <div className="flex justify-center pt-4">
            <QRCodeSVG value={text} size={size} />
          </div>
        )}
      </div>
    </main>
  );
}
