import { useNavigate } from "react-router-dom";
import { Scale, UserRound, BriefcaseBusiness } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl">

        {/* Logo */}
        <div className="text-center mb-10">

          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-sm">
              <Scale className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Compliance Copilot
          </h1>

          <p className="text-gray-500 mt-2">
            AI-powered regulatory compliance management
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 sm:p-10">

          <div className="text-center">

            <h2 className="text-xl font-semibold text-gray-800">
              Welcome
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Select how you want to use Compliance Copilot.
            </p>

          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">

            {/* Client */}
            <button
              onClick={() => navigate("/business-selection")}
              className="group text-left border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
            >

              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition">
                <UserRound className="w-6 h-6 text-blue-600" />
              </div>

              <h3 className="font-semibold text-gray-800 mt-5">
                Business / Client
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Manage your business compliance, upload documents,
                and review compliance recommendations.
              </p>

              <div className="mt-5 text-sm font-medium text-blue-600">
                Continue as Client →
              </div>

            </button>

            {/* Lawyer */}
            <button
              onClick={() => navigate("/lawyer-dashboard")}
              className="group text-left border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
            >

              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition">
                <BriefcaseBusiness className="w-6 h-6 text-indigo-600" />
              </div>

              <h3 className="font-semibold text-gray-800 mt-5">
                Lawyer
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Monitor client compliance, review recommendations,
                and manage regulatory actions.
              </p>

              <div className="mt-5 text-sm font-medium text-indigo-600">
                Continue as Lawyer →
              </div>

            </button>

          </div>

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Compliance Copilot AI • Regulatory Intelligence Platform
        </p>

      </div>
    </div>
  );
}

export default Login;