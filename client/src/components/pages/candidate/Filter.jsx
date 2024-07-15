import { Form, Button, Row, Col } from 'react-bootstrap';
import "../../../../public/styles/Filter.css";
import PropTypes from "prop-types";

const Filter = ({ onSearch }) => {
  const handleSearch = (event) => {
    event.preventDefault();
    // Implement search logic here and pass the filters to the parent component
    // For example:
    const location = event.target.elements.location.value;
    const role = event.target.elements.role.value;
    onSearch({ location, role });
  };

  return (
    
    <Form className='' onSubmit={handleSearch}>
      <Row className="g-3 justify-content-center">
        <Col md={3} xs={12}>
          <Form.Control type="text" name="location" placeholder="Location" />
        </Col>
        <Col md={2} xs={12}>
          <Form.Control type="text" name="role" placeholder="Role" />
        </Col>
        <Col md={1} xs={12}>
          <Button variant="primary" type="submit">Search</Button>
        </Col>
      </Row>
    </Form>
  );
};
Filter.propTypes = {
  onSearch: PropTypes.func,
};
export default Filter;
