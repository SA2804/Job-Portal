import { Card, Button, Container, Row, Col } from "react-bootstrap";
import "../../../../../public/styles/CompanyCard.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const CompanyCard = (props) => {
  console.log(props);
  const person = localStorage.getItem("person");
  const navigate = useNavigate();
  let link;

  if (person === "Employer") {
    link = "/EmployerHomepage/Job-Listings/View-Job";
  } else if (person === "Candidate") {
    link = "/CandidateHomepage/View-Job";
  }

  const onView = (serial, logo) => {
    navigate(link, {
      state: {
        serialNo: serial,
        image: logo,
      },
    });
  };
  const onApply = (serial, company, title) => {
    toast.info("Verify your Credentials before applying for the job.");
    navigate("/CandidateHomepage/Profile", {
      state: {
        heading: "Profile Verification",
        canApply: true,
        sno: serial,
        company: company,
        title: title,
      },
    });
  };
  const onEdit = (serial, logo) => {
    navigate("/EmployerHomepage/Job-Listings/Edit-Job", {
      state: {
        serialNo: serial,
        image: logo,
      },
    });
  };
  
  return (
    <Container className="my-3">
      <Card className="company-card">
        <Row className="no-gutters">
          <Col
            md={4}
            className="d-flex align-items-center justify-content-center"
          >
            {props.logo ? (
              <Card.Img
                src={props.logo}
                alt="Company Logo"
                className="company-logo"
              />
            ) : null}
          </Col>
          <Col md={8}>
            <Card.Body>
              <Card.Title>{props.jobTitle}</Card.Title>
              {props.company && <Card.Title>{props.company}</Card.Title>}
              <Card.Text>
                <small className="text-muted">{props.location}</small>
              </Card.Text>
              <div className="d-flex justify-content-between">
                {person === "Candidate" &&
                  props.deleteApplication !== "true" && (
                    <>
                      <Button
                        className="me-2"
                        variant="primary"
                        onClick={() => onView(props.sno, props.logo)}
                      >
                        View
                      </Button>
                      <Button
                        variant="success"
                        onClick={() =>
                          onApply(props.sno, props.company, props.jobTitle)
                        }
                      >
                        Apply
                      </Button>
                    </>
                  )}
                {person === "Candidate" &&
                  props.deleteApplication == "true" && (
                    <>
                      <Button
                        variant="danger"
                        onClick={props.handleDeleteApplication}
                      >
                        Delete Application
                      </Button>
                    </>
                  )}
                {person === "Employer" && (
                  <>
                    <Button
                      className="me-2"
                      variant="primary"
                      onClick={() => onView(props.sno, props.logo)}
                    >
                      View
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => onEdit(props.sno, props.logo)}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" onClick={props.onDelete}>
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

CompanyCard.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  user: PropTypes.string,
  jobTitle: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  deleteApplication: PropTypes.string,
  company: PropTypes.string,
  sno: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onDelete: PropTypes.func,
  handleDeleteApplication:PropTypes.func
};

export default CompanyCard;
