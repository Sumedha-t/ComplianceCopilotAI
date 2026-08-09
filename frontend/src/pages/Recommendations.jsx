import { useState } from "react";
import {
  CheckCircle2,
  Lightbulb,
  Clock,
  X,
} from "lucide-react";

function Recommendations() {
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedRecommendation, setSelectedRecommendation] =
    useState(null);

  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      title: "Add a clear data protection clause",
      description:
        "Define how personal information is collected, stored and processed.",
      priority: "High",
      category: "Data Protection",
      status: "Pending",
    },
    {
      id: 2,
      title: "Update regulatory references",
      description:
        "Review outdated references and align them with current regulations.",
      priority: "Medium",
      category: "Regulatory Compliance",
      status: "Pending",
    },
    {
      id: 3,
      title: "Define a document retention period",
      description:
        "Specify how long compliance records should be retained.",
      priority: "Low",
      category: "Records Management",
      status: "Pending",
    },
  ]);

  const filteredRecommendations =
    priorityFilter === "All"
      ? recommendations
      : recommendations.filter(
          (recommendation) =>
            recommendation.priority === priorityFilter
        );

  const completedCount = recommendations.filter(
    (recommendation) =>
      recommendation.status === "Completed"
  ).length;

  const completionPercentage =
    recommendations.length === 0
      ? 0
      : Math.round(
          (completedCount / recommendations.length) * 100
        );

  const markCompleted = (id) => {
    setRecommendations((current) =>
      current.map((recommendation) =>
        recommendation.id === id
          ? {
              ...recommendation,
              status:
                recommendation.status === "Completed"
                  ? "Pending"
                  : "Completed",
            }
          : recommendation
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            AI Recommendations
          </h1>

          <p className="text-gray-500 mt-1">
            Recommended actions based on identified compliance gaps.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">

          {/* Total Recommendations */}
          <div className="bg-white rounded-2xl shadow-md p-5 min-w-0">
            <p className="text-xs sm:text-sm text-gray-500 leading-5">
              Total Recommendations
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">
              {recommendations.length}
            </p>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl shadow-md p-5 min-w-0">
            <p className="text-xs sm:text-sm text-gray-500 leading-5">
              Completed
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">
              {completedCount}
            </p>
          </div>

          {/* Completion */}
          <div className="bg-white rounded-2xl shadow-md p-5 min-w-0">
            <p className="text-xs sm:text-sm text-gray-500 leading-5">
              Completion
            </p>

            <div className="flex items-end gap-2 mt-2">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                {completionPercentage}%
              </p>

              <span className="text-sm text-gray-400 mb-1">
                complete
              </span>
            </div>
          </div>

        </div>

        {/* Progress Bar */}
        <div className="mt-6 bg-white rounded-2xl shadow-md p-5">

          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">
              Compliance action progress
            </span>

            <span className="text-gray-500">
              {completedCount} of {recommendations.length}
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{
                width: `${completionPercentage}%`,
              }}
            ></div>
          </div>

        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-2">

          {["All", "High", "Medium", "Low"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() =>
                  setPriorityFilter(filter)
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  priorityFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter}
              </button>
            )
          )}

        </div>

        {/* Recommendations List */}
        <div className="mt-5 space-y-4">

          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map(
              (recommendation) => (
                <div
                  key={recommendation.id}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                >

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    {/* Recommendation Info */}
                    <div className="flex gap-4 min-w-0">

                      <div
                        className={`p-3 rounded-xl shrink-0 ${
                          recommendation.status ===
                          "Completed"
                            ? "bg-green-50"
                            : "bg-amber-50"
                        }`}
                      >
                        {recommendation.status ===
                        "Completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Lightbulb className="w-5 h-5 text-amber-500" />
                        )}
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <h2
                            className={`font-semibold ${
                              recommendation.status ===
                              "Completed"
                                ? "text-gray-400 line-through"
                                : "text-gray-800"
                            }`}
                          >
                            {recommendation.title}
                          </h2>

                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              recommendation.priority ===
                              "High"
                                ? "bg-red-100 text-red-700"
                                : recommendation.priority ===
                                  "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {recommendation.priority}
                          </span>

                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                          {recommendation.description}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          Category: {recommendation.category}
                        </p>

                      </div>

                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">

                      <button
                        onClick={() =>
                          setSelectedRecommendation(
                            recommendation
                          )
                        }
                        className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          markCompleted(
                            recommendation.id
                          )
                        }
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                          recommendation.status ===
                          "Completed"
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                      >
                        {recommendation.status ===
                        "Completed"
                          ? "Undo"
                          : "Complete"}
                      </button>

                    </div>

                  </div>

                </div>
              )
            )
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">

              <Clock className="w-10 h-10 text-gray-300 mx-auto" />

              <h3 className="mt-4 font-semibold text-gray-800">
                No recommendations found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                No recommendations match this priority.
              </p>

            </div>
          )}

        </div>

      </div>

      {/* Recommendation Details Modal */}
      {selectedRecommendation && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  AI Recommendation
                </p>

                <h2 className="text-xl font-semibold text-gray-800 mt-1">
                  {selectedRecommendation.title}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedRecommendation(null)
                }
                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="mt-6">

              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                  selectedRecommendation.priority ===
                  "High"
                    ? "bg-red-100 text-red-700"
                    : selectedRecommendation.priority ===
                      "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {selectedRecommendation.priority} Priority
              </span>

            </div>

            <div className="mt-6">

              <p className="text-sm font-semibold text-gray-700">
                Recommended Action
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {selectedRecommendation.description}
              </p>

            </div>

            <div className="mt-5 bg-blue-50 rounded-xl p-4">

              <p className="text-sm font-semibold text-blue-800">
                Category
              </p>

              <p className="text-sm text-blue-700 mt-1">
                {selectedRecommendation.category}
              </p>

            </div>

            <button
              onClick={() =>
                setSelectedRecommendation(null)
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

export default Recommendations;