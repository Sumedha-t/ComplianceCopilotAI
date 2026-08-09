import { useState } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
} from "lucide-react";

function UploadBox({
  selectedFile,
  setSelectedFile,
  onAnalyze,
  isLoading,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;

    const fileName = file.name.toLowerCase();

    const isValid =
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx");

    if (!isValid) {
      alert("Please select a PDF, DOC, or DOCX file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];

    if (file) {
      handleFileSelect(file);
    }
  };

  const fileSize = selectedFile
    ? (selectedFile.size / (1024 * 1024)).toFixed(2)
    : "0.00";

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-50 p-2 rounded-xl">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Upload Compliance Document
          </h2>

          <p className="text-sm text-gray-500 mt-1">
  Select a PDF or Word document to begin.
</p>
        </div>
      </div>

      {/* Drag and Drop Area */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`mt-6 border-2 border-dashed rounded-2xl p-10 text-center transition ${
          isDragging
            ? "border-blue-500 bg-blue-100"
            : "border-blue-200 bg-blue-50/50 hover:bg-blue-50"
        }`}
      >

        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-full shadow-sm">
            <UploadCloud className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <p className="mt-5 text-lg font-medium text-gray-700">
          {isDragging
            ? "Drop your document here!"
            : "Drop your document here"}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          or choose a file from your computer
        </p>

        <label className="inline-block mt-5">
          <span className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition">
            Browse Files
          </span>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(event) => {
              handleFileSelect(event.target.files[0]);
            }}
            className="hidden"
          />
        </label>

        <p className="mt-4 text-xs text-gray-400">
          Supported formats: PDF, DOC, DOCX
        </p>
      </div>

      {/* Selected File */}
      {selectedFile && (
        <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">

          {/* File Information */}
          <div className="flex items-start gap-3 min-w-0">

            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />

            <div className="min-w-0 flex-1">

              <p
                className="font-medium text-gray-800 break-all"
                title={selectedFile.name}
              >
                {selectedFile.name}
              </p>

              <p className="text-xs text-green-700 mt-1">
                {selectedFile.type || "Document"} • {fileSize} MB
              </p>

            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 mt-4">

            <button
              onClick={() => setSelectedFile(null)}
              disabled={isLoading}
              className="p-2.5 rounded-lg bg-blue-800 text-white hover:bg-blue-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-lg font-medium text-white transition ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-800 hover:bg-blue-900"
              }`}
            >
              {isLoading ? "Analyzing..." : "Analyze Document"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default UploadBox;