"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Sun, Moon, ImageIcon, Link, Download, UploadCloud } from "lucide-react";

export default function Home() {
  const [imageURLs, setImageURLs] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [galleryURL, setGalleryURL] = useState<string>("");
  const [customURL, setCustomURL] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [darkMode, setDarkMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const CLOUD_NAME = "bae2g";
  const UPLOAD_PRESET = "qr_code";

  const generateGalleryHTML = (urls: string[]) => `
    <html>
      <head><title>Gallery</title></head>
      <body style="font-family:sans-serif;padding:20px;text-align:center;background:#fefefe;">
        <h1 style="color:#333;">Uploaded Images</h1>
        ${urls
          .map(
            (url) =>
              `<img src="${url}" style="max-width:90%;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,0.1);border-radius:8px;" />`
          )
          .join("")}
      </body>
    </html>
  `;

  const uploadHTMLGallery = async (urls: string[]) => {
    const htmlContent = generateGalleryHTML(urls);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const formData = new FormData();
    formData.append("file", blob, "gallery.html");
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "raw");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setGalleryURL(data.secure_url);
      }
    } catch (err) {
      console.error("Gallery upload failed:", err);
    }
  };

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadedFiles(files);
    setImageURLs([]);
    setGalleryURL("");

    const uploaded: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.secure_url) {
          uploaded.push(data.secure_url);
        }
      } catch (err) {
        console.error("Image upload error:", err);
      }
    }

    setImageURLs(uploaded);
    setUploading(false);

    if (uploaded.length > 0) {
      await uploadHTMLGallery(uploaded);
    }
  };

  const downloadQRCode = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qr-code.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const qrValue = activeTab === "upload" ? galleryURL : customURL;

  return (
    <main
      className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-gray-200"
          : "bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 text-gray-900"
      }`}
    >
      <div
        className={`max-w-xl w-full
          bg-white bg-opacity-30 dark:bg-gray-900 dark:bg-opacity-30
          backdrop-blur-md
          border border-white border-opacity-20 dark:border-gray-700 dark:border-opacity-40
          rounded-3xl shadow-lg
          p-8 flex flex-col items-center gap-8
          `}
      >
        {/* Top Bar: Dark/Light toggle */}
        <div className="self-end">
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark/light mode"
            title="Toggle dark/light mode"
            className={`p-2 rounded-full hover:scale-110 transform transition ${
              darkMode
                ? "bg-gray-700"
                : "bg-gray-300"
            }`}
          >
            {darkMode ? (
              <Sun className="text-yellow-400 w-6 h-6" />
            ) : (
              <Moon className="text-gray-700 w-6 h-6" />
            )}
          </button>
        </div>

        {/* Tab Buttons: Upload / URL */}
        <div className="flex gap-8 justify-center w-full">
          <button
            onClick={() => setActiveTab("upload")}
            aria-label="Upload images tab"
            title="Upload images"
            className={`p-4 rounded-2xl transition-transform transform hover:scale-110 ${
              activeTab === "upload"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            <UploadCloud size={28} />
          </button>

          <button
            onClick={() => setActiveTab("url")}
            aria-label="Custom URL tab"
            title="Enter custom URL"
            className={`p-4 rounded-2xl transition-transform transform hover:scale-110 ${
              activeTab === "url"
                ? "bg-gradient-to-r from-pink-500 to-red-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            }`}
          >
            <Link size={28} />
          </button>
        </div>

        {/* Content based on tab */}
        {activeTab === "upload" && (
          <div className="flex flex-col items-center gap-6 w-full">
            <label
              htmlFor="file-upload"
              aria-label="Choose images to upload"
              title="Choose images"
              className="cursor-pointer rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 p-5 hover:scale-105 transition-transform flex justify-center items-center shadow-lg"
            >
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="hidden"
              />
              <ImageIcon size={32} className="text-white" />
            </label>

            {uploading && (
              <p className="animate-pulse text-indigo-600 dark:text-indigo-400">Uploading...</p>
            )}

            {imageURLs.length > 0 && (
              <div className="grid grid-cols-3 gap-3 w-full max-h-48 overflow-y-auto rounded-xl p-1">
                {imageURLs.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Uploaded preview ${idx + 1}`}
                    className="rounded-xl shadow-lg object-cover w-full h-24"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "url" && (
          <input
            type="text"
            value={customURL}
            onChange={(e) => setCustomURL(e.target.value)}
            placeholder="Paste URL here"
            aria-label="Paste URL here"
            className="w-full px-5 py-3 rounded-2xl border-2 border-gray-300 dark:border-gray-700 bg-transparent placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-400 dark:focus:ring-indigo-600 transition"
          />
        )}

        {/* QR Code & Download */}
        {qrValue && (
          <div className="flex flex-col items-center gap-6">
            <QRCodeCanvas
              value={qrValue}
              size={220}
              bgColor={darkMode ? "#1e293b" : "#fefefe"}
              fgColor={darkMode ? "#fefefe" : "#1e293b"}
              level="H"
              includeMargin
              ref={qrRef}
              className="rounded-2xl shadow-2xl"
            />
            <button
              onClick={downloadQRCode}
              aria-label="Download QR code"
              title="Download QR code"
              className="p-4 rounded-full bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
            >
              <Download size={28} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
