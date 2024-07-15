import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../public/styles/Dashboard.css';
import PropTypes from "prop-types";

const Dashboard = (props) => {
    const person = localStorage.getItem('person');
    let respectiveLink;
    if(person =="Employer"){
       respectiveLink = "Job-Listings";
    }
    else if(person=="Candidate"){
       respectiveLink = "Companies-Applied";
    }

  return (
    <span className="dashboard d-flex flex-column min-vh-100 p-3">
      <Nav className="flex-column">
        <LinkContainer to={`/${person}Homepage/Profile`}>
          <Nav.Link>{props.heading1}</Nav.Link>
        </LinkContainer>
        <LinkContainer to={respectiveLink}>
          <Nav.Link>{props.heading2}</Nav.Link>
        </LinkContainer>
      </Nav>
    </span>
  );
};
Dashboard.propTypes = {
  heading1: PropTypes.string.isRequired,
  heading2: PropTypes.string.isRequired,
};
export default Dashboard;
