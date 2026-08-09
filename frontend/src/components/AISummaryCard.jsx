import { Bot } from "lucide-react";

function AISummaryCard({
  summary = "The uploaded document demonstrates a strong level of compliance with the applicable regulatory requirements. However, a few areas require attention to reduce potential compliance risks.",
  riskLevel = "Low Risk",
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 transition-all duration-200 hover:shadow-lg">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-800">
            AI Summary
          </h2>

          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
            AI Generated
          </span>
        </div>

        <Bot className="w-6 h-6 text-blue-600" />

      </div>

      {/* Summary */}
      <div className="mt-5">

        <p className="text-gray-600 leading-relaxed">
          {summary}
        </p>

      </div>

      {/* Status */}
      <div className="mt-5 flex items-center gap-2">

        <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>

        <span className="text-sm text-gray-500">
          AI analysis completed
        </span>

        <span className="ml-auto text-xs font-medium text-green-600">
          {riskLevel}
        </span>

      </div>

    </div>
  );
}

export default AISummaryCard;