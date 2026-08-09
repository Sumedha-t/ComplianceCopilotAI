import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

function ComplianceIssuesCard({
  issues = [
    {
      title: "Missing data protection clause",
      severity: "High",
      description:
        "The document does not clearly define how personal data is handled.",
    },
    {
      title: "Outdated compliance reference",
      severity: "Medium",
      description:
        "One regulatory reference may require an update to the latest guidelines.",
    },
    {
      title: "Incomplete record retention policy",
      severity: "Low",
      description:
        "The document does not specify a clear retention period.",
    },
  ],
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-200 hover:shadow-lg">

      {/* Header */}
      <div className="flex items-center justify-between">

        <h2 className="text-lg font-semibold text-gray-700">
          Compliance Issues
        </h2>

        <AlertTriangle className="w-6 h-6 text-amber-500" />

      </div>

      {/* Issues */}
      <div className="mt-5 space-y-4">

        {issues.map((issue, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-xl p-4"
          >

            <div className="flex items-start justify-between gap-3">

              <div className="min-w-0">

                <h3 className="font-medium text-gray-800">
                  {issue.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {issue.description}
                </p>

              </div>

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                  issue.severity === "High"
                    ? "bg-red-100 text-red-700"
                    : issue.severity === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {issue.severity}
              </span>

            </div>

          </div>
        ))}

      </div>

      {/* Issue Count */}
      <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">

        <CheckCircle2 className="w-4 h-4 text-green-500" />

        {issues.length} potential issue
        {issues.length !== 1 ? "s" : ""} identified

      </div>

    </div>
  );
}

export default ComplianceIssuesCard;