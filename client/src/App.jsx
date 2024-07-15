import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./components/pages/Homepage";
import Error from "./components/Error";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Verify from "./components/Auth/VerifyOTP";
import ChangePassword from "./components/Auth/ChangePassword";
import PrivateRoute from "./components/PrivateRoute";
import CandidateHomepage from "./components/pages/candidate/CandidateHomepage"
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import EmployerHomepage from "./components/pages/employer/EmployerHomepage";
import CandidateDetails from "./components/pages/candidate/CandidateDetails";
import EmployerDetails from "./components/pages/employer/EmployerDetails";
import JobListing from "./components/pages/employer/JobListing";
import AddJob from "./components/pages/employer/JobListing/AddJob";
import ViewJob from "./components/pages/employer/JobListing/ViewJob";
import EditJob from "./components/pages/employer/JobListing/EditJob";
import CompaniesApplied from "./components/pages/candidate/CompaniesApplied";

function App() {

  const checkTokenValidity = (Token) => {
    if (!Token) return false;
    const { exp } = jwtDecode(Token);
    return exp * 1000 > Date.now();
  };
  const [auth, setAuth] = useState({
    Token: localStorage.getItem("authToken") || null,
  });

  useEffect(() => {

    const token = localStorage.getItem("authToken");
    if (token && checkTokenValidity(token)) {
      setAuth({ Token: token });
    } else {
      localStorage.removeItem("authToken");
      setAuth({ Token: null });
    }
  }, []);
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("registrationId");
    localStorage.removeItem("person");
    setAuth({ Token: null });
  };
  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Error />} />
          <Route
            path="/CandidateLogin"
            element={<Login person="Candidate" setAuth={setAuth}  />}
          />
          <Route path="/EmployerLogin" element={<Login person="Employer" setAuth={setAuth} />} />
          <Route
            path="/CandidateRegister"
            element={<Register person="Candidate" />}
          />
          <Route
            path="/EmployerRegister"
            element={<Register person="Employer" />}
          />
          <Route
            path="/CandidateForgotPassword"
            element={<ForgotPassword person="Candidate" />}
          />
          <Route
            path="/EmployerForgotPassword"
            element={<ForgotPassword person="Employer" />}
          />
          <Route
            path="/CandidateVerifyOTP"
            element={<Verify person="Candidate" />}
          />
          <Route
            path="/EmployerVerifyOTP"
            element={<Verify person="Employer" />}
          />

          <Route
            path="/CandidateChangePassword"
            element={<ChangePassword person="Candidate" />}
          />
          <Route
            path="/EmployerChangePassword"
            element={<ChangePassword person="Employer" />}
          />
          <Route element={<PrivateRoute auth={auth} />}>
              <Route path="/CandidateHomepage" element={<CandidateHomepage logout={logout}/>}/>
              <Route path="/EmployerHomepage" element={<EmployerHomepage logout={logout}/>}/>
              <Route path="/CandidateHomepage/Profile" element={<CandidateDetails/>}/>
              <Route path="/EmployerHomepage/Profile" element={<EmployerDetails/>}/>
              <Route path="/EmployerHomepage/Job-Listings" element={<JobListing logout={logout}/>}/>
              <Route path="/EmployerHomepage/Job-Listings/Add-Job" element={<AddJob/>}/>
              <Route path="/EmployerHomepage/Job-Listings/View-Job" element={<ViewJob/>}/>
              <Route path="/EmployerHomepage/Job-Listings/Edit-Job" element={<EditJob/>}/>
              <Route path="/CandidateHomepage/View-Job" element={<ViewJob/>}/>
              <Route path="/CandidateHomepage/Companies-Applied" element={<CompaniesApplied/>}/>


            </Route>
        </Routes>
      </Router>
    </>
  );
}
export default App;
