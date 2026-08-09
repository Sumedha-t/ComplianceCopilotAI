import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Lightbulb,
  Settings,
  Scale,
  Activity,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const navigation = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Documents",
      path: "/documents",
      icon: FileText,
    },
    {
      name: "Compliance Issues",
      path: "/issues",
      icon: AlertTriangle,
    },
    {
      name: "Recommendations",
      path: "/recommendations",
      icon: Lightbulb,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-6">

        <div className="flex items-center gap-3">

          <div className="bg-blue-600 p-2.5 rounded-xl shadow-sm">
            <Scale className="w-6 h-6 text-white" />
          </div>

          <div>
            <p className="font-bold text-gray-800 text-base">
              Compliance
            </p>

            <p className="text-xs text-blue-600 font-medium">
              Copilot AI
            </p>
          </div>

        </div>

        <div className="mt-6 h-px bg-gray-100"></div>

      </div>

      {/* Navigation */}
      <nav className="px-4 space-y-1 flex-1">

        <p className="px-3 mb-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Workspace
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-0.5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />

                  <span>{item.name}</span>

                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

      </nav>

      {/* AI System Status */}
      <div className="px-4 pb-5">

        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">

          <div className="flex items-center gap-2">

            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Activity className="w-4 h-4 text-blue-600" />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-700">
                AI SYSTEM
              </p>

              <div className="flex items-center gap-1.5 mt-0.5">

                <span className="w-2 h-2 bg-green-500 rounded-full"></span>

                <span className="text-xs font-medium text-green-600">
                  Operational
                </span>

              </div>
            </div>

          </div>

          <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
            Compliance analysis engine is ready for document review.
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;