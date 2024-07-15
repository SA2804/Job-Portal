import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../../../public/styles/Viewjob.css";

const ViewJob = () => {
  const location = useLocation();
  const { serialNo, image } = location.state || {};
  let link;
  const person=localStorage.getItem('person');
  if (person=="Employer") {
    link='/EmployerHomepage/Job-Listings';
  } else if(person=="Candidate"){
    link="/CandidateHomepage";
  }
  
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [area, setArea] = useState("");
  const [resp, setResp] = useState([]);
  const [skill, setSkill] = useState("");
  const [paisa, setPaisa] = useState("");

  useEffect(() => {
    const getInfo = async () => {
      if (!serialNo) {
        console.error("Serial number is undefined");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/getJobDetails/${serialNo}`);
        const data = response.data[0];
        if (data) {
          setTitle(data.title);
          setType(data.employment_type);
          setArea(data.location);
          setResp(data.responsibilities.split('\n'));
          setPaisa(data.salary);
          setSkill(data.skillset);
        } else {
          console.error("No data found for the given serial number");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    getInfo();
  }, [serialNo]);

  return (
    <div className="read-only-details">
      <div>
        <label>Company Logo:</label>
        <img src={image} alt="Company Logo" />
      </div>
      <div>
        <label>Job Title:</label>
        <span>{title}</span>
      </div>
      <div>
        <label>Location:</label>
        <span>{area}</span>
      </div>
      <div>
        <label>Employment Type:</label>
        <span>{type}</span>
      </div>
      <div>
        <label>Skillset:</label>
        <span>{skill}</span>
      </div>
      <div>
        <label>Responsibilities:</label>
        <ul>
          {resp.map((resp, index) => (
            resp==""?(null):(<li key={index}>{resp}</li>)
             
          ))}
        </ul>
      </div>
      <div>
        <label>Salary Range:</label>
        <span>{paisa}</span>
      </div>
      <button className="btn btn-success mx-2" onClick={()=>{
        navigate(link)
      }}>Go Back</button>
    </div>
  );
};

export default ViewJob;
