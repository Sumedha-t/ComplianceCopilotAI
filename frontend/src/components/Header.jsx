import { Scale } from "lucide-react";

function Header() {
  return (
    <header className="pb-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Scale className="w-6 h-6 text-white" />
            </div>

            <h1 className="text-2xl font-bold text-gray-800">
              Compliance Copilot AI
            </h1>
          </div>

          <p className="text-gray-600 mt-2">
            AI-powered Regulatory Compliance Assistant
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Helping legal teams detect compliance risks faster.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          Enterprise
        </div>
      </div>
    </header>
  );
}

export default Header;