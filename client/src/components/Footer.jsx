import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../public/styles/footer.css'; 

function Copyright() {
  return (
    <p className="text-muted">
      &copy; DreamJobs {new Date().getFullYear()} 
    </p>
  );
}

function Footer() {
  return (
    <div className="d-flex flex-column">
      <footer className="footer py-3 bg-light text-center mt-auto">
        <Container>
          <Row>
            <Col>
              <Copyright />
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
}

export default Footer;
