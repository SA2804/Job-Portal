import Dashboard from "../../Dashboard";
import ModifiedNav from "../ModifiedNav";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Footer from "../../Footer";
import axios from "axios";
import CandidateManagement from "./CandidateManagement";
import { Card } from "react-bootstrap";

function EmployerHomepage(props) {
  const registrationId = localStorage.getItem("registrationId");
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const getCompanyName = async () => {
      await axios
        .get(`http://localhost:3001/getCompanyInfo/${registrationId}`)
        .then((response) => setCompany(response.data.company));
    };
    const getInfo = async () => {
      await axios
        .get(`http://localhost:3001/applicationInfo/${company}`)
        .then((response) => {
          setJobs(response.data);
        });
    };
    getCompanyName();
    getInfo();
  },[registrationId,company]);
  console.log(jobs);

  return (
    <>
      <ModifiedNav handleLogout={props.logout} />
      <div className="d-flex">
        <Dashboard heading1="Company Info" heading2="Job Listings" />
        {jobs.length > 0 ? (
          <CandidateManagement candidates={jobs} />
        ) : (
          <Card className="text-center mt-3">
            <Card.Body>
              <Card.Title>No Applicants Found</Card.Title>
              <Card.Text>
                There are no applicants matching your requirements.
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      </div>
      <Footer />
    </>
  );
}
EmployerHomepage.propTypes = {
  logout: PropTypes.func.isRequired,
};
export default EmployerHomepage;
