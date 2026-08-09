import { useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Mail,
  Globe,
  Bell,
  CheckCircle2,
} from "lucide-react";

function Settings() {
  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [email, setEmail] = useState("");
  const [jurisdiction, setJurisdiction] = useState("India");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Settings
          </h1>

          <p className="text-gray-500 mt-1">
            Manage your company and application preferences.
          </p>
        </div>

        {/* Company Information */}
        <div className="mt-8 bg-white rounded-2xl shadow-md p-6">

          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-xl">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h2 className="font-semibold text-gray-800">
                Company Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Information used for compliance analysis.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Company Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Company Name
              </label>

              <input
                type="text"
                value={companyName}
                onChange={(event) =>
                  setCompanyName(event.target.value)
                }
                placeholder="Enter company name"
                className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            {/* GSTIN */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                GSTIN
              </label>

              <input
                type="text"
                value={gstin}
                onChange={(event) =>
                  setGstin(event.target.value)
                }
                placeholder="Enter GSTIN"
                className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Contact Email
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="compliance@company.com"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
            </div>

            {/* Jurisdiction */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Regulatory Jurisdiction
              </label>

              <div className="relative mt-2">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                <select
                  value={jurisdiction}
                  onChange={(event) =>
                    setJurisdiction(event.target.value)
                  }
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                >
                  <option value="India">India</option>
                  <option value="European Union">
                    European Union
                  </option>
                  <option value="United Kingdom">
                    United Kingdom
                  </option>
                  <option value="United States">
                    United States
                  </option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Notifications */}
        <div className="mt-6 bg-white rounded-2xl shadow-md p-6">

          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="bg-amber-50 p-2 rounded-xl">
                <Bell className="w-5 h-5 text-amber-500" />
              </div>

              <div>
                <h2 className="font-semibold text-gray-800">
                  Compliance Notifications
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Receive alerts about compliance risks and recommendations.
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                setNotifications(!notifications)
              }
              className={`relative w-12 h-6 rounded-full transition ${
                notifications
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
              aria-label="Toggle notifications"
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                  notifications
                    ? "left-7"
                    : "left-1"
                }`}
              ></span>
            </button>

          </div>

          <p className="text-xs text-gray-400 mt-4">
            Notifications are currently{" "}
            {notifications ? "enabled" : "disabled"}.
          </p>

        </div>

        {/* Save */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">

          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
          >
            <SettingsIcon className="w-4 h-4" />
            Save Changes
          </button>

          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <CheckCircle2 className="w-5 h-5" />
              Settings saved successfully
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Settings;