import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../../../public/styles/JobListingActions.css';

const JobListingActions = () => {
  const navigate = useNavigate();

  return (
    <div className="button-container mt-3">
      <button 
        type="button" 
        className="btn custom-btn btn-success mx-2" 
        onClick={() => navigate('/EmployerHomepage')}
      >
        Back to Home
      </button>
      <button 
        type="button" 
        className="btn custom-btn btn-primary mx-2" 
        onClick={() => navigate('/EmployerHomepage/Job-Listings/Add-Job')}
      >
        Add a Job
      </button>
      
    </div>
  );
};

export default JobListingActions;
