import { useEffect, useState } from "react";
import Footer from "../../Footer";
import ModifiedNav from "../ModifiedNav";
import CompanyCard from "./JobListing/CompanyCard";
import JobListingActions from "./JobListing/JobListingActions";
import axios from "axios";
import PropTypes from "prop-types";

function JobListing(props) {

  const registrationId = localStorage.getItem("registrationId");
  const [jobs, setJobs] = useState([]);
  const [image,setImage]= useState(null);

  useEffect(() => {
    const getJobsInfo = async () => {
      try {
        await axios.get(`http://localhost:3001/jobsInfo/${registrationId}`).then((response) => {
          setJobs(response.data);
        });
      } catch (error) {
        console.log(error);
      }
    };
    const getCompanyLogo = async()=>{
      try {
        await axios.get(`http://localhost:3001/getCompanyInfo/${registrationId}`).then((response) => {
          console.log(response.data);
          setImage(response.data.image)
        });
      } catch (error) {
        console.log(error);
      }
    }
    getJobsInfo();
    getCompanyLogo();
  }, [registrationId]);

  const handleDelete = async(serialNo) =>{
    try {
      await axios.delete(`http://localhost:3001/deleteJob/${serialNo}`);
      setJobs(jobs.filter(job => job.sno !== serialNo));
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  }

  return (
    <>
      <div className="min-vh-100">
        <ModifiedNav handleLogout={props.logout} />
        <JobListingActions />
        {jobs.map((element) => {
          return(
              <CompanyCard
                key={element.sno}
                sno={element.sno}
                logo={image}
                jobTitle={element.title}
                location={element.location}
                onDelete={()=>handleDelete(element.sno)}
              />
        )})
          }
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}
JobListing.propTypes = {
  logout: PropTypes.func.isRequired,
};
export default JobListing;
