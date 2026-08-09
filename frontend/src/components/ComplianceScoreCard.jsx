import { BarChart3 } from "lucide-react";

function ComplianceScoreCard({
  score = 87,
  status = "Good Compliance",
  riskLevel = "Low Risk",
}) {
  const circumference = 2 * Math.PI * 52;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-200 hover:shadow-lg">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          Compliance Score
        </h2>

        <BarChart3 className="w-6 h-6 text-blue-600" />
      </div>

      {/* Score */}
      <div className="mt-6 flex items-center gap-6">

        <div className="relative w-28 h-28 shrink-0">

          <svg
            className="w-28 h-28 -rotate-90"
            viewBox="0 0 120 120"
          >
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="10"
              className="stroke-green-100"
            />

            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              className="stroke-green-500"
              strokeDasharray={circumference}
              strokeDashoffset={
                circumference * (1 - score / 100)
              }
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">
              {score}%
            </span>
          </div>

        </div>

        {/* Status */}
        <div className="min-w-0">

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0"></span>

            <span className="font-semibold text-green-600">
              {status}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {riskLevel === "Low Risk"
              ? "Your document meets most regulatory requirements."
              : "Your document requires attention in several areas."}
          </p>

        </div>

      </div>

      {/* Progress Bar */}
      <div className="mt-6">

        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Compliance level</span>
          <span>{score}%</span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{
              width: `${score}%`,
            }}
          ></div>
        </div>

      </div>

      <p className="mt-3 text-xs text-gray-400">
        80–100% indicates low compliance risk
      </p>

    </div>
  );
}

export default ComplianceScoreCard;