import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../../../public/styles/Editjob.css";
import { toast } from "react-toastify";

const EditJob = () => {
  const location = useLocation();
  const { serialNo, image } = location.state || {};
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

  // Function to handle saving changes
  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:3001/updateJobDetails/${serialNo}`, {
        Title: title,
        employment_type: type,
        location: area,
        responsibilities: resp.join('\n'),
        salary: paisa,
        skillset: skill
      })
      .then((res)=>{
        toast(res.data.text);
      })
      // Navigate back to job listings after successful update
      navigate('/EmployerHomepage/Job-Listings');
    } catch (error) {
      console.error("Error updating job details:", error);
    }
  };

  return (
    <div className="read-only-details">
      <div>
        <label>Company Logo:</label>
        <img src={image} alt="Company Logo" />
      </div>
      <div>
        <label>Job Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      </div>
      <div>
        <label>Employment Type:</label>
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>
      <div>
        <label>Skillset:</label>
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
        />
      </div>
      <div>
        <label>Responsibilities:</label>
        <ul>
          {resp.map((item, index) => (
            <li key={index}>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updatedResp = [...resp];
                  updatedResp[index] = e.target.value;
                  setResp(updatedResp);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <div>
        <label>Salary Range:</label>
        <input
          type="text"
          value={paisa}
          onChange={(e) => setPaisa(e.target.value)}
        />
      </div>
      <button className="btn btn-success mx-2 mb-2" onClick={handleSave}>
        Save Changes
      </button>
      <button className="btn btn-primary mx-2" onClick={() => navigate('/EmployerHomepage/Job-Listings')}>
        Go Back
      </button>
    </div>
  );
};

export default EditJob;
