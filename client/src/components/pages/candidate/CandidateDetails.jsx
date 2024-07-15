import { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../../public/styles/Candidatedetails.css";

const CandidateDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationId = localStorage.getItem("registrationId");
  const person = localStorage.getItem("person");
  const { heading, company, title } = location.state || {};
  const { canApply } = location.state || {};
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [isData, setIsData] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/getInfo/${registrationId}`
        );
        const data = response.data[0];
        setName(data.name);
        setEmail(data.email);

        const candidateResponse = await axios.get(
          `http://localhost:3001/getCandidateDetails/${email}`
        );
        const candidateData = candidateResponse.data;
        setPhone(candidateData.phone || "");
        setAddress(candidateData.address || "");
        setBio(candidateData.bio || "");
        setImage(candidateData.image || null);
        setResume(candidateData.resume || null);
        setIsData(true);

        setInitialData({
          phone: candidateData.phone || "",
          address: candidateData.address || "",
          bio: candidateData.bio || "",
          image: candidateData.image || null,
          resume: candidateData.resume || null,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getInfo();
  }, [registrationId, email, person]);

  useEffect(() => {
    if (
      phone !== initialData.phone ||
      address !== initialData.address ||
      bio !== initialData.bio ||
      image !== initialData.image ||
      resume !== initialData.resume
    ) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  }, [phone, address, bio, image, resume, initialData]);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleResumeChange = (event) => {
    setResume(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resume) {
      toast("Please upload your resume.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("bio", bio);
    if (image) formData.append("image", image);
    if (resume) formData.append("resume",resume);

    try {
      let url;
      if (!isData) {
        url = "http://localhost:3001/saveCandidateDetails";
      } else {
        url = "http://localhost:3001/updateCandidateDetails";
      }

      const response = await axios({
        method: isData ? "put" : "post",
        url: url,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.text);
      navigate(`/${person}Homepage`);
    } catch (error) {
      console.error("Error saving candidate details:", error);
      toast.error("Failed to save candidate details.");
    }
  };
  const handleApplication = async (event) => {
    event.preventDefault();
  
    const val = window.prompt('Do you want to submit your resume (y/n):');
    if (val !== 'y') {
      return;
    }
  
    const formData = new FormData();
    formData.append('registrationId', registrationId);
    if (image) formData.append('image', image);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    if (resume) formData.append('resume', resume);
    formData.append('company', company);
    formData.append('title', title);
  
    try {
      const response = await axios({
        method: 'post',
        url: 'http://localhost:3001/jobApplication',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      toast(response.data.text);
      navigate('/CandidateHomepage');
    } catch (error) {
      console.error('There was an error submitting the form:', error);
      toast.error('Failed to submit the application. Please try again.');
    }
  };

  return (
    <Card className="d-flex justify-content-center my-1">
      <Card.Header>
        {heading ? (
          <h3 className="fw-semibold text-center p-2">{heading}</h3>
        ) : (
          <h3 className="fw-semibold text-center p-2">Candidate Details</h3>
        )}
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name:</Form.Label>
            <Form.Control type="text" name="name" value={name} readOnly />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mt-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control type="email" name="email" value={email} readOnly />
          </Form.Group>
          <Form.Group controlId="formPhone" className="mt-3">
            <Form.Label>Phone:</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formAddress" className="mt-3">
            <Form.Label>Address:</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formImage" className="mt-3">
            <Form.Label>Image or Avatar (Optional):</Form.Label>
            {image ? (
              <div className="mb-3">
                <div className="d-flex justify-content-left mt-1">
                  <img
                    src={
                      image instanceof File ? URL.createObjectURL(image) : image
                    }
                    alt="Candidate"
                    style={{
                      width: "200px",
                      height: "auto",
                      border: "2px solid black",
                    }}
                  />
                </div>
                <Form.Control
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  onClick={() => {
                    toast.warning("This will change the existing image.");
                  }}
                />
              </div>
            ) : (
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            )}
          </Form.Group>
          <Form.Group controlId="formResume" className="mt-3">
            <Form.Label>Resume PDF:</Form.Label>
            {resume ? (
              <div className="mb-3">
                <div className="mt-1">
                  <a
                    href={
                      resume instanceof File
                        ? URL.createObjectURL(resume)
                        : resume
                    }
                    download="resume.pdf"
                  >
                    Download Resume
                  </a>
                </div>
                <Form.Control
                  type="file"
                  name="resume"
                  accept=".pdf"
                  onChange={handleResumeChange}
                  onClick={() => {
                    toast.warning("This will change the existing resume.");
                  }}
                />
              </div>
            ) : (
              <Form.Control
                type="file"
                name="resume"
                accept=".pdf"
                onChange={handleResumeChange}
              />
            )}
          </Form.Group>
          <Form.Group controlId="formBio" className="mt-3">
            <Form.Label>Bio (Optional):</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
          </Form.Group>
          {isData ? (
            <div className="d-flex flex-wrap justify-content-center">
              <Button
                variant="primary"
                type="button"
                className="mt-3 me-2 w-75"
                onClick={() => {
                  navigate(`/${person}Homepage`);
                }}
              >
                Proceed Without Saving
              </Button>
              <Button
                variant="warning"
                type="submit"
                className="mt-3 me-2 w-75"
              >
                Update New Changes
              </Button>
              {canApply ? (
                !isEdited ? (
                  <Button
                    variant="success"
                    type="button"
                    className="mt-3 me-2 w-75"
                    onClick={handleApplication}
                  >
                    Apply for the Job
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    type="button"
                    className="mt-3 me-2 w-75"
                    onClick={handleApplication}
                    disabled
                  >
                    Apply for the Job
                  </Button>
                )
              ) : null}
            </div>
          ) : (
            <Button variant="primary" type="submit" className="mt-3 me-2">
              Save
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CandidateDetails;
