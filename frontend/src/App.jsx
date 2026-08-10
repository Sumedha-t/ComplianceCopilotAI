import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import BusinessSelection from "./pages/BusinessSelection";
import LawyerDashboard from "./pages/LawyerDashboard";

import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Issues from "./pages/Issues";
import Recommendations from "./pages/Recommendations";
import Settings from "./pages/Settings";

import NewBusiness from "./pages/NewBusiness";
import Clients from "./pages/Clients";
import ClientDashboard from "./pages/ClientDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* Client business selection */}
        <Route
          path="/business-selection"
          element={<BusinessSelection />}
        />

        {/* New Business */}
        <Route
          path="/new-business"
          element={<NewBusiness />}
        />

        {/* Existing Business / Compliance Copilot */}
        <Route
          path="/compliance-copilot"
          element={
            <div className="flex min-h-screen">
              <Sidebar />

              <main className="flex-1 min-w-0">
                <Dashboard />
              </main>
            </div>
          }
        />

        {/* Lawyer Dashboard */}
        <Route
          path="/lawyer-dashboard"
          element={
            <div className="flex min-h-screen">
              <Sidebar />

              <main className="flex-1 min-w-0">
                <LawyerDashboard />
              </main>
            </div>
          }
        />

        {/* Lawyer Client List */}
        <Route
          path="/clients"
          element={
            <div className="flex min-h-screen">
              <Sidebar />

              <main className="flex-1 min-w-0">
                <Clients />
              </main>
            </div>
          }
        />

        {/* Individual Client Dashboard */}
        <Route
          path="/clients/:id"
          element={
            <div className="flex min-h-screen">
              <Sidebar />

              <main className="flex-1 min-w-0">
                <ClientDashboard />
              </main>
            </div>
          }
        />

        {/* Existing pages */}
        <Route
          path="/documents"
          element={
            <div className="flex min-h-screen">
              <Sidebar />

              <main className="flex-1 min-w-0">
                <Documents />
              </main>
            </div>
          }
        />

        <Route
          path="/issues"
          element={
            <div className="flex min-h-screen">
              <Sidebar />

              <main className="flex-1 min-w-0">
                <Issues />
              </main>
            </div>
          }
        />

        <Route
          path="/recommendations"
          element={
            <div className="flex min-h-screen">
              <Sidebar />

              <main className="flex-1 min-w-0">
                <Recommendations />
              </main>
            </div>
          }
        />

        <Route
          path="/settings"
          element={
            <div className="flex min-h-screen">
              <Sidebar />

              <main className="flex-1 min-w-0">
                <Settings />
              </main>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;