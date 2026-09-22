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

import NewBusiness from "./pages/NewBusiness";
import Clients from "./pages/Clients";
import ClientDashboard from "./pages/ClientDashboard";


// ==================================================
// NORMAL WORKSPACE LAYOUT
// ==================================================

function WorkspaceLayout({ children }) {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <main className="flex-1 min-w-0">
        {children}
      </main>

    </div>
  );
}


// ==================================================
// NEW BUSINESS LAYOUT
// No sidebar intentionally.
// ==================================================

function NewBusinessLayout() {
  return (
    <div className="min-h-screen">
      <NewBusiness />
    </div>
  );
}


// ==================================================
// APP
// ==================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==============================================
            LOGIN
        ============================================== */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* ==============================================
            BUSINESS SELECTION
        ============================================== */}

        <Route
          path="/business-selection"
          element={<BusinessSelection />}
        />


        {/* ==============================================
            NEW BUSINESS
        ============================================== */}

        <Route
          path="/new-business"
          element={<NewBusinessLayout />}
        />


        {/* ==============================================
            CLIENT - COMPLIANCE COPILOT
        ============================================== */}

        <Route
          path="/compliance-copilot"
          element={
            <WorkspaceLayout>
              <Dashboard />
            </WorkspaceLayout>
          }
        />


        {/* ==============================================
            DOCUMENTS
        ============================================== */}

        <Route
          path="/documents"
          element={
            <WorkspaceLayout>
              <Documents />
            </WorkspaceLayout>
          }
        />


        {/* ==============================================
            COMPLIANCE ISSUES
        ============================================== */}

        <Route
          path="/issues"
          element={
            <WorkspaceLayout>
              <Issues />
            </WorkspaceLayout>
          }
        />


        {/* ==============================================
            RECOMMENDATIONS
        ============================================== */}

        <Route
          path="/recommendations"
          element={
            <WorkspaceLayout>
              <Recommendations />
            </WorkspaceLayout>
          }
        />


        {/* ==============================================
            LAWYER DASHBOARD
        ============================================== */}

        <Route
          path="/lawyer-dashboard"
          element={
            <WorkspaceLayout>
              <LawyerDashboard />
            </WorkspaceLayout>
          }
        />


        {/* ==============================================
            LAWYER CLIENTS
        ============================================== */}

        <Route
          path="/clients"
          element={
            <WorkspaceLayout>
              <Clients />
            </WorkspaceLayout>
          }
        />


        {/* ==============================================
            INDIVIDUAL CLIENT
        ============================================== */}

        <Route
          path="/clients/:id"
          element={
            <WorkspaceLayout>
              <ClientDashboard />
            </WorkspaceLayout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;