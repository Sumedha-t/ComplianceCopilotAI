import {
  Users,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Activity,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function LawyerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div>
          <p className="text-sm font-medium text-blue-600">
            LAWYER WORKSPACE
          </p>

          <h1 className="text-2xl font-bold text-gray-800 mt-1">
            Lawyer Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor client compliance and review regulatory risks.
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Clients
              </p>

              <div className="bg-blue-50 p-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              —
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Client data will appear here
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Compliance
              </p>

              <div className="bg-green-50 p-2 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              —
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Overall client compliance
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Regulatory Alerts
              </p>

              <div className="bg-red-50 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              —
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Alerts requiring review
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Pending Actions
              </p>

              <div className="bg-amber-50 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-amber-600" />
              </div>
            </div>

            <p className="text-3xl font-bold text-gray-800 mt-4">
              —
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Actions requiring attention
            </p>
          </div>

        </div>

        {/* Client Management */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-3">

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
              onClick={() => navigate("/clients")}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              View Clients
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Review Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="flex items-center gap-3">

              <div className="bg-amber-50 p-3 rounded-xl">
                <Activity className="w-5 h-5 text-amber-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  Compliance Actions
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Review AI-generated actions and lawyer decisions.
                </p>
              </div>

            </div>

            <button
              onClick={() => navigate("/recommendations")}
              className="mt-5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Review Recommendations →
            </button>

          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="flex items-center gap-3">

              <div className="bg-red-50 p-3 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  Regulatory Intelligence
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Review regulatory alerts affecting your clients.
                </p>
              </div>

            </div>

            <button
              onClick={() => navigate("/issues")}
              className="mt-5 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Review Issues & Alerts →
            </button>

          </div>

        </div>

        {/* System Status */}
        <div className="bg-white border border-blue-100 rounded-2xl p-5 mt-6">

          <div className="flex items-center gap-3">

            <div className="bg-blue-50 p-3 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <p className="font-semibold text-gray-800">
                Lawyer Review Workspace
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Client data, compliance actions and regulatory intelligence
                can be reviewed from this workspace.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default LawyerDashboard;