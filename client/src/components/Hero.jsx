import Container from 'react-bootstrap/Container';
import '../../public/styles/hero.css';

function Hero() {
  return (
    <div className="hero-section min-vh-100 d-flex align-items-center">
      <Container fluid className="text-center py-5">
        <h1>Welcome to DreamJobs</h1>
        <p className="lead">Find your dream job or recruit the best talent. Start your journey with us today.</p>
      </Container>
    </div>
  );
}

export default Hero;
