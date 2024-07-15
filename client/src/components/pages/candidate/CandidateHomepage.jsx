import Dashboard from "../../Dashboard";
import ModifiedNav from "../ModifiedNav";
import PropTypes from "prop-types";
import Filter from "./Filter";
import { useEffect, useState } from "react";
import axios from "axios";
import CompanyCard from "../employer/JobListing/CompanyCard";
import { Card } from "react-bootstrap";

function CandidateHomepage(props) {
  const person = localStorage.getItem('person');
  console.log(person);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3001/listAllJobs");
        setJobs(response.data);
        setFilteredJobs(response.data); 
      } catch (error) {
        console.log(error);
      }
    };
    getJobs();
  }, []);

  const handleSearch = (filters) => {
    const filtered = jobs.filter(job => {
      const meetsLocation = filters.location ? job.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
      const meetsRole = filters.role ? job.title.toLowerCase().includes(filters.role.toLowerCase()) : true;
      return meetsLocation && meetsRole;
    });

    setFilteredJobs(filtered);
  };

  return (
    <>
      <ModifiedNav handleLogout={props.logout} />
      <div className="d-flex">
        <Dashboard heading1="My Profile" heading2="Companies Applied" />
        <div className="container">
          <p className="customText">Job Search Filter</p>
          <Filter onSearch={handleSearch} />
          {filteredJobs.length > 0 ? (
            filteredJobs.map((element) => (
              <CompanyCard
                key={element.sno}
                jobTitle={element.title}
                company={element.company}
                location={element.location}
                logo={element.image}
                sno={element.sno}
              />
            ))
          ) : (
            <Card className="text-center mt-3">
              <Card.Body>
                <Card.Title>No Jobs Found</Card.Title>
                <Card.Text>
                  There are no jobs matching your requirements.
                </Card.Text>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

CandidateHomepage.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default CandidateHomepage;
