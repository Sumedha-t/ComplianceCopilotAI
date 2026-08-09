import { useState } from "react";
import Header from "../components/Header";
import UploadBox from "../components/UploadBox";
import ComplianceScoreCard from "../components/ComplianceScoreCard";
import ComplianceIssuesCard from "../components/ComplianceIssuesCard";
import AISummaryCard from "../components/AISummaryCard";
import DocumentInfoCard from "../components/DocumentInfoCard";
import {
  Lightbulb,
  CheckCircle2,
  FileText,
} from "lucide-react";

function Dashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please select a document first.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    // Frontend-only mock AI analysis
    await new Promise((resolve) =>
      setTimeout(resolve, 2500)
    );

    const mockResult = {
      fileName: selectedFile.name,
      score: 87,
      status: "Good Compliance",
      riskLevel: "Low Risk",

      summary:
        "The uploaded document demonstrates a strong level of compliance with the applicable regulatory requirements. However, a few areas require attention to reduce potential compliance risks.",

      issues: [
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

      recommendations: [
        "Add a clear data protection clause",
        "Update regulatory references",
        "Define a document retention period",
      ],
    };

    setAnalysisResult(mockResult);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Header */}
        <Header />

        {/* Page Introduction */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Compliance Dashboard
          </h1>

         <p className="text-gray-500 mt-1">
  Review regulatory compliance and manage document analysis.
</p>
        </div>

        {/* Upload Section */}
        <UploadBox
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">

            <div className="mx-auto w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>

            <h2 className="mt-5 text-lg font-semibold text-gray-800">
              Analyzing document...
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              AI is reviewing the document for potential
              compliance risks.
            </p>

            <div className="mt-5 max-w-md mx-auto">
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse w-2/3"></div>
              </div>
            </div>

          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && !isLoading && (
          <div className="space-y-8">

            {/* Analysis Complete Banner */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">

              <div className="bg-green-100 p-2 rounded-xl shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-green-800">
                  Analysis completed successfully
                </p>

                <p className="text-sm text-green-700 mt-1 break-words">
                  {analysisResult.fileName}
                </p>
              </div>

            </div>

            {/* Compliance Overview */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Compliance Overview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                AI-generated insights from your compliance
                analysis.
              </p>
            </div>

            {/* Document Information */}
            <DocumentInfoCard
              selectedFile={selectedFile}
              analysisResult={analysisResult}
            />

            {/* Score + Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <ComplianceScoreCard
                score={analysisResult.score}
                status={analysisResult.status}
                riskLevel={analysisResult.riskLevel}
              />

              <AISummaryCard
                summary={analysisResult.summary}
                riskLevel={analysisResult.riskLevel}
              />

            </div>

            {/* Detailed Findings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Detailed Findings
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Potential compliance risks and recommended
                actions.
              </p>
            </div>

            {/* Issues + Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Issues */}
              <ComplianceIssuesCard
                issues={analysisResult.issues}
              />

              {/* Recommendations */}
              <div className="bg-white rounded-2xl shadow-md p-6">

                <div className="flex items-center justify-between">

                  <h2 className="text-lg font-semibold text-gray-700">
                    AI Recommendations
                  </h2>

                  <Lightbulb className="w-6 h-6 text-amber-500" />

                </div>

                <div className="mt-5 space-y-5">

                  {analysisResult.recommendations.map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="flex gap-3"
                      >

                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />

                        <div>
                          <p className="font-medium text-gray-800">
                            {recommendation}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            Recommended action based on the
                            identified compliance findings.
                          </p>
                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>

          </div>
        )}

        {/* Empty State */}
        {!selectedFile &&
          !analysisResult &&
          !isLoading && (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">

              <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                Ready for compliance analysis
              </h2>

              <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                Upload a compliance document above to begin an
                AI-powered regulatory review.
              </p>

            </div>
          )}

      </div>
    </div>
  );
}

export default Dashboard;