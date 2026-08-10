import {
  ArrowLeft,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Download,
  MapPin,
  Factory,
  ShieldAlert,
  Bell,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function ClientDashboard() {
  const navigate = useNavigate();

  const company = {
    company_name: "ABC Manufacturing Private Limited",
    cin: "U12345KA2020PTC123456",
    pan: "ABCDE1234F",
    gstin: "29ABCDE1234F1Z5",
    business_type: "Private Limited",
    industry: "Manufacturing",
    state: "Karnataka",
  };

  const compliance = {
    compliance_score: 50,
    risk_level: "High",
    present_documents: [
      "Certificate of Incorporation",
      "GST Registration",
    ],
    missing_documents: [
      "Factory License",
      "Fire NOC",
      "Pollution Control Certificate",
      "MSME Certificate",
    ],
  };

  const recommendations = [
    {
      document: "Data Protection Policy",
      priority: "High",
      action: "Add a clear data protection clause.",
      reason:
        "The current documentation does not clearly define how personal data is handled.",
      next_step:
        "Review the organization's data collection and processing practices.",
    },
    {
      document: "Regulatory Reference",
      priority: "Medium",
      action: "Update outdated regulatory references.",
      reason:
        "One reference may no longer reflect the latest regulatory requirements.",
      next_step:
        "Verify the latest applicable regulations and update the document.",
    },
    {
      document: "Record Retention Policy",
      priority: "Low",
      action: "Define a document retention period.",
      reason:
        "The current policy does not specify how long compliance records should be retained.",
      next_step:
        "Establish and document an appropriate retention schedule.",
    },
  ];

  const regulatoryAlerts = [
    {
      authority: "Karnataka Pollution Control Board",
      title: "Updated pollution control requirements",
      severity: "High",
      affected_document: "Pollution Control Certificate",
      status: "Re-audit Required",
      date: "09 Aug 2026",
    },
    {
      authority: "Karnataka Fire and Emergency Services",
      title: "Updated fire safety compliance requirements",
      severity: "High",
      affected_document: "Fire NOC",
      status: "Re-audit Required",
      date: "08 Aug 2026",
    },
  ];

  const getPriorityStyles = (priority) => {
    if (priority === "High") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    if (priority === "Medium") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    return "bg-blue-50 text-blue-700 border-blue-100";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clients
        </button>

        {/* Header */}
        <div className="mt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div className="flex items-start gap-4">

            <div className="bg-blue-100 p-3 rounded-2xl">
              <Building2 className="w-7 h-7 text-blue-600" />
            </div>

            <div>

              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Client Dashboard
              </p>

              <h1 className="text-2xl font-bold text-gray-800 mt-1">
                {company.company_name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">

                <span className="flex items-center gap-1.5">
                  <Factory className="w-4 h-4" />
                  {company.industry}
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {company.state}
                </span>

              </div>

            </div>

          </div>

          {/* Download Report */}
          <button
            className="group flex items-center gap-3 bg-white border border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 px-4 py-3 rounded-xl transition shadow-sm"
          >
            <div className="bg-blue-50 group-hover:bg-white p-2 rounded-lg transition">
              <Download className="w-4 h-4 text-blue-600" />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold">
                Download Compliance Report
              </p>

              <p className="text-xs text-gray-400 mt-0.5">
                Latest client assessment
              </p>
            </div>
          </button>

        </div>

        {/* Company Profile */}
        <section className="mt-8">

          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />

            <h2 className="text-lg font-semibold text-gray-800">
              Company Profile
            </h2>
          </div>

          <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  CIN
                </p>

                <p className="text-sm font-medium text-gray-800 mt-1 break-all">
                  {company.cin}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  PAN
                </p>

                <p className="text-sm font-medium text-gray-800 mt-1">
                  {company.pan}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  GSTIN
                </p>

                <p className="text-sm font-medium text-gray-800 mt-1 break-all">
                  {company.gstin}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Business Type
                </p>

                <p className="text-sm font-medium text-gray-800 mt-1">
                  {company.business_type}
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* Compliance Overview */}
        <section className="mt-8">

          <div className="flex items-center gap-2">

            <ShieldAlert className="w-5 h-5 text-blue-600" />

            <h2 className="text-lg font-semibold text-gray-800">
              Compliance Overview
            </h2>

          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Score */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              <p className="text-sm text-gray-500">
                Compliance Score
              </p>

              <div className="flex items-end gap-3 mt-3">

                <span className="text-5xl font-bold text-gray-800">
                  {compliance.compliance_score}%
                </span>

                <span className="text-sm font-semibold text-red-600 mb-2">
                  {compliance.risk_level.toUpperCase()} RISK
                </span>

              </div>

              <div className="mt-5 w-full h-3 bg-gray-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${compliance.compliance_score}%`,
                  }}
                ></div>

              </div>

            </div>

            {/* Present Documents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              <p className="text-sm text-gray-500">
                Present Documents
              </p>

              <p className="text-2xl font-bold text-green-600 mt-2">
                {compliance.present_documents.length}
              </p>

              <div className="mt-4 space-y-2">

                {compliance.present_documents.map(
                  (document, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      {document}
                    </div>
                  )
                )}

              </div>

            </div>

            {/* Missing Documents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

              <p className="text-sm text-gray-500">
                Missing Documents
              </p>

              <p className="text-2xl font-bold text-red-600 mt-2">
                {compliance.missing_documents.length}
              </p>

              <div className="mt-4 space-y-2">

                {compliance.missing_documents.map(
                  (document, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                      {document}
                    </div>
                  )
                )}

              </div>

            </div>

          </div>

        </section>

        {/* Recommendations */}
        <section className="mt-8">

          <div className="flex items-center gap-2">

            <FileText className="w-5 h-5 text-blue-600" />

            <h2 className="text-lg font-semibold text-gray-800">
              Recommendations
            </h2>

          </div>

          <div className="mt-4 space-y-4">

            {recommendations.map(
              (recommendation, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="font-semibold text-gray-800">
                          {recommendation.document}
                        </h3>

                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getPriorityStyles(
                            recommendation.priority
                          )}`}
                        >
                          {recommendation.priority}
                        </span>

                      </div>

                      <p className="text-sm font-medium text-gray-700 mt-3">
                        {recommendation.action}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {recommendation.reason}
                      </p>

                      <div className="mt-4 bg-gray-50 rounded-xl p-3">

                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Next Step
                        </p>

                        <p className="text-sm text-gray-600 mt-1">
                          {recommendation.next_step}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        </section>

        {/* Regulatory Intelligence */}
        <section className="mt-8">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-2">

              <Bell className="w-5 h-5 text-blue-600" />

              <h2 className="text-lg font-semibold text-gray-800">
                Regulatory Intelligence
              </h2>

            </div>

            <span className="text-xs font-medium bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
              {regulatoryAlerts.length} Active Alerts
            </span>

          </div>

          <div className="mt-4 space-y-4">

            {regulatoryAlerts.map(
              (alert, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-sm border border-red-100 p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    <div className="flex gap-4 min-w-0">

                      <div className="bg-red-50 p-2.5 rounded-xl shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                            {alert.severity.toUpperCase()}
                          </span>

                          <span className="text-xs text-gray-400">
                            {alert.date}
                          </span>

                        </div>

                        <p className="text-sm font-semibold text-gray-800 mt-3">
                          {alert.authority}
                        </p>

                        <h3 className="text-base font-semibold text-gray-800 mt-1">
                          {alert.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                          Affected document:{" "}
                          <span className="font-medium text-gray-700">
                            {alert.affected_document}
                          </span>
                        </p>

                        {/* Action Required */}
                        <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Action required
                        </div>

                      </div>

                    </div>

                    <div className="shrink-0">

                      <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-red-50 text-red-700 border border-red-100">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        {alert.status}
                      </span>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>

        </section>

      </div>
    </div>
  );
}

export default ClientDashboard;