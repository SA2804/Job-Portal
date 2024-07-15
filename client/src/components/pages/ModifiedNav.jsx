import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import '../../../public/styles/customStyles.css'; // Ensure correct path
import logo from "../../../public/assets/logo.png";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function ModifiedNav({ handleLogout }) {
  return (
    <Navbar expand="sm" className="custom-navbar">
      <Container>
        <Navbar.Brand className="d-flex align-items-center">
          <img src={logo} alt="logo" width="30" className="me-2" />
          DreamJobs
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

ModifiedNav.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default ModifiedNav;
