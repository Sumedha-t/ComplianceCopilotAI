import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Issues from "./pages/Issues";
import Recommendations from "./pages/Recommendations";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

        <Sidebar />

        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route
              path="/documents"
              element={<Documents />}
            />

            <Route
              path="/issues"
              element={<Issues />}
            />

            <Route
              path="/recommendations"
              element={<Recommendations />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;