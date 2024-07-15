import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Footer from "../../Footer";
import ModifiedNav from "../ModifiedNav";
import axios from "axios";
import CompanyCard from "../employer/JobListing/CompanyCard";
import { toast } from "react-toastify";

function CompaniesApplied() {
  const registrationId = localStorage.getItem("registrationId");
  const [jobDetails, setJobDetails] = useState([]);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/CompaniesApplied/${registrationId}`
        );
        setJobDetails(response.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };
    getInfo();
  }, [registrationId]);

  const onDeleteApplication = async (serial) => {
    const val = window.prompt(
      "Are you sure you want to delete your application? Action can't be reversed!! (y/n):"
    );
    if (val === "y") {
      try {
        const response = await axios.delete(
          "http://localhost:3001/deleteApplication",
          {
            data: { sno: serial },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.success(response.data.text);
        setJobDetails(jobDetails.filter((app) => app.sno !== serial));
      } catch (err) {
        console.error("Error deleting application:", err);
        toast.error("Failed to delete application.");
      }
    }
  };

  return (
    <>
      <div className="min-vh-100">
        <ModifiedNav />
        {jobDetails.length === 0 ? (
          <Card className="text-center mt-5 mx-auto" style={{ width: '50%' }}>
            <Card.Body>
              <Card.Title>No Applications Found</Card.Title>
              <Card.Text>
                You have not applied to any jobs yet.
              </Card.Text>
            </Card.Body>
          </Card>
        ) : (
          jobDetails.map((element) => (
            <CompanyCard
              key={element.sno}
              sno={element.sno}
              deleteApplication="true"
              user={element.name}
              jobTitle={element.title}
              company={element.company}
              handleDeleteApplication={() => onDeleteApplication(element.sno)}
            />
          ))
        )}
      </div>
      <Footer />
    </>
  );
}

export default CompaniesApplied;
