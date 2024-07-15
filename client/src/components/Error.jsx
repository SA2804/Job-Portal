import '../../public/styles/error.css'; 

function Error() {
  return (
    <section className="error-container d-flex justify-content-center align-items-center">
      <div className="error-content">
        <h2 className="error-title">
          <span className="display-1 fw-bold">4</span>
          <i className="bi bi-exclamation-circle-fill error-icon"></i>
          <span className="display-1 fw-bold bsb-flip-h">4</span>
        </h2>
        <h3 className="h2 mb-2">Oops! You&apos;re lost.</h3>
        <p className="error-message">
          The page you are looking for was not found.
        </p>
        <a href="/" className="error-link">
          Back to Home
        </a>
      </div>
    </section>
  );
}

export default Error;
