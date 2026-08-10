import {
  Building2,
  MapPin,
  Factory,
  Bell,
  ArrowRight,
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function Clients() {
  const navigate = useNavigate();

  const clients = [
    {
      id: 1,
      company_name: "ABC Manufacturing Private Limited",
      industry: "Manufacturing",
      state: "Karnataka",
      compliance_score: 50,
      risk_level: "High",
      regulatory_alerts: 2,
    },
    {
      id: 2,
      company_name: "NovaTech Solutions",
      industry: "Technology",
      state: "Karnataka",
      compliance_score: 82,
      risk_level: "Low",
      regulatory_alerts: 0,
    },
    {
      id: 3,
      company_name: "GreenLife Healthcare",
      industry: "Healthcare",
      state: "Tamil Nadu",
      compliance_score: 68,
      risk_level: "Medium",
      regulatory_alerts: 1,
    },
    {
      id: 4,
      company_name: "Urban Retail Ventures",
      industry: "Retail",
      state: "Maharashtra",
      compliance_score: 91,
      risk_level: "Low",
      regulatory_alerts: 0,
    },
  ];

  const getRiskStyles = (risk) => {
    if (risk === "High") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    if (risk === "Medium") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    return "bg-green-50 text-green-700 border-green-100";
  };

  const getScoreStyles = (score) => {
    if (score < 60) {
      return "text-red-600";
    }

    if (score < 80) {
      return "text-amber-600";
    }

    return "text-green-600";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

          <div>
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Lawyer Workspace
            </p>

            <h1 className="text-2xl font-bold text-gray-800 mt-1">
              Clients
            </h1>

            <p className="text-gray-500 mt-1">
              Monitor compliance status across your business clients.
            </p>
          </div>

          {/* Client Count */}
          <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <p className="text-xs text-gray-500">
              Active Clients
            </p>

            <p className="text-xl font-bold text-gray-800 mt-0.5">
              {clients.length}
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="mt-7 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">

          <div className="relative max-w-md">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search clients..."
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />

          </div>

        </div>

        {/* Client Cards */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-5">

          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
            >

              {/* Card Content */}
              <div className="p-6">

                {/* Card Header */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-3 min-w-0">

                    <div className="bg-blue-50 p-2.5 rounded-xl shrink-0">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="min-w-0">

                      <h2 className="font-semibold text-gray-800 break-words">
                        {client.company_name}
                      </h2>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">

                        <span className="flex items-center gap-1.5">
                          <Factory className="w-3.5 h-3.5" />
                          {client.industry}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {client.state}
                        </span>

                      </div>

                    </div>

                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${getRiskStyles(
                      client.risk_level
                    )}`}
                  >
                    {client.risk_level} Risk
                  </span>

                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mt-6">

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-xs text-gray-500">
                      Compliance
                    </p>

                    <p
                      className={`text-2xl font-bold mt-1 ${getScoreStyles(
                        client.compliance_score
                      )}`}
                    >
                      {client.compliance_score}%
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-xs text-gray-500">
                      Risk Level
                    </p>

                    <p className="text-sm font-semibold text-gray-800 mt-2">
                      {client.risk_level}
                    </p>

                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">

                    <p className="text-xs text-gray-500">
                      Alerts
                    </p>

                    <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 mt-2">

                      <Bell className="w-4 h-4 text-amber-500" />

                      {client.regulatory_alerts}

                    </p>

                  </div>

                </div>

              </div>

              {/* Card Footer */}
              <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">

                <p className="text-xs text-gray-400">
                  Client ID #{client.id}
                </p>

                <button
                  onClick={() => navigate(`/clients/${client.id}`)}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                >
                  View Client

                  <ArrowRight className="w-4 h-4" />
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}

export default Clients;