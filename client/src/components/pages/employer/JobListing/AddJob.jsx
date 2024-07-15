import { useEffect, useState } from "react";
import { Container, Form, Button } from 'react-bootstrap';
import ModifiedNav from "../../ModifiedNav"
import axios from "axios";
import "../../../../../public/styles/JobForm.css"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddJob() {
    const [formData, setFormData] = useState({
        jobTitle:'',
        employmentType: '',
        skillset: '',
        responsibilities: '',
        salaryRange: '',
        location: '',
        registrationId: localStorage.getItem("registrationId")
      });
    const [isBtnDisabled,setIsBtnDisabled]=useState(true);
      const navigate = useNavigate();
      const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
          ...formData,
          [name]: value
        });
      };
      useEffect(()=>{
        if (formData.jobTitle&&formData.employmentType&&formData.skillset&&formData.responsibilities&&formData.salaryRange&&formData.location) {
            setIsBtnDisabled(false)
        }
      },[
        formData.jobTitle,
        formData.employmentType,
        formData.skillset,
        formData.responsibilities,
        formData.salaryRange,
        formData.location
      ])
      const handleSubmit = async(event) => {
        event.preventDefault();
        console.log(formData);

        try {
            await axios
            .post('http://localhost:3001/jobPosting',formData)
            .then((response)=>{
                toast(response.data.text);
                navigate('/EmployerHomePage/Job-Listings')
            })
        } catch (error) {
            console.log(error);
        }
        
      };
  return (
    <div>
        <ModifiedNav/>
        <Container className="d-flex justify-content-center align-items-center vh-100">
      <Form onSubmit={handleSubmit} className="w-50 bg-light p-4 border border-4 border-end">
      <Form.Group controlId="title">
          <Form.Label>Job Title:</Form.Label>
          <Form.Control
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="Enter job title"
            required
          />
        </Form.Group>
        <Form.Group controlId="employmentType">
          <Form.Label>Employment Type:</Form.Label>
          <Form.Control as="select" name="employmentType" value={formData.employmentType} onChange={handleChange} required>
            <option value="">Select Employment Type</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-Time</option>
            <option value="Part-time">Part-Time</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="skillset">
          <Form.Label>Skills:</Form.Label>
          <Form.Control
            type="text"
            name="skillset"
            value={formData.skillset}
            onChange={handleChange}
            placeholder="Enter skills separated by commas"
            required
          />
        </Form.Group>

        <Form.Group controlId="responsibilities">
          <Form.Label>Responsibilities:</Form.Label>
          <Form.Control
            as="textarea"
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            placeholder="Enter responsibilities separated by bullet points"
            required
          />
        </Form.Group>

        <Form.Group controlId="salaryRange">
          <Form.Label>Salary Range:</Form.Label>
          <Form.Control
            type="text"
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleChange}
            placeholder="Enter salary range or exact salary"
            required
          />
        </Form.Group>

        <Form.Group controlId="location">
          <Form.Label>Location:</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            required
          />
        </Form.Group>

        <Button variant="success" type="submit" className="mt-3" disabled={isBtnDisabled}>
          Submit
        </Button>
      </Form>
    </Container>
    </div>
  )
}

export default AddJob