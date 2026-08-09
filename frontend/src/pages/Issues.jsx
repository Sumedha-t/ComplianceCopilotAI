import { useState } from "react";
import {
  AlertTriangle,
  X,
  ShieldAlert,
} from "lucide-react";

function Issues() {
  const [severityFilter, setSeverityFilter] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState(null);

  const issues = [
    {
      id: 1,
      title: "Missing data protection clause",
      description:
        "The document does not clearly define how personal data is handled.",
      severity: "High",
      recommendation:
        "Add a dedicated data protection clause defining how personal information is collected, stored and processed.",
    },
    {
      id: 2,
      title: "Outdated compliance reference",
      description:
        "One regulatory reference may require an update to the latest guidelines.",
      severity: "Medium",
      recommendation:
        "Review the referenced regulation and update the document to align with the latest applicable requirements.",
    },
    {
      id: 3,
      title: "Incomplete record retention policy",
      description:
        "The document does not specify a clear retention period.",
      severity: "Low",
      recommendation:
        "Define how long compliance records should be retained and specify the applicable retention requirements.",
    },
  ];

  const filteredIssues =
    severityFilter === "All"
      ? issues
      : issues.filter(
          (issue) => issue.severity === severityFilter
        );

  const highCount = issues.filter(
    (issue) => issue.severity === "High"
  ).length;

  const mediumCount = issues.filter(
    (issue) => issue.severity === "Medium"
  ).length;

  const lowCount = issues.filter(
    (issue) => issue.severity === "Low"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Compliance Issues
          </h1>

          <p className="text-gray-500 mt-1">
            Review potential regulatory risks identified by the AI.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm text-gray-500">
              Total Issues
            </p>

            <p className="text-3xl font-bold text-gray-800 mt-2">
              {issues.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm text-gray-500">
              High Risk
            </p>

            <p className="text-3xl font-bold text-red-600 mt-2">
              {highCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <p className="text-sm text-gray-500">
              Medium Risk
            </p>

            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {mediumCount}
            </p>
          </div>

        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-2">

          {["All", "High", "Medium", "Low"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() =>
                  setSeverityFilter(filter)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  severityFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter}
              </button>
            )
          )}

        </div>

        {/* Issue List */}
        <div className="mt-5 space-y-4">

          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                  <div className="flex gap-4">

                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        issue.severity === "High"
                          ? "bg-red-50"
                          : issue.severity === "Medium"
                          ? "bg-yellow-50"
                          : "bg-blue-50"
                      }`}
                    >
                      <AlertTriangle
                        className={`w-5 h-5 ${
                          issue.severity === "High"
                            ? "text-red-500"
                            : issue.severity === "Medium"
                            ? "text-yellow-500"
                            : "text-blue-500"
                        }`}
                      />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-800">
                        {issue.title}
                      </h2>

                      <p className="text-sm text-gray-500 mt-2">
                        {issue.description}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                        issue.severity === "High"
                          ? "bg-red-100 text-red-700"
                          : issue.severity === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {issue.severity}
                    </span>

                    <button
                      onClick={() =>
                        setSelectedIssue(issue)
                      }
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      Review
                    </button>

                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">

              <ShieldAlert className="w-10 h-10 text-green-500 mx-auto" />

              <h3 className="mt-4 font-semibold text-gray-800">
                No issues found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                No compliance issues match this severity filter.
              </p>

            </div>
          )}

        </div>

      </div>

      {/* Issue Details Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  Compliance Issue
                </p>

                <h2 className="text-xl font-semibold text-gray-800 mt-1">
                  {selectedIssue.title}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedIssue(null)
                }
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="mt-6">

              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                  selectedIssue.severity === "High"
                    ? "bg-red-100 text-red-700"
                    : selectedIssue.severity === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {selectedIssue.severity} Risk
              </span>

            </div>

            <div className="mt-6">

              <p className="text-sm font-semibold text-gray-700">
                Issue
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {selectedIssue.description}
              </p>

            </div>

            <div className="mt-5 bg-blue-50 rounded-xl p-4">

              <p className="text-sm font-semibold text-blue-800">
                Recommended Action
              </p>

              <p className="text-sm text-blue-700 mt-2">
                {selectedIssue.recommendation}
              </p>

            </div>

            <button
              onClick={() =>
                setSelectedIssue(null)
              }
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

export default Issues;