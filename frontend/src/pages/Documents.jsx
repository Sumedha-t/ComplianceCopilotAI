import { useState } from "react";
import {
  FileText,
  UploadCloud,
  Search,
  Eye,
  Trash2,
  X,
} from "lucide-react";

function Documents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [fileType, setFileType] = useState("All");
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Data Protection Policy.pdf",
      type: "PDF",
      status: "Processed",
      date: "08 Aug 2026",
    },
    {
      id: 2,
      name: "Employee Compliance Policy.docx",
      type: "DOCX",
      status: "Processed",
      date: "07 Aug 2026",
    },
    {
      id: 3,
      name: "Terms and Conditions.pdf",
      type: "PDF",
      status: "Processed",
      date: "05 Aug 2026",
    },
    {
      id: 4,
      name: "Information Security Policy.pdf",
      type: "PDF",
      status: "Processed",
      date: "03 Aug 2026",
    },
  ]);

  const filteredDocuments = documents.filter((document) => {
    const matchesSearch = document.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesType =
      fileType === "All" || document.type === fileType;

    return matchesSearch && matchesType;
  });

  const handleDelete = (id) => {
    setDocuments((currentDocuments) =>
      currentDocuments.filter((document) => document.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Documents
            </h1>

            <p className="text-gray-500 mt-1">
              Manage documents analyzed by Compliance Copilot AI.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition">
            <UploadCloud className="w-5 h-5" />
            Upload Document
          </button>
        </div>

        {/* Document Card */}
        <div className="mt-8 bg-white rounded-2xl shadow-md overflow-hidden">

          {/* Card Header */}
          <div className="p-6 border-b border-gray-100">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              <div>
                <h2 className="font-semibold text-gray-800">
                  Uploaded Documents
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {documents.length} documents available
                </p>
              </div>

              {/* Search + Filter */}
              <div className="flex flex-col sm:flex-row gap-3">

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  />
                </div>

                <select
                  value={fileType}
                  onChange={(event) =>
                    setFileType(event.target.value)
                  }
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                >
                  <option value="All">All Types</option>
                  <option value="PDF">PDF</option>
                  <option value="DOCX">DOCX</option>
                </select>

              </div>
            </div>
          </div>

          {/* Documents */}
          {filteredDocuments.length > 0 ? (
            <div className="divide-y divide-gray-100">

              {filteredDocuments.map((document) => (
                <div
                  key={document.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:bg-gray-50 transition"
                >

                  {/* Document Info */}
                  <div className="flex items-center gap-4 min-w-0">

                    <div className="bg-blue-50 p-3 rounded-xl shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {document.name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {document.type} • Uploaded {document.date}
                      </p>
                    </div>

                  </div>

                  {/* Status + Actions */}
                  <div className="flex items-center gap-3">

                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700">
                      {document.status}
                    </span>

                    <button
                      onClick={() => setSelectedDocument(document)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="View document"
                    >
                      <Eye className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleDelete(document.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                      title="Delete document"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                  </div>

                </div>
              ))}

            </div>
          ) : (
            <div className="p-12 text-center">

              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-5 h-5 text-gray-400" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-800">
                No documents found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Try changing your search or filter.
              </p>

            </div>
          )}

        </div>
      </div>

      {/* View Document Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Document Details
              </h2>

              <button
                onClick={() => setSelectedDocument(null)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">

              <div>
                <p className="text-xs text-gray-500">
                  File name
                </p>

                <p className="font-medium text-gray-800 mt-1 break-words">
                  {selectedDocument.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-gray-500">
                    File type
                  </p>

                  <p className="font-medium text-gray-800 mt-1">
                    {selectedDocument.type}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Status
                  </p>

                  <p className="font-medium text-green-600 mt-1">
                    {selectedDocument.status}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Uploaded
                </p>

                <p className="font-medium text-gray-800 mt-1">
                  {selectedDocument.date}
                </p>
              </div>

            </div>

            <button
              onClick={() => setSelectedDocument(null)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Documents;