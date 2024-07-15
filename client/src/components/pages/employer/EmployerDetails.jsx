import { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../../../public/styles/Candidatedetails.css";

const EmployerDetails = () => {

  const navigate = useNavigate();
  const registrationId = localStorage.getItem("registrationId");
  const person = localStorage.getItem("person");
  console.log(registrationId,person);

  const [name, setName] = useState("");
  const [overview, setOverview] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [specialities, setSpecialities] = useState("");
  const [image, setImage] = useState(null);
  const [isData, setIsData] = useState(false);

  useEffect(() => {
    const getInfo = async () => {
      try {
        await axios
        .get(`http://localhost:3001/getCompanyInfo/${registrationId}`)
        .then((response)=>{
          const data = response.data;
          setName(data.company);
          setOverview(data.overview || "");
          setWebsite(data.website || "");
          setIndustry(data.industry || "");
          setSize(data.size || "");
          setImage(data.image || null);
          setSpecialities(data.specialities || "");
          setIsData(true);
        })
      } catch (error) {
        console.log(error);
      }
    };
    getInfo();
  }, [registrationId]);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("overview", overview);
    formData.append("website", website);
    formData.append("industry", industry);
    formData.append("size", size);
    formData.append("specialities", specialities);
    if (image) formData.append("image", image);
    formData.append("registrationId",registrationId);

    try {
      let url;
      if (!isData) {
        url = "http://localhost:3001/saveCompanyDetails";
      }else {
        url = "http://localhost:3001/updateCompanyDetails";
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
      navigate(`/EmployerHomepage`);
    } catch (error) {
      console.error("Error saving company details:", error);
      toast.error("Failed to save company details.");
    }
  };

  return (
    <Card className="d-flex justify-content-center my-1">
      <Card.Header>
        <h3 className="fw-semibold text-center p-2">Company Details</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Company Name:</Form.Label>
            <Form.Control type="text" name="name" value={name} onChange={(event)=>setName(event.target.value)} />
          </Form.Group>
          <Form.Group controlId="formOverview" className="mt-3">
            <Form.Label>Overview:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="overview"
              value={overview}
              onChange={(event) => setOverview(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formWebsite" className="mt-3">
            <Form.Label>Website (Optional):</Form.Label>
            <Form.Control
              type="url"
              name="website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formIndustry" className="mt-3">
            <Form.Label>Industry:</Form.Label>
            <Form.Control
              type="text"
              name="industry"
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formSize" className="mt-3">
            <Form.Label>Company Size:</Form.Label>
            <Form.Control
              type="text"
              name="size"
              value={size}
              placeholder="A range like 50-150 or exact number of employees"
              onChange={(event) => setSize(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formSpecialities" className="mt-3">
            <Form.Label>Specialities:</Form.Label>
            <Form.Control
              type="text"
              name="specialities"
              placeholder="Enter the roles required separated by commas"
              value={specialities}
              onChange={(event) => setSpecialities(event.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formImage" className="mt-3">
            <Form.Label>Company Logo:</Form.Label>
            {image ? (
              <div className="mb-3">
                <div className="d-flex justify-content-left mt-1">
                  <img
                    src={image instanceof File ? URL.createObjectURL(image) : image}
                    alt="Company Logo"
                    style={{ width: "200px", height: "auto", border: "2px solid black" }}
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
          {isData ? (
            <>
              <Button
                variant="primary"
                type="button"
                className="mt-3 me-2"
                onClick={() => {
                  navigate(`/EmployerHomepage`);
                }}
              >
                Proceed Without Saving
              </Button>
              <Button variant="success" type="submit" className="mt-3 me-2">
                Update New Changes
              </Button>
            </>
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

export default EmployerDetails;
