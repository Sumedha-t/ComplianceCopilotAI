import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Activity,
  ArrowRight,
  FileText,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function LawyerDashboard() {
  const navigate = useNavigate();

  // ==================================================
  // DEMO CLIENT DATA
  // Matches the Clients page
  // ==================================================

  const clients = [
    {
      id: 1,
      name: "ABC Manufacturing Private Limited",
      industry: "Manufacturing",
      state: "Karnataka",
      compliance: 50,
      risk: "High",
      alerts: 2,
    },
    {
      id: 2,
      name: "NovaTech Solutions",
      industry: "Technology",
      state: "Karnataka",
      compliance: 82,
      risk: "Low",
      alerts: 0,
    },
    {
      id: 3,
      name: "GreenLife Healthcare",
      industry: "Healthcare",
      state: "Tamil Nadu",
      compliance: 68,
      risk: "Medium",
      alerts: 1,
    },
    {
      id: 4,
      name: "Urban Retail Ventures",
      industry: "Retail",
      state: "Maharashtra",
      compliance: 91,
      risk: "Low",
      alerts: 0,
    },
  ];


  // ==================================================
  // METRICS
  // ==================================================

  const totalClients = clients.length;

  const averageCompliance = Math.round(
    clients.reduce(
      (sum, client) => sum + client.compliance,
      0
    ) / totalClients
  );

  const totalAlerts = clients.reduce(
    (sum, client) => sum + client.alerts,
    0
  );

  const highRiskClients = clients.filter(
    (client) => client.risk === "High"
  ).length;

  const pendingActions = totalAlerts;


  return (
    <div className="min-h-screen bg-slate-50 px-6 py-7">

      <div className="max-w-7xl mx-auto">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-8">

          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Lawyer Workspace
          </p>

          <h1 className="text-3xl font-bold text-gray-800 mt-1">
            Lawyer Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor client compliance and review regulatory risks.
          </p>

        </div>


        {/* ==================================================
            SUMMARY CARDS
        ================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* CLIENTS */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Clients
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-4">
                  {totalClients}
                </p>

              </div>

              <div className="bg-blue-50 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>

            </div>

            <p className="text-sm text-gray-400 mt-4">
              Active business clients
            </p>

          </div>


          {/* COMPLIANCE */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Compliance
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-4">
                  {averageCompliance}%
                </p>

              </div>

              <div className="bg-green-50 p-3 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>

            </div>

            <p className="text-sm text-gray-400 mt-4">
              Average client compliance
            </p>

          </div>


          {/* ALERTS */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Regulatory Alerts
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-4">
                  {totalAlerts}
                </p>

              </div>

              <div className="bg-red-50 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

            </div>

            <p className="text-sm text-gray-400 mt-4">
              Alerts requiring review
            </p>

          </div>


          {/* PENDING ACTIONS */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Pending Actions
                </p>

                <p className="text-3xl font-bold text-gray-800 mt-4">
                  {pendingActions}
                </p>

              </div>

              <div className="bg-amber-50 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>

            </div>

            <p className="text-sm text-gray-400 mt-4">
              Actions requiring attention
            </p>

          </div>

        </div>


        {/* ==================================================
            CLIENT MANAGEMENT
        ================================================== */}

        <div className="mt-7">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="bg-blue-50 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>

                <div>

                  <h2 className="text-lg font-semibold text-gray-800">
                    Client Compliance Management
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    View and manage compliance information for your clients.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => navigate("/clients")}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
              >
                View Clients
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>


        {/* ==================================================
            ACTIONS + REGULATORY INTELLIGENCE
        ================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* COMPLIANCE ACTIONS */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-start gap-4">

              <div className="bg-amber-50 p-3 rounded-xl">
                <Activity className="w-6 h-6 text-amber-600" />
              </div>

              <div>

                <h2 className="text-lg font-semibold text-gray-800">
                  Compliance Actions
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Review AI-generated actions and lawyer decisions.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => navigate("/recommendations")}
              className="mt-6 text-blue-600 font-medium text-sm hover:text-blue-700"
            >
              Review Recommendations →
            </button>

          </div>


          {/* REGULATORY INTELLIGENCE */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <div className="flex items-start gap-4">

              <div className="bg-red-50 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              <div>

                <h2 className="text-lg font-semibold text-gray-800">
                  Regulatory Intelligence
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Review regulatory alerts affecting your clients.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => navigate("/issues")}
              className="mt-6 text-blue-600 font-medium text-sm hover:text-blue-700"
            >
              Review Issues & Alerts →
            </button>

          </div>

        </div>


        {/* ==================================================
            DOCUMENT REVIEW
        ================================================== */}

        <div className="mt-6">

          <button
            type="button"
            onClick={() => navigate("/documents")}
            className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left hover:border-blue-200 transition"
          >

            <div className="flex items-center gap-4">

              <div className="bg-blue-50 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>

              <div className="flex-1">

                <h2 className="text-lg font-semibold text-gray-800">
                  Document Review
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Review compliance documents analyzed by the system.
                </p>

              </div>

              <ArrowRight className="w-5 h-5 text-blue-600" />

            </div>

          </button>

        </div>


        {/* ==================================================
            MONITORING SUMMARY
        ================================================== */}

        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">

          <div className="flex items-center gap-3">

            <div className="bg-white p-2.5 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>

            <div>

              <h2 className="font-semibold text-gray-800">
                Compliance Monitoring Summary
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                {highRiskClients} client currently requires high-risk
                compliance attention. Review client compliance,
                regulatory issues and recommended actions from this
                workspace.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LawyerDashboard;