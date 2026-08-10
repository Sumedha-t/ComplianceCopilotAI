import { useNavigate } from "react-router-dom";
import { Building2, FileCheck2, ArrowRight } from "lucide-react";

function BusinessSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-4xl">

        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-sm">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Your Business
          </h1>

          <p className="text-gray-500 mt-2">
            Tell us how you want to use Compliance Copilot.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 sm:p-10">

          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              What type of business are you managing?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Choose the option that best describes your situation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">

            <button
              onClick={() => navigate("/new-business")}
              className="group text-left border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>

                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition" />
              </div>

              <h3 className="font-semibold text-gray-800 mt-5">
                New Business
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Get guidance on business structure, registrations,
                industry compliance, and initial requirements.
              </p>

              <div className="mt-5 text-sm font-medium text-blue-600">
                Start Business Consultation →
              </div>
            </button>

            <button
              onClick={() => navigate("/compliance-copilot")}
              className="group text-left border border-gray-200 rounded-2xl p-6 hover:border-green-300 hover:bg-green-50/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition">
                  <FileCheck2 className="w-6 h-6 text-green-600" />
                </div>

                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-green-600 transition" />
              </div>

              <h3 className="font-semibold text-gray-800 mt-5">
                Existing Business
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Upload compliance documents and review your
                existing regulatory compliance status.
              </p>

              <div className="mt-5 text-sm font-medium text-green-600">
                Open Compliance Copilot →
              </div>
            </button>

          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-gray-400 hover:text-gray-600 transition"
            >
              ← Back to role selection
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BusinessSelection;