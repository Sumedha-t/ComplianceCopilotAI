import { useState } from "react";

import {
  Building2,
  Factory,
  MapPin,
  Users,
  IndianRupee,
  UserRound,
  ArrowRight,
  Loader2,
  ArrowLeft,
  ArrowLeftRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import api from "../services/api";


function NewBusiness() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: "",
    industry: "",
    state: "",
    founders: "",
    employees: "",
    annual_turnover: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");


  // ==================================================
  // FORM CHANGE
  // ==================================================

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };


  // ==================================================
  // SUBMIT CONSULTATION
  // ==================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {

      const response = await api.post(
        "/consultation/new",
        {
          company_name: formData.company_name,
          industry: formData.industry,
          state: formData.state,
          founders: Number(formData.founders),
          employees: Number(formData.employees),
          annual_turnover: Number(formData.annual_turnover),
        }
      );

      setResult(response.data.data);

    } catch (error) {

      console.error("Consultation error:", error);

      setError(
        "Unable to complete the consultation. Please check that the backend is running and try again."
      );

    } finally {

      setIsLoading(false);

    }
  };


  // ==================================================
  // RESET
  // ==================================================

  const resetConsultation = () => {

    setResult(null);
    setError("");

  };


  // ==================================================
  // CLIENT WORKSPACE
  // ==================================================

  const goToClientWorkspace = () => {

    localStorage.setItem("workspaceRole", "client");

    navigate("/business-selection");

  };


  // ==================================================
  // LAWYER WORKSPACE
  // ==================================================

  const goToLawyerWorkspace = () => {

    localStorage.setItem("workspaceRole", "lawyer");

    navigate("/lawyer-dashboard");

  };


  // ==================================================
  // RESULT VIEW
  // ==================================================

  if (result) {

    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

        <div className="max-w-6xl mx-auto">

          {/* TOP NAVIGATION */}

          <div className="flex items-center justify-between mb-5">

            <button
              type="button"
              onClick={goToClientWorkspace}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Business Selection
            </button>


            <button
              type="button"
              onClick={goToLawyerWorkspace}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
            >
              Switch to Lawyer
              <ArrowLeftRight className="w-4 h-4" />
            </button>

          </div>


          {/* HEADER */}

          <div>

            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              New Business Readiness
            </p>

            <h1 className="text-2xl font-bold text-gray-800 mt-1">
              {formData.company_name}
            </h1>

            <p className="text-gray-500 mt-1">
              Initial compliance assessment based on your business profile.
            </p>

          </div>


          {/* RECOMMENDED STRUCTURE */}

          <div className="mt-8 bg-white rounded-2xl shadow-md p-6">

            <div className="flex items-center gap-3">

              <div className="bg-blue-50 p-2.5 rounded-xl">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>

              <div>

                <p className="text-sm text-gray-500">
                  Recommended Business Structure
                </p>

                <h2 className="text-xl font-bold text-gray-800 mt-1">
                  {result.recommended_structure}
                </h2>

              </div>

            </div>


            <div className="mt-5 bg-blue-50 rounded-xl p-4">

              <p className="text-sm font-semibold text-blue-800">
                Why this structure?
              </p>

              <p className="text-sm text-blue-700 mt-1">
                {result.reason}
              </p>

            </div>

          </div>


          {/* REGISTRATIONS + INDUSTRY */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            {/* REQUIRED REGISTRATIONS */}

            <div className="bg-white rounded-2xl shadow-md p-6">

              <h2 className="text-lg font-semibold text-gray-800">
                Required Registrations
              </h2>

              <div className="mt-5 space-y-3">

                {result.required_registrations?.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >

                      <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">

                        <span className="text-green-600 text-sm">
                          ✓
                        </span>

                      </div>

                      <span className="text-sm text-gray-700">
                        {item}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>


            {/* INDUSTRY COMPLIANCE */}

            <div className="bg-white rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3">

                <Factory className="w-5 h-5 text-amber-500" />

                <h2 className="text-lg font-semibold text-gray-800">
                  Industry Compliance
                </h2>

              </div>

              <div className="mt-5 space-y-3">

                {result.industry_compliance?.map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex items-center gap-3"
                    >

                      <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center">

                        <span className="text-amber-600 text-sm">
                          !
                        </span>

                      </div>

                      <span className="text-sm text-gray-700">
                        {item}
                      </span>

                    </div>

                  )
                )}

              </div>

            </div>

          </div>


          {/* STATE COMPLIANCE */}

          <div className="mt-6 bg-white rounded-2xl shadow-md p-6">

            <div className="flex items-center gap-3">

              <div className="bg-purple-50 p-2 rounded-xl">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                State-Specific Compliance
              </h2>

            </div>

            <div className="mt-5 space-y-3">

              {result.state_compliance?.map(
                (item, index) => (

                  <div
                    key={index}
                    className="bg-purple-50 rounded-xl p-4"
                  >

                    <p className="text-sm text-purple-800">
                      {item}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>


          {/* CHECKLIST */}

          <div className="mt-6 bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-lg font-semibold text-gray-800">
              Initial Compliance Checklist
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Documents and approvals your business should prepare.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

              {result.initial_compliance_checklist?.map(
                (item, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-3 border border-gray-100 rounded-xl p-3"
                  >

                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />

                    <span className="text-sm text-gray-700">
                      {item}
                    </span>

                  </div>

                )
              )}

            </div>

          </div>


          {/* NEXT STEPS */}

          <div className="mt-6 bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-lg font-semibold text-gray-800">
              Next Steps
            </h2>

            <div className="mt-5 space-y-4">

              {result.next_steps?.map(
                (step, index) => (

                  <div
                    key={index}
                    className="flex gap-4"
                  >

                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-semibold shrink-0">
                      {index + 1}
                    </div>

                    <p className="text-sm text-gray-600 pt-1">
                      {step}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>


          {/* ACTIONS */}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">

            <button
              type="button"
              onClick={resetConsultation}
              className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Start New Consultation
            </button>

            <button
              type="button"
              onClick={goToClientWorkspace}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Business Selection
            </button>

          </div>

        </div>

      </div>
    );
  }


  // ==================================================
  // CONSULTATION FORM
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

      <div className="max-w-4xl mx-auto">

        {/* TOP NAVIGATION */}

        <div className="flex items-center justify-between mb-5">

          <button
            type="button"
            onClick={goToClientWorkspace}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Business Selection
          </button>


          <button
            type="button"
            onClick={goToLawyerWorkspace}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            Switch to Lawyer
            <ArrowLeftRight className="w-4 h-4" />
          </button>

        </div>


        {/* HEADER */}

        <div>

          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            New Business
          </p>

          <h1 className="text-2xl font-bold text-gray-800 mt-1">
            Business Consultation
          </h1>

          <p className="text-gray-500 mt-1">
            Tell us about your business and we'll generate an initial
            compliance readiness plan.
          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white rounded-2xl shadow-md p-6"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* COMPANY NAME */}

            <div className="md:col-span-2">

              <label className="text-sm font-medium text-gray-700">
                Company Name
              </label>

              <div className="relative mt-2">

                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. NovaTech Manufacturing"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />

              </div>

            </div>


            {/* INDUSTRY */}

            <div>

              <label className="text-sm font-medium text-gray-700">
                Industry
              </label>

              <div className="relative mt-2">

                <Factory className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                >

                  <option value="">
                    Select industry
                  </option>

                  <option value="Manufacturing">
                    Manufacturing
                  </option>

                  <option value="Technology">
                    Technology
                  </option>

                  <option value="Healthcare">
                    Healthcare
                  </option>

                  <option value="Retail">
                    Retail
                  </option>

                  <option value="Finance">
                    Finance
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>


            {/* STATE */}

            <div>

              <label className="text-sm font-medium text-gray-700">
                State
              </label>

              <div className="relative mt-2">

                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                >

                  <option value="">
                    Select state
                  </option>

                  <option value="Karnataka">
                    Karnataka
                  </option>

                  <option value="Maharashtra">
                    Maharashtra
                  </option>

                  <option value="Tamil Nadu">
                    Tamil Nadu
                  </option>

                  <option value="Telangana">
                    Telangana
                  </option>

                  <option value="Kerala">
                    Kerala
                  </option>

                  <option value="Delhi">
                    Delhi
                  </option>

                  <option value="Gujarat">
                    Gujarat
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>


            {/* FOUNDERS */}

            <div>

              <label className="text-sm font-medium text-gray-700">
                Number of Founders
              </label>

              <div className="relative mt-2">

                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="number"
                  name="founders"
                  value={formData.founders}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 2"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />

              </div>

            </div>


            {/* EMPLOYEES */}

            <div>

              <label className="text-sm font-medium text-gray-700">
                Number of Employees
              </label>

              <div className="relative mt-2">

                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="number"
                  name="employees"
                  value={formData.employees}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g. 50"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />

              </div>

            </div>


            {/* TURNOVER */}

            <div className="md:col-span-2">

              <label className="text-sm font-medium text-gray-700">
                Annual Turnover
              </label>

              <div className="relative mt-2">

                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                <input
                  type="number"
                  name="annual_turnover"
                  value={formData.annual_turnover}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g. 30000000"
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />

              </div>

              <p className="text-xs text-gray-400 mt-1">
                Enter the annual turnover in Indian Rupees.
              </p>

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4">

              <p className="text-sm text-red-700">
                {error}
              </p>

            </div>

          )}


          {/* SUBMIT */}

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium text-white transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {isLoading ? (

              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Preparing your compliance assessment...
              </>

            ) : (

              <>
                Generate Compliance Readiness Plan
                <ArrowRight className="w-5 h-5" />
              </>

            )}

          </button>

        </form>

      </div>

    </div>
  );
}

export default NewBusiness;