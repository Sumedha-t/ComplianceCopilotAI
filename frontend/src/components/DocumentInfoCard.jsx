import { FileText } from "lucide-react";

function DocumentInfoCard({ selectedFile, analysisResult }) {
  if (!selectedFile) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 p-2 rounded-xl">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>

          <h2 className="text-lg font-semibold text-gray-700">
            Document Information
          </h2>
        </div>

        <p className="mt-4 text-gray-500">
          Upload a document to view its details.
        </p>
      </div>
    );
  }

  const fileExtension =
    selectedFile.name.split(".").pop()?.toUpperCase() || "Unknown";

  const fileSizeMB = (
    selectedFile.size /
    (1024 * 1024)
  ).toFixed(2);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-50 p-2 rounded-xl">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>

        <h2 className="text-lg font-semibold text-gray-700">
          Document Information
        </h2>
      </div>

      {/* File Information */}
      <div className="mt-6 space-y-4">

        <div>
          <p className="text-xs text-gray-400">
            Filename
          </p>

          <p className="font-medium text-gray-800 mt-1 break-all">
            {selectedFile.name}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="text-xs text-gray-400">
              File Type
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {fileExtension}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-400">
              File Size
            </p>

            <p className="font-medium text-gray-800 mt-1">
              {fileSizeMB} MB
            </p>
          </div>

        </div>

        <div>
          <p className="text-xs text-gray-400">
            Analysis Status
          </p>

          <div className="mt-1">
            {analysisResult ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Analysis Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-500">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                Ready for Analysis
              </span>
            )}
          </div>
        </div>

        {analysisResult && (
          <div>
            <p className="text-xs text-gray-400">
              Compliance Status
            </p>

            <p className="font-medium text-green-600 mt-1">
              {analysisResult.status}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default DocumentInfoCard;