import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../../public/styles/customStyles.css';
import logo from "../../public/assets/logo.png";
import { Link } from 'react-router-dom';

function NavigationBar() {
  return (
    <Navbar expand="sm" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to='/' className="d-flex align-items-center">
          <img src={logo} alt="logo" width="30" className="me-2" />
          DreamJobs
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to='/CandidateLogin'>Candidate Login</Nav.Link>
            <Nav.Link as={Link} to='/EmployerLogin'>Employer Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
